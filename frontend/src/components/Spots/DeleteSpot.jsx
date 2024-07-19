import { useDispatch } from "react-redux";
import { removeSpot } from "../../store/spotReducer";
import { getCurrentUserSpots } from "../../store/spotReducer";
import { useModal } from "../../context/Modal";
import './DeleteSpot.css';

function DeleteSpot({ spot }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    dispatch(removeSpot(spot.id))
      .then(closeModal)
      .then(() => dispatch(getCurrentUserSpots()));
  };

  return (
    <div className='delete-spot-container'>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot from the listings?</p>

      <div>
        <button className='button' id='delete-spot' onClick={handleDelete}>Yes (Delete Spot)</button>
        <button className='button' id='keep-spot' onClick={closeModal}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}
export default DeleteSpot;
