import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import logo from '../../../public/assets/logo.png'
import { CgProfile } from "react-icons/cg";
import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const [ visible, setVisible ] = useState(false);

  const sessionLinks = sessionUser ?
    (
    <div className="user-menu-container">
      <div className="three-links">
        <Link to="/spots">Create a New spot</Link>
        <MdAccountCircle
          className="icon-nav-bar"
          onClick={() => {
            setVisible(!visible)}
          }
        />
      </div>
      {visible && (
        <li className="dropdown-menu">
          <ProfileButton user={sessionUser} id="login-sign-up-button" />{" "}
        </li>
      )}
    </div>
    ) : (
      <>
        <li>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            className='login-sign-up-button'
          />
          {/* <NavLink to="/login">Log In</NavLink> */}
        </li>
        <li>
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            className='login-sign-up-button'
          />
          {/* <NavLink to="/signup">Sign Up</NavLink> */}
        </li>
      </>
    );

  return (
    <nav className='nav-bar'>
      <NavLink to='/'>
        <img
          src={logo}
          style={{ width: '100px', height: 'auto' }}
          className='logo"'
        />
      </NavLink>

      <div className='profile-container'>
        <CgProfile className='profile-icon' onClick={() => {
            visible ? setVisible(false) : setVisible(true);
          }}/>
        {visible && (
          <div className="dropdown-menu">
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
              className='dropdown-link transparent-button'
            />
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
              className='dropdown-link transparent-button'
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
