const express = require('express');

const { User, Spot, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

// GET ALL SPOTS

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
  
  router.get("/current", async (req, res) => {
    const spots = await populateRatingAndImageColumn();
    const { user } = req;
  
    if (user) {
      const userSpots = await Spot.findAll({
        where: {
          ownerId: user.id,
        },
      });
  
      return res.json({
        Spots: userSpots,
      });
    } else {
      res.statusCode = 401;
      return res.json({ message: "Authentication required" });
    }
  });
  
  router.get("/:spotId", async (req, res) => {
    const spots = await populateRatingAndImageColumn();
    const spot = await Spot.findByPk(req.params.spotId, {
      include: [{ model: SpotImage }, { model: User, as: "Owner" }],
    });
  
    if (!spot) {
      res.statusCode = 404;
      res.json({ message: "Spot couldn't be found" });
    }
  
    res.json(spot);
  });
  
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
  
  router.post("/:spotId/reviews", async (req, res) => {
    const { user } = req;
    const reviewsSet = new Set();
    const error = {
      message: {},
      errors: {},
    };
  
    if (user) {
      const { review, stars } = req.body;
  
      const spot = await Spot.findByPk(req.params.spotId);
      const reviews = await Review.findAll();
  
      if (!spot) {
        res.statusCode = 404;
        res.json({ message: "Spot couldn't be found" });
      } else {
        for (let i = 0; i < reviews.length; i++) {
          reviewsSet.add(`${reviews[i].userId}, ${reviews[i].spotId}`);
        }
  
        if (review && stars > 0 && stars < 6) {
          if (reviewsSet.has(`${user.id}, ${req.params.spotId}`)) {
            res.statusCode = 500;
            res.json({ message: "User already has a review for this spot" });
          } else {
            const newReview = await Review.create({
              userId: user.id,
              spotId: req.params.spotId,
              review,
              stars,
            });
  
            res.statusCode = 201;
            res.json(newReview);
          }
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
  
            if (stars < 1 || stars > 5) {
              error["errors"]["stars"] = "Stars must be an integer from 1 to 5";
            }
          }
  
          res.json(error);
        }
      }
    } else {
      res.statusCode = 401;
      res.json({ message: "Authentication required" });
    }
  });
  
  router.get("/:spotId/reviews", async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
  
    if (!spot) {
      res.statusCode = 404;
      res.json({ message: "Spot couldn't be found" });
    }
  
    const reviews = await Review.findAll({
      where: {
        spotId: req.params.spotId,
      },
      include: [{ model: User }, { model: ReviewImage }],
    });
  
    res.json({ Reviews: reviews });
  });
  
  router.post("/:spotId/bookings", async (req, res) => {
    const { user } = req;
    const bookingSet = new Set();
    let isValidStartDate = null;
    let isValidEndDate = null;
    let isConflictingBooking = null;
    const error = {
      message: {},
      errors: {},
    };
  
    if (user) {
      let { startDate, endDate } = req.body;
  
      const bookings = await Booking.findAll({
        where: {
          spotId: req.params.spotId,
        },
      });
  
      const spot = await Spot.findByPk(req.params.spotId);
  
      startDate = new Date(startDate);
      endDate = new Date(endDate);
  
      if (startDate && endDate) {
        if (!spot) {
          res.statusCode = 404;
          res.json({ message: "Spot couldn't be found" });
        } else {
          const ownerSpot = await Spot.findOne({
            where: {
              id: req.params.spotId,
              ownerId: user.id,
            },
          });
  
          if (ownerSpot) {
            res.statusCode = 403;
            res.json({ message: "Forbidden" });
          } else {
            for (let i = 0; i < bookings.length; i++) {
              bookingSet.add(`startDate: ${bookings[i].startDate}`);
              bookingSet.add(`endDate: ${bookings[i].endDate}`);
  
              if (
                startDate.getTime() ===
                  new Date(bookings[i].startDate).getTime() &&
                endDate.getTime() === new Date(bookings[i].endDate).getTime()
              ) {
                isConflictingBooking = true;
              }
  
              if (
                startDate > bookings[i].startDate &&
                startDate < bookings[i].endDate
              ) {
                isValidStartDate = false;
              }
  
              if (
                endDate > bookings[i].startDate &&
                endDate < bookings[i].endDate
              ) {
                isValidEndDate = false;
              }
  
              if (
                startDate > bookings[i].startDate &&
                startDate < bookings[i].endDate &&
                endDate > bookings[i].startDate &&
                endDate < bookings[i].endDate
              ) {
                isValidStartDate = "dates within";
                isValidEndDate = "dates within";
              }
  
              if (
                startDate < bookings[i].startDate &&
                endDate > bookings[i].endDate
              ) {
                isValidStartDate = "dates surround";
                isValidEndDate = "dates surround";
              }
            }
  
            if (new Date(startDate) < Date.now()) {
              res.statusCode = 403;
              error.message = "Dates cannot be in the past";
              error["errors"].startDate = "The start date cannot be in the past";
              res.json(error);
            } else if (isConflictingBooking) {
              res.statusCode = 403;
              error.message =
                "Sorry, this spot is already booked for the specified dates";
              error["errors"].startDate =
                "Start date conflicts with an existing booking";
              error["errors"].endDate =
                "End date conflicts with an existing booking";
              res.json(error);
            } else if (startDate.toString() === endDate.toString()) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "Canot book a spot with the same start and end date";
              error["errors"].endDate =
                "Canot book a spot with the same start and end date";
              res.json(error);
            } else if (startDate > endDate) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate = "Start date must be before end date";
              error["errors"].endDate = "End date must be after start date";
              res.json(error);
            } else if (bookingSet.has(`startDate: ${startDate}`)) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "A booking with this start date already exists";
              error["errors"].endDate =
                "A booking with this start date already exists";
              res.json(error);
            } else if (bookingSet.has(`endDate: ${startDate}`)) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "You cannot make a booking, as the start date is the same as an already existsing end date i.e. the date that someone is leaving";
              error["errors"].endDate =
                "You cannot make a booking, as the start date is the same as an already existsing end date i.e. the date that someone is leaving";
              res.json(error);
            } else if (bookingSet.has(`startDate: ${endDate}`)) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "Cannot make a booking. The end date is the same as an already existsing start date";
              error["errors"].endDate =
                "Cannot make a booking. The end date is the same as an already existsing start date";
              res.json(error);
            } else if (bookingSet.has(`endDate: ${endDate}`)) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "A booking with this end date already exists";
              error["errors"].endDate =
                "A booking with this end date already exists";
              res.json(error);
            } else if (isValidStartDate === false) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "Start date cannot be during an existing booking";
              error["errors"].endDate =
                "Start date cannot be during an existing booking";
              res.json(error);
            } else if (isValidEndDate === false) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "End date cannot be during an existing booking";
              error["errors"].endDate =
                "End date cannot be during an existing booking";
              res.json(error);
            } else if (
              isValidStartDate === "dates within" &&
              isValidEndDate === "dates within"
            ) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "Dates cannot be within an existing booking";
              error["errors"].endDate =
                "Dates cannot be within an existing booking";
              res.json(error);
            } else if (
              isValidStartDate === "dates surround" &&
              isValidEndDate === "dates surround"
            ) {
              res.statusCode = 403;
              error.message = "Bad Request";
              error["errors"].startDate =
                "Dates cannot surround an existing booking";
              error["errors"].endDate =
                "Dates cannot surround an existing booking";
              res.json(error);
            } else {
              const booking = await Booking.create({
                userId: user.id,
                spotId: req.params.spotId,
                startDate,
                endDate,
              });
              res.json(booking);
            }
          }
        }
      } else {
        const bookingObj = {
          startDate,
          endDate,
        };
  
        res.statusCode = 400;
        error.message = "Bad Request";
  
        for (let key in bookingObj) {
          if (bookingObj[key] === undefined || bookingObj[key] === "") {
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
  
  router.get("/:spotId/bookings", async (req, res) => {
    const { user } = req;
  
    if (user) {
      const spot = await Spot.findByPk(req.params.spotId);
  
      if (!spot) {
        res.statusCode = 404;
        res.json({ message: "Spot couldn't be found" });
      }
  
      if (user.id === spot.ownerId) {
        const bookings = await Booking.unscoped().findAll({
          where: {
            spotId: spot.id,
          },
          include: [{ model: User }],
        });
  
        res.json({ Bookings: bookings });
      } else {
        const bookings = await Booking.findAll({
          where: {
            spotId: spot.id,
          },
        });
  
        res.json({ Bookings: bookings });
      }
    } else {
      res.statusCode = 401;
      res.json({ message: "Authentication required" });
    }
  });


module.exports = router;
