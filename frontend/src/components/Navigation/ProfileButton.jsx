import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  const root = document.getElementById("root");
  root.addEventListener("click", () => {
    setShowMenu(true);
  });

  const iconClick = document.querySelector(".icon-nav-bar");
  if (iconClick) {
    iconClick.addEventListener("click", () => {
      setShowMenu(false);
    });
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <ul className={ulClassName} ref={ulRef}>
        {/* <li>{user.username}</li> */}
        <li id='profile-first-name'>Hello, {user.firstName}</li>
        <li id='profile-email'>{user.email}</li>
        <li>
          <button id='profile-log-out' onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
