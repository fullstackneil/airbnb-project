import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import styles from './Navigation.module.css';

// Served from frontend/public, so reference it by URL rather than importing it.
const logo = '/assets/logo.png';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const [visible, setVisible] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const closeMenu = () => setVisible(false);

  // Close the menu on clicks outside the toggle + dropdown, and on Escape.
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setVisible(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  // Close the menu whenever the route changes (adjusting state during
  // render when a value changes, per the React docs, instead of an effect).
  const [menuPath, setMenuPath] = useState(location.pathname);
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setVisible(false);
  }

  return (
    <nav className={styles.navBar}>
      <NavLink to='/'>
        <img
          src={logo}
          className={styles.logo}
          alt='Galactic Getaways home'
        />
      </NavLink>
      <div className={styles.profileContainer}>
        {sessionUser && <Link className={styles.createSpotLink} to='/spots'>Create a New Spot</Link>}
        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            type='button'
            className={styles.menuToggle}
            onClick={() => setVisible(!visible)}
            aria-label='Open user menu'
            aria-haspopup='true'
            aria-expanded={visible}
            data-modal-return-focus
          >
            <GiHamburgerMenu className={styles.hamburgerIcon} aria-hidden='true'/>
            <CgProfile className={styles.profileIcon} aria-hidden='true'/>
          </button>
          {visible && (
            <div className={styles.dropdownMenu}>
              {sessionUser ? (
                <ProfileButton user={sessionUser} onItemClick={closeMenu} />
              ) : (
                <div className={styles.dropdownLinks}>
                  <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                    onButtonClick={closeMenu}
                    className={styles.dropdownLink}
                  />
                  <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                    onButtonClick={closeMenu}
                    className={styles.dropdownLink}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
