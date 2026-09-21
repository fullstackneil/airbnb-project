import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spotReducer";
import { useState } from "react";
import SpotIndexItem from "./SpotIndexItem";
import "./SpotsIndex.css";

const SpotsIndex = () => {
  const spotsObj = useSelector((state) => state.spots.allSpots);
  const [isLoaded, setIsLoaded] = useState(false);
  const spots = spotsObj ? Object.values(spotsObj) : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSpots()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div>
      {!isLoaded ? (
        <p className="status-message" role="status">Loading spots…</p>
      ) : spots.length === 0 ? (
        <p className="status-message">No spots have been listed yet.</p>
      ) : (
        <div className="spots-container">
          {spots.map((spot) => {
            return <SpotIndexItem spot={spot} key={spot.id} />;
          })}
        </div>
      )}
    </div>
  );
};

export default SpotsIndex;
