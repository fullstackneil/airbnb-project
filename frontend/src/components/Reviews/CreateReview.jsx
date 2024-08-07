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
      <div
        key={rating}
        onMouseEnter={() => handleMouseEnter(rating)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(rating)}
        className="star"
      >
        {rating <= (hoveredStars || stars) ? <FaStar /> : <FaRegStar />}
      </div>
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
      <label className="review-label">
        Stars:
        <div className="rating-input">
          <div className="star-ratings-container">{renderStars()}</div>
        </div>
      </label>
      <button id='submit-button' disabled={Object.values(errors).length > 0} type="submit">
        Submit Your Review
      </button>
    </form>
  );
}

export default CreateReview;
