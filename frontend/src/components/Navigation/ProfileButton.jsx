import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import styles from './Navigation.module.css';

function ProfileButton({ user, onItemClick }) {
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    if (onItemClick) onItemClick();
  };

  return (
    <>
      <ul className={styles.profileDropdown}>
        <li className={styles.profileName}>Hello, {user.firstName}</li>
        <li className={styles.profileEmail}>{user.email}</li>
        <li>
          <Link to='/spots/myspots' onClick={onItemClick}>Manage Spots</Link>
        </li>
        <li>
          <button className={styles.logoutButton} onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
