import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeReview } from "../../store/reviewReducer";
import { getAllReviewsForSpot } from "../../store/reviewReducer";
import { useModal } from "../../context/Modal";
import { getSingleSpot } from "../../store/spotReducer";
import buttons from '../../styles/buttons.module.css';
import dialog from '../../styles/confirmDialog.module.css';

function DeleteReview({ review }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);
    try {
      await dispatch(removeReview(review.id));
    } catch {
      // Keep the dialog open and explain, rather than failing silently.
      setError("Couldn't delete this review. Please try again.");
      setIsDeleting(false);
      return;
    }
    closeModal();
    await dispatch(getAllReviewsForSpot(review.spotId));
    dispatch(getSingleSpot(review.spotId));
  };

  return (
    <div className={dialog.dialog}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      {error && <p className={dialog.error} role="alert">{error}</p>}
      <div className={dialog.actions}>
        <button className={`${buttons.actionButton} ${dialog.choice} ${dialog.confirm}`} onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Yes (Delete Review)"}
        </button>
        <button className={`${buttons.actionButton} ${dialog.choice} ${dialog.cancel}`} onClick={closeModal} disabled={isDeleting}>No (Keep Review)</button>
      </div>
    </div>
  );
}
export default DeleteReview;
