import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import logo from '../../../public/assets/logo.png'
import { FaMagnifyingGlass } from "react-icons/fa6";
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
            visible ? setVisible(false) : setVisible(true);
          }}
        />
      </div>
      {visible && (
        <li className="drop-down-menu">
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
      <div className="search-box-container">
        <p>Anywhere</p>
        <div className="border-right"></div>
        <p>Any week</p>
        <div className="border-right"></div>
        <p>Add guests</p>
        <div className="circle-magnify-glass">
          <FaMagnifyingGlass className="magnify-glass" />
        </div>
      </div>
      <div
        className='hamburger-menu'>{isLoaded && sessionLinks}
      </div>

    </nav>
  );
}

export default Navigation;
