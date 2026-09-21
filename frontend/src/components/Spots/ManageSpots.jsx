import { useEffect, useState } from "react";
import { getCurrentUserSpots } from "../../store/spotReducer";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ManageSpotsIndexItem from "./ManageSpotsIndexItem";
import card from './SpotCard.module.css';
import styles from './ManageSpots.module.css';
import buttons from '../../styles/buttons.module.css';

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
        <div>
          {isLoaded ? (
            <>
              <div className={styles.header}>
                <h2 className={styles.title}>Manage Spots</h2>
                {spotsArr.length === 0 && (
                  <>
                    <p className={styles.empty}>You haven&apos;t listed any spots yet.</p>
                    <button className={buttons.actionButton} onClick={createSpot}>Create a New Spot</button>
                  </>
                )}
              </div>
              <div className={card.grid}>
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
