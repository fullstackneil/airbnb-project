import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeSpot } from "../../store/spotReducer";
import { getCurrentUserSpots } from "../../store/spotReducer";
import { useModal } from "../../context/Modal";
import buttons from '../../styles/buttons.module.css';
import dialog from '../../styles/confirmDialog.module.css';

function DeleteSpot({ spot }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);
    try {
      await dispatch(removeSpot(spot.id));
    } catch {
      // Keep the dialog open and explain, rather than failing silently.
      setError("Couldn't delete this spot. Please try again.");
      setIsDeleting(false);
      return;
    }
    closeModal();
    dispatch(getCurrentUserSpots());
  };

  return (
    <div className={dialog.dialog}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot from the listings?</p>
      {error && <p className={dialog.error} role="alert">{error}</p>}

      <div className={dialog.actions}>
        <button className={`${buttons.actionButton} ${dialog.choice} ${dialog.confirm}`} onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Yes (Delete Spot)"}
        </button>
        <button className={`${buttons.actionButton} ${dialog.choice} ${dialog.cancel}`} onClick={closeModal} disabled={isDeleting}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}
export default DeleteSpot;
