import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviewReducer";
import { getSingleSpot } from "../../store/spotReducer";
import { getAllReviewsForSpot } from "../../store/reviewReducer";
import { useModal } from "../../context/Modal";
import "./CreateReview.css";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

function CreateReview({ spot }) {
  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  useEffect(() => {
    let errors = {};
    if (stars < 1) errors.stars = "Stars can't be empty";
    if (review.length < 10)
      errors.review = "Review must be at least 10 characters long";

    setErrors(errors);
  }, [review.length, stars]);

  const handleMouseEnter = (rating) => {
    setHoveredStars(rating);
  };

  const handleMouseLeave = () => {
    setHoveredStars(0);
  };

  const handleClick = (rating) => {
    setStars(rating);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((rating) => (
      <button
        type="button"
        role="radio"
        aria-checked={stars === rating}
        aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
        key={rating}
        onMouseEnter={() => handleMouseEnter(rating)}
        onMouseLeave={handleMouseLeave}
        onFocus={() => handleMouseEnter(rating)}
        onBlur={handleMouseLeave}
        onClick={() => handleClick(rating)}
        className="star"
      >
        {rating <= (hoveredStars || stars) ? <FaStar aria-hidden="true" /> : <FaRegStar aria-hidden="true" />}
      </button>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).length > 0) {
      alert("Please fix the errors you have");
    } else {
      let spotId = parseInt(spot.id);
      let newReview = {
        stars,
        review,
      };

      dispatch(createReview(newReview, spotId))
        .then(closeModal)
        .then(() => dispatch(getAllReviewsForSpot(spotId)))
        .then(() => dispatch(getSingleSpot(spotId)));

      setStars(0);
      setReview("");
      setErrors({});
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2 className="review-title">How was your stay?</h2>
      <label className="review-label">
        Review:
        <textarea
          placeholder="Leave your review here..."
          className="review-input long-text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </label>
      <div className="review-label">
        <span id="review-stars-label">Stars:</span>
        <div className="rating-input">
          <div
            className="star-ratings-container"
            role="radiogroup"
            aria-labelledby="review-stars-label"
          >
            {renderStars()}
          </div>
        </div>
      </div>
      <button id='submit-button' disabled={Object.values(errors).length > 0} type="submit">
        Submit Your Review
      </button>
    </form>
  );
}

export default CreateReview;
