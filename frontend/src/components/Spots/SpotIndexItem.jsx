import { Link } from "react-router-dom";
import "./SpotsIndex.css";
import { FaStar } from "react-icons/fa";

const arr = [];
const SpotIndexItem = ({ spot }) => {
  arr.push(spot);
  return (
    <div className="spot-container">
      <Link to={`/spots/${spot.id}`}>
        <div className="spot-image-container">
          <img src={spot.previewImage} />
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
    </div>
  );
};

export default SpotIndexItem;
