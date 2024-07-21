const express = require('express');

const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Helper function to populate rating and image columns
const populateRatingAndImageColumn = async (query) => {
  const spots = await Spot.findAll({
    ...query,
  });
  const previewImages = await SpotImage.findAll({
    where: {
      preview: true,
    },
  });

  const avgRatingArray = [];

  for (let i = 0; i < spots.length; i++) {
    let ratingAmount = 0;

    const reviewSpecificSpotId = await Review.findAll({
      where: {
        spotId: spots[i].id,
      },
    });

    if (reviewSpecificSpotId.length > 0) {
      for (let j = 0; j < reviewSpecificSpotId.length; j++) {
        ratingAmount += reviewSpecificSpotId[j].stars;
      }
      avgRatingArray.push(ratingAmount / reviewSpecificSpotId.length);
    } else {
      avgRatingArray.push(null); // Or some default value
    }
  }

  for (let k = 0; k < spots.length; k++) {
    const previewImage = previewImages.find(img => img.spotId === spots[k].id);
    spots[k].previewImage = previewImage ? previewImage.url : null; // Or some default value
    spots[k].avgRating = avgRatingArray[k];

    await spots[k].save();
  }

  return spots;
};

// GET ALL SPOTS
router.get("/", async (req, res) => {
  const error = {
    message: {},
    errors: {},
  };

  const query = {};

  let { page, size } = req.query;

  if (page && size) {
    page = +page;
    size = +size;

    if (isNaN(page) || isNaN(size)) {
      res.status(400).json({
        message: "Bad Request",
        errors: {
          page: isNaN(page) ? "Page must be a number" : undefined,
          size: isNaN(size) ? "Size must be a number" : undefined,
        },
      });
      return;
    }

    if ((page < 1 || page > 10) || (size < 1 || size > 20)) {
      res.status(400).json({
        message: "Bad Request",
        errors: {
          page: page < 1 || page > 10 ? "Page must be greater than or equal to 1; or less than or equal to 10" : undefined,
          size: size < 1 || size > 20 ? "Size must be greater than or equal to 1; or less than or equal to 20" : undefined,
        },
      });
      return;
    }

    query.limit = size;
    query.offset = size * (page - 1);
  }

  try {
    const spots = await populateRatingAndImageColumn(query);
    res.json({ spots, page, size });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST A NEW SPOT
router.post("/", async (req, res) => {
  const { user } = req;
  const error = {
    message: {},
    errors: {},
  };

  if (user) {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    if (
      address &&
      city &&
      state &&
      country &&
      lat &&
      lng &&
      name &&
      description &&
      price
    ) {
      const newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      });

      res.statusCode = 201;
      res.json(newSpot);
    } else {
      const spotObj = {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      };

      res.statusCode = 400;
      error.message = "Bad Request";

      for (let key in spotObj) {
        if (spotObj[key] === undefined || spotObj[key] === "") {
          error["errors"][key] = key + " is required";
        }
      }

      return res.json(error);
    }
  } else {
    res.statusCode = 401;
    res.json({ message: "Authentication required" });
  }
});

// POST SPOT IMAGES
router.post("/:spotId/images", async (req, res) => {
  const { user } = req;
  const error = {
    message: {},
    errors: {},
  };

  if (user) {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      res.statusCode = 404;
      res.json({ message: "Spot couldn't be found" });
    } else {
      const userSpot = await Spot.findOne({
        where: {
          id: req.params.spotId,
          ownerId: user.id,
        },
      });

      if (!userSpot) {
        res.statusCode = 403;
        res.json({ message: "Forbidden" });
      }

      const { url, preview } = req.body;

      if (url && (preview === true || preview === false)) {
        const spotImages = await SpotImage.findAll({
          where: {
            spotId: spot.id,
          },
        });

        if (preview === true && spotImages.length > 0) {
          for (let i = 0; i < spotImages.length; i++) {
            if (spotImages[i].preview === true) {
              spotImages[i].preview = false;

              await spotImages[i].save();
            }
          }
        }

        const spotImage = await SpotImage.create({
          spotId: spot.id,
          url,
          preview,
        });

        const spots = await populateRatingAndImageColumn();

        res.json(spotImage);
      } else {
        const spotImageObj = {
          url,
          preview,
        };

        res.statusCode = 400;
        error.message = "Bad Request";

        for (let key in spotImageObj) {
          if (spotImageObj[key] === undefined || spotImageObj[key] === "") {
            error["errors"][key] = key + " is required";
          }
        }

        return res.json(error);
      }
    }
  } else {
    res.statusCode = 401;
    res.json({ message: "Authentication required" });
  }
});

