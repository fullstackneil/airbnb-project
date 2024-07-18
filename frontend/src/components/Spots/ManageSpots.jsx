import { useEffect, useState } from "react";
import { getCurrentUserSpots } from "../../store/spotReducer";
import { useNavigate } from "react-router-dom";
import { addSpot } from "../../store/spotReducer";
import { useSelector, useDispatch } from "react-redux";
import ManageSpotsIndexItem from "./ManageSpotsIndexItem";

const ManageSpots = () => {
    const userSpots = useSelector((state) => state.spots.currentUserSpots.Spots)
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getCurrentUserSpots()).then(() => setIsLoaded(true));
        }, [dispatch]);

    const spotsArr = userSpots ? Object.values(userSpots) : [];

    const createSpot = (e) => {
        e.preventDefault();
        navigate('/spots');
    };

    return (
        <div className="manage-spots-container">
          {isLoaded ? (
            <>
              <div className="manage-text-btn">
                <h2>Manage Spots</h2>
                <button onClick={createSpot}>Create a New Spot</button>
              </div>
              <div className="spots-container">
                {spotsArr === undefined ? (
                  <></>
                ) : (
                  spotsArr.map((spot) => {
                    return <ManageSpotsIndexItem spot={spot} key={spot.id} />;
                  })
                )}
              </div>
            </>
          ) : (
            <>Loading</>
          )}
        </div>
      );
    };

export default ManageSpots;
