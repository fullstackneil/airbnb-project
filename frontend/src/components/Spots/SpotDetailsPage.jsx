import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllReviewsForSpot } from "../../store/reviewReducer";
import { getSingleSpot } from "../../store/spotReducer";
import "./SpotDetailsPage.css";
import { FaStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import ReviewIndexItem from "../Reviews/ReviewIndexItem";
import OpenModalButton from "../OpenModalButton";
import CreateReview from "../Reviews/CreateReview";

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.currentSpot);
  const allSpots = useSelector((state) => state.spots.allSpots);
  const spotReviews = useSelector((state) => state.reviews.spot);
  const userSession = useSelector((state) => state.session.user);

  let countReviews = 0;
  let isReviewPresent = false;
  let ownerId;
  const findSpot = Object.values(allSpots).find((spot) => {
    return +spotId === +spot.id;
  });

  if (findSpot) {
    ownerId = findSpot.ownerId;
  } else {
    ownerId = null;
  }
  const reviewsArray = Object.values(spotReviews);
  reviewsArray.forEach((review) => {
    if (review.spotId === spot.id) {
      countReviews++;
    }
  });
  let reviewCount = countReviews;
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleSpot(spotId))
      .then(() => dispatch(getAllReviewsForSpot(spotId)))
      .then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  return (
    <div className="details-page-container">
      {isLoaded ? (
        <>
          <div className="spot-name-location">
            <h2 className="spot-name-location" id='spot-header'>{spot.name}</h2>
            <p className="spot-name-location" id='spot-city-state-country'>
              {spot.city}, {spot.state}, {spot.country}
            </p>
          </div>
          <div className="details-page-image-container">
            <div className="spot-images-container">
            {spot.SpotImages &&
            <img className="big-image" src={spot.SpotImages[0].url} alt="big-spot-image" />
          }
          {spot.SpotImages && spot.SpotImages.slice(1, 5).map((image, index) => (
            <img
              key={image.id}
              className={`small-image small-image-${index + 1}`}
              src={image.url}
              alt={`small-spot-image}`}
            />
          ))}
            </div>
          </div>

          <div className="spot-info-container">
            <div className="owner-description-container">
              <h2>
                Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
              </h2>
              <p>{spot.description}</p>
            </div>

            <div className="info-box-container">
              <div className="stay-info-container">
                <h2 id='spot-price'>${spot.price}</h2>
                <h3 id='night-text'> /night</h3>
                <p id='star-rating-container'>
                  <FaStar />
                  {reviewCount === 0
                    ? "New"
                    : spot.avgRating
                    ? Number(spot.avgRating).toFixed(2)
                    : "New"}
                </p>

                {reviewCount === 0 ? (
                  <></>
                ) : reviewCount === 1 ? (
                  <p className="center-dot">
                    <GoDotFill />
                    {reviewCount} Review
                  </p>
                ) : reviewsArray.length > 1 ? (
                  <p className="center-dot">
                    <GoDotFill />
                    {reviewCount} Reviews
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div className="btn-container">
                <button onClick={() => alert("Feature comming soon")}>
                  Reserve
                </button>
              </div>
            </div>
          </div>
          <div className="line-break"></div>
          <div className="summary-review-container">
            <div className="review-summary-container">
              <div className="star-rating-review-summary">
                <FaStar />{" "}
                {reviewCount === 0
                  ? "New"
                  : spot.avgRating
                  ? Number(spot.avgRating).toFixed(2)
                  : "New"}
              </div>{" "}
              {reviewCount === 0 ? (
                <></>
              ) : reviewCount === 1 ? (
                <p className="center-dot">
                  <GoDotFill />
                  {reviewCount} Review
                </p>
              ) : reviewsArray.length > 1 ? (
                <p className="center-dot">
                  <GoDotFill />
                  {reviewCount} Reviews
                </p>
              ) : (
                <></>
              )}
            </div>
            <div className="reviews-container">
              {reviewCount === 0 && ownerId !== userSession.id ? (
                <p>Be the first to post a review!</p>
              ) : (
                <></>
              )}

              {userSession === null ? (
                <>{(isReviewPresent = true)}</>
              ) : spot.ownerId === userSession.id ? (
                <>{(isReviewPresent = true)}</>
              ) : (
                reviewsArray.map((review) => {
                  if (review.spotId == spot.id) {
                    if (
                      review.User.id === userSession.id ||
                      userSession.id === spot.ownerId
                    ) {
                      isReviewPresent = true;
                    }
                  } else if (userSession.id === spot.ownerId) {
                    isReviewPresent = true;
                  }
                })
              )}

              {isReviewPresent === true ? (
                <></>
              ) : (
                <OpenModalButton
                  buttonText="Post Your Review"
                  modalComponent={
                    <CreateReview spot={spot} user={userSession} />
                  }
                  id="review-button"
                />
              )}
              {reviewsArray
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((review) => {
                  return (
                    <ReviewIndexItem
                      review={review}
                      spot={spot}
                      user={userSession}
                      key={review.id}
                    />
                  );
                })}
            </div>
          </div>
        </>
      ) : (
        <>Loading</>
      )}
    </div>
  );
};

export default SpotDetailsPage;
