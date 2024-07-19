import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import logo from '../../../public/assets/logo.png';
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleIconClick = () => {
    setVisible(!visible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  const handleInternalClick = (event) => {
    event.stopPropagation();
  };


  return (
    <nav className='nav-bar'>
      <NavLink to='/'>
        <img
          src={logo}
          style={{ width: '150px', height: 'auto' }}
          className='logo'
        />
      </NavLink>
      <div className='profile-container'>
        {sessionUser && <Link className='create-new-spot-button' to='/spots'>Create a New Spot</Link>}
        <GiHamburgerMenu className="hamburger-menu"/>
        <CgProfile
          className='profile-icon'
          onClick={handleIconClick}
        />
        {visible && (
          <div className="dropdown-menu" ref={dropdownRef} onClick={handleInternalClick}>
            {sessionUser ? (
              <ProfileButton user={sessionUser} className="profile-button-menu" />
            ) : (
              <div className="dropdown-link-container">
                <OpenModalButton
                  buttonText="Sign Up"
                  modalComponent={<SignupFormModal />}
                  className='dropdown-link'
                />
                <OpenModalButton
                  buttonText="Log In"
                  modalComponent={<LoginFormModal />}
                  className='dropdown-link'
                />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
