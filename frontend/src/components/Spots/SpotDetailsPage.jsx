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
  const dispatch = useDispatch();

  const spot = useSelector((state) => state.spots.currentSpot);
  const spotReviews = useSelector((state) => state.reviews.spot);
  const userSession = useSelector((state) => state.session.user);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getSingleSpot(spotId))
      .then(() => dispatch(getAllReviewsForSpot(spotId)))
      .then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  const reviewsArray = Object.values(spotReviews).filter(
    (review) => review.spotId === +spotId
  );

  const reviewCount = reviewsArray.length;

  // Calculate the average rating based on reviewsArray
  const calculateAvgRating = (reviews) => {
    if (reviews.length === 0) return "New";

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    return (totalStars / reviews.length).toFixed(2);
  };

  const avgRating = calculateAvgRating(reviewsArray);

  const isReviewPresent = reviewsArray.some(
    (review) => review.User.id === userSession?.id
  );

  const handleReserveClick = () => alert("Feature coming soon");

  const renderStarRating = () => (
    <div className="star-rating-review-summary">
      <FaStar /> {avgRating}
    </div>
  );

  const renderReviewCount = () => {
    if (reviewCount === 0) return null;
    return (
      <p className="center-dot">
        <GoDotFill />
        {reviewCount} Review{reviewCount > 1 ? "s" : ""}
      </p>
    );
  };

  return (
    <div className="details-page-container">
      {isLoaded ? (
        <>
          <div className="spot-name-location">
            <h2 id="spot-header">{spot.name}</h2>
            <p id="spot-city-state-country">
              {spot.city}, {spot.state}, {spot.country}
            </p>
          </div>
          <div className="details-page-image-container">
            <div className="spot-images-container">
              {spot.SpotImages && (
                <>
                  <img
                    className="big-image"
                    src={spot.SpotImages[0]?.url}
                    alt="Main spot"
                  />
                  {spot.SpotImages.slice(1, 5).map((image, index) => (
                    <img
                      key={image.id}
                      className={`small-image small-image-${index + 1}`}
                      src={image.url}
                      alt={`Spot image ${index + 2}`}
                    />
                  ))}
                </>
              )}
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
            <div className={`stay-info-container ${reviewCount === 0 ? 'new-review' : 'has-reviews'}`}>
                <h2 id="spot-price">${spot.price}</h2>
                <h3 id="night-text"> /night</h3>
                <p id="star-rating-container">
                  <FaStar />
                  {reviewCount === 0 ? "New" : avgRating}
                </p>
                {renderReviewCount()}
              </div>
              <div className="btn-container">
                <button onClick={handleReserveClick}>Reserve</button>
              </div>
            </div>
          </div>
          <div className="line-break"></div>
          <div className="summary-review-container">
            <div className="review-summary-container">
              {renderStarRating()}
              {renderReviewCount()}
            </div>
            <div className="reviews-container">
              {reviewsArray
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((review) => (
                  <ReviewIndexItem
                    review={review}
                    spot={spot}
                    user={userSession}
                    key={review.id}
                  />
                ))}
              {!isReviewPresent && userSession && spot.ownerId !== userSession.id && (
                <OpenModalButton
                  buttonText="Post Your Review"
                  modalComponent={<CreateReview spot={spot} user={userSession} />}
                  id="review-button"
                />
              )}
              {reviewCount === 0 && !userSession && <p>Be the first to post a review!</p>}
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
