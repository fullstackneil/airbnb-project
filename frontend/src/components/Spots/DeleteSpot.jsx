import { useDispatch } from "react-redux";
import { removeSpot } from "../../store/spotReducer";
import { getCurrentUserSpots } from "../../store/spotReducer";
import { useModal } from "../../context/Modal";
import buttons from '../../styles/buttons.module.css';
import dialog from '../../styles/confirmDialog.module.css';

function DeleteSpot({ spot }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    dispatch(removeSpot(spot.id))
      .then(closeModal)
      .then(() => dispatch(getCurrentUserSpots()));
  };

  return (
    <div className={dialog.dialog}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot from the listings?</p>

      <div className={dialog.actions}>
        <button className={`${buttons.actionButton} ${dialog.choice} ${dialog.confirm}`} onClick={handleDelete}>Yes (Delete Spot)</button>
        <button className={`${buttons.actionButton} ${dialog.choice} ${dialog.cancel}`} onClick={closeModal}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}
export default DeleteSpot;
