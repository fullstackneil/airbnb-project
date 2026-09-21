import { useEffect, useState } from "react";
import { getCurrentUserSpots } from "../../store/spotReducer";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ManageSpotsIndexItem from "./ManageSpotsIndexItem";
import './ManageSpots.css'

const ManageSpots = () => {
    const userSpots = useSelector((state) => state.spots.currentUserSpots.Spots)
    const sessionUser = useSelector((state) => state.session.user);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionUser) return;
        dispatch(getCurrentUserSpots())
          .catch(() => {})
          .finally(() => setIsLoaded(true));
        }, [dispatch, sessionUser]);

    const spotsArr = userSpots ? Object.values(userSpots) : [];

    const createSpot = (e) => {
        e.preventDefault();
        navigate('/spots');
    };

    if (!sessionUser) return <Navigate to="/" replace />;

    return (
        <div className="manage-spots-container">
          {isLoaded ? (
            <>
              <div className="manage-text-btn">
                <h2 className='manage-spots-text'>Manage Spots</h2>
                {spotsArr.length === 0 && (
                  <>
                    <p className="manage-spots-empty">You haven&apos;t listed any spots yet.</p>
                    <button className='button' onClick={createSpot}>Create a New Spot</button>
                  </>
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
            <p className="status-message" role="status">Loading your spots…</p>
          )}
        </div>
      );
    };

export default ManageSpots;
