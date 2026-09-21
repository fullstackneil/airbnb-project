import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user, onItemClick }) {
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    if (onItemClick) onItemClick();
  };

  return (
    <>
      <ul className="profile-dropdown">
        <li id='profile-first-name'>Hello, {user.firstName}</li>
        <li id='profile-email'>{user.email}</li>
        <li>
          <Link id='manage-spots' to='/spots/myspots' onClick={onItemClick}>Manage Spots</Link>
        </li>
        <li>
          <button id='profile-log-out' onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
