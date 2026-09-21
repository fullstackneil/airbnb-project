import { Link, useNavigate } from "react-router-dom";
import card from "./SpotCard.module.css";
import styles from "./ManageSpots.module.css";
import { FaStar } from "react-icons/fa";
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "./DeleteSpot";
import { sizedImage, fallbackToOriginal } from "../../utils/images";


const ManageSpotsIndexItem = ({ spot }) => {
  const navigate = useNavigate();

  return (
    <div className={card.card}>
        <Link to={`/spots/${spot.id}`}>
            <div className={card.imageFrame}>
            <img
              src={sizedImage(spot.previewImage, 800)}
              onError={fallbackToOriginal(spot.previewImage)}
              alt={spot.name}
              loading="lazy"
            />
            </div>
            <div className={card.tooltip}>
            <span className={card.tooltipText}>{spot.name}</span>
            </div>
            <div className={card.details}>
            <h2>{spot.name}</h2>
            <div className={card.locationRating}>
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
        <div className={styles.cardActions}>
            <button className={styles.actionButton} onClick={() => navigate(`spots/${spot.id}/edit`)}>Update</button>
            <OpenModalButton className={styles.actionButton}
            buttonText="Delete"
            modalComponent={<DeleteSpot spot={spot} />}
            />
        </div>
    </div>
  );
};

export default ManageSpotsIndexItem;
