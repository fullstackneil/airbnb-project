import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllReviewsForSpot } from "../../store/reviewReducer";
import { getSingleSpot } from "../../store/spotReducer";
import styles from "./SpotDetailsPage.module.css";
import { FaStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import ReviewIndexItem from "../Reviews/ReviewIndexItem";
import OpenModalButton from "../OpenModalButton";
import CreateReview from "../Reviews/CreateReview";
import { sizedImage, fallbackToOriginal } from "../../utils/images";

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const spot = useSelector((state) => state.spots.currentSpot);
  const spotReviews = useSelector((state) => state.reviews.spot);
  const userSession = useSelector((state) => state.session.user);

  const [isLoaded, setIsLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setNotFound(false);
    dispatch(getSingleSpot(spotId))
      .then(() => dispatch(getAllReviewsForSpot(spotId)))
      .then(() => setIsLoaded(true))
      .catch(() => setNotFound(true));
  }, [dispatch, spotId]);

  const reviewsArray = Object.values(spotReviews).filter(
    (review) => review.spotId === +spotId
  );

  const reviewCount = reviewsArray.length;

  // The gallery has a layout for 1-4 photos; 5 or more use the default.
  const photoCount = Math.min(Math.max(spot.SpotImages?.length || 1, 1), 5);

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

  if (notFound) {
    return (
      <div className={styles.page}>
        <p className="status-message">
          We couldn&apos;t find that spot. It may have been removed.{" "}
          <Link to="/">Browse all spots</Link>
        </p>
      </div>
    );
  }

  const renderStarRating = () => (
    <div className={styles.ratingSummary}>
      <FaStar /> {avgRating}
    </div>
  );

  const renderReviewCount = () => {
    if (reviewCount === 0) return null;
    return (
      <p className={styles.centerDot}>
        <GoDotFill />
        {reviewCount} Review{reviewCount > 1 ? "s" : ""}
      </p>
    );
  };

  return (
    <div className={styles.page}>
      {isLoaded ? (
        <>
          <div className={styles.nameLocation}>
            <h2 className={styles.spotName}>{spot.name}</h2>
            <p id="spot-city-state-country">
              {spot.city}, {spot.state}, {spot.country}
            </p>
          </div>
          <div className={styles.imageSection}>
            <div
              className={`${styles.gallery} ${styles[`photos${photoCount}`] ?? ""}`}
              data-photo-count={photoCount}
            >
              {spot.SpotImages && (
                <>
                  <img
                    className={styles.bigImage}
                    src={sizedImage(spot.SpotImages[0]?.url, 1600)}
                    onError={fallbackToOriginal(spot.SpotImages[0]?.url)}
                    alt={`${spot.name} main photo`}
                  />
                  {spot.SpotImages.slice(1, 5).map((image, index) => (
                    <img
                      key={image.id}
                      className={`${styles.smallImage} ${styles[`small${index + 1}`]}`}
                      src={sizedImage(image.url, 800)}
                      onError={fallbackToOriginal(image.url)}
                      alt={`${spot.name} photo ${index + 2}`}
                      loading="lazy"
                    />
                  ))}
                </>
              )}
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.ownerDescription}>
              <h2>
                Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
              </h2>
              <p>{spot.description}</p>
            </div>
            <div className={styles.infoBox}>
            <div className={styles.stayInfo}>
                <h2 className={styles.price}>${spot.price}</h2>
                <h3 className={styles.perNight}> /night</h3>
                <p className={styles.rating}>
                  <FaStar />
                  {reviewCount === 0 ? "New" : avgRating}
                </p>
                {renderReviewCount()}
              </div>
              <div className={styles.reserve}>
                <button onClick={handleReserveClick}>Reserve</button>
              </div>
            </div>
          </div>
          <div className={styles.lineBreak}></div>
          <div className={styles.reviewsSection}>
            <div className={styles.reviewSummary}>
              {renderStarRating()}
              {renderReviewCount()}
            </div>
            <div className={styles.reviews}>
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
                  className={styles.reviewButton}
                />
              )}
              {reviewCount === 0 && !userSession && <p>Be the first to post a review!</p>}
            </div>
          </div>
        </>
      ) : (
        <p className="status-message" role="status">Loading spot…</p>
      )}
    </div>
  );
};

export default SpotDetailsPage;
