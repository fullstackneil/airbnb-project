import { Link, useNavigate } from "react-router-dom";
import "./ManageSpotsIndexItem.css";
import { FaStar } from "react-icons/fa";
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "./DeleteSpot";
import { sizedImage, fallbackToOriginal } from "../../utils/images";


const ManageSpotsIndexItem = ({ spot }) => {
  const navigate = useNavigate();

  return (
    <div className="spot-container">
        <Link to={`/spots/${spot.id}`}>
            <div className="spot-image-container">
            <img
              src={sizedImage(spot.previewImage, 800)}
              onError={fallbackToOriginal(spot.previewImage)}
              alt={spot.name}
              loading="lazy"
            />
            </div>
            <div className="tooltip">
            <span className="tooltiptext">{spot.name}</span>
            </div>
            <div className="spot-text-container">
            <h2>{spot.name}</h2>
            <div className="spot-location-rating-container">
                <p>
                {spot.city}, {spot.state}
                </p>
                <p>
                <FaStar />{" "}
                {spot.avgRating ? Number(spot.avgRating).toFixed(2) : "New"}
                </p>
            </div>
            <p>${spot.price} night</p>
            </div>
        </Link>
        <div className='manage-button-container'>
            <button className='manage-update-button' onClick={() => navigate(`spots/${spot.id}/edit`)}>Update</button>
            <OpenModalButton className='manage-delete-button'
            buttonText="Delete"
            modalComponent={<DeleteSpot spot={spot} />}
            />
        </div>
    </div>
  );
};

export default ManageSpotsIndexItem;
