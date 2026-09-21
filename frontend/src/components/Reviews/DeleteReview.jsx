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

  const handleDelete = async () => {
    dispatch(removeReview(review.id))
      .then(closeModal)
      .then(() => dispatch(getAllReviewsForSpot(review.spotId)))
      .then(() => dispatch(getSingleSpot(review.spotId)));

    // dispatch(getAllReviewsForSpot(review.spotId));
  };

  return (
    <div className={dialog.dialog}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className={dialog.actions}>
        <button className={`${buttons.actionButton} ${dialog.choice} ${dialog.confirm}`} onClick={handleDelete}>Yes (Delete Review)</button>
        <button className={`${buttons.actionButton} ${dialog.choice} ${dialog.cancel}`} onClick={closeModal}>No (Keep Review)</button>
      </div>
    </div>
  );
}
export default DeleteReview;
