import { useEffect, useState } from "react";
import { getCurrentUserSpots } from "../../store/spotReducer";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ManageSpotsIndexItem from "./ManageSpotsIndexItem";
import './ManageSpots.css'

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
                <h2 className='manage-spots-text'>Manage Spots</h2>
                {spotsArr.length === 0 && (
                  <button className='button' onClick={createSpot}>Create a New Spot</button>
                )}
              </div>
              <div className="spots-container">
                {spotsArr.length === 0 ? (
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