// GET CURRENT USER SPOTS
router.get("/current", async (req, res) => {
  const { user } = req;

  if (user) {
    const userSpots = await Spot.findAll({
      where: {
        ownerId: user.id,
      },
    });

    const spots = await populateRatingAndImageColumn();
    return res.json({
      Spots: userSpots,
    });
  } else {
    res.statusCode = 401;
    return res.json({ message: "Authentication required" });
  }
});

// GET SPOT DETAILS
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [{ model: SpotImage }, { model: User, as: "Owner" }],
  });

  if (!spot) {
    res.statusCode = 404;
    res.json({ message: "Spot couldn't be found" });
  } else {
    res.json(spot);
  }
});

// UPDATE A SPOT
router.put("/:spotId", async (req, res) => {
  const { user } = req;
  const error = {
    message: {},
    errors: {},
  };

  if (user) {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      res.statusCode = 404;
      res.json({ message: "Spot couldn't be found" });
    } else {
      const userSpot = await Spot.findOne({
        where: {
          id: req.params.spotId,
          ownerId: user.id,
        },
      });

      if (!userSpot) {
        res.statusCode = 403;
        res.json({ message: "Forbidden" });
      } else {
        const {
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price,
        } = req.body;

        if (
          address &&
          city &&
          state &&
          country &&
          lat &&
          lng &&
          name &&
          description &&
          price
        ) {
          spot.address = address;
          spot.city = city;
          spot.state = state;
          spot.country = country;
          spot.lat = lat;
          spot.lng = lng;
          spot.name = name;
          spot.description = description;
          spot.price = price;

          await spot.save();

          res.json(spot);
        } else {
          const spotObj = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
          };

          res.statusCode = 400;
          error.message = "Bad Request";

          for (let key in spotObj) {
            if (spotObj[key] === undefined || spotObj[key] === "") {
              error["errors"][key] = key + " is required";
            }
          }

          return res.json(error);
        }
      }
    }
  } else {
    res.statusCode = 401;
    res.json({ message: "Authentication required" });
  }
});

// DELETE A SPOT
router.delete("/:spotId", async (req, res) => {
  const { user } = req;

  if (user) {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      res.statusCode = 404;
      res.json({ message: "Spot couldn't be found" });
    } else {
      const userSpot = await Spot.findOne({
        where: {
          id: req.params.spotId,
          ownerId: user.id,
        },
      });

      if (!userSpot) {
        res.statusCode = 403;
        res.json({ message: "Forbidden" });
      } else {
        await spot.destroy();
        res.json({ message: "Successfully deleted" });
      }
    }
  } else {
    res.statusCode = 401;
    res.json({ message: "Authentication required" });
  }
});

// POST SPOT REVIEW
router.post("/:spotId/reviews", async (req, res) => {
  const { user } = req;
  const error = {
    message: {},
    errors: {},
  };

  if (user) {
    const { review, stars } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      res.statusCode = 404;
      res.json({ message: "Spot couldn't be found" });
    } else {
      const reviewCheck = await Review.findOne({
        where: {
          spotId: req.params.spotId,
          userId: user.id,
        },
      });

      if (reviewCheck) {
        res.statusCode = 403;
        res.json({ message: "User already has a review for this spot" });
      } else {
        if (review && stars) {
          const newReview = await Review.create({
            spotId: req.params.spotId,
            userId: user.id,
            review,
            stars,
          });

          res.statusCode = 201;
          res.json(newReview);
        } else {
          const reviewObj = {
            review,
            stars,
          };

          res.statusCode = 400;
          error.message = "Bad Request";

          for (let key in reviewObj) {
            if (reviewObj[key] === undefined || reviewObj[key] === "") {
              error["errors"][key] = key + " is required";
            }
          }

          return res.json(error);
        }
      }
    }
  } else {
    res.statusCode = 401;
    res.json({ message: "Authentication required" });
  }
});

module.exports = router;
