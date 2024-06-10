import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import logo from '../../../public/assets/logo.png';
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";
import './Navigation.css';
import { BiBorderAll } from 'react-icons/bi';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const [visible, setVisible] = useState(false);

  const handleIconClick = () => {
    setVisible(!visible);
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
          <div className="dropdown-menu">
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

//   const sessionsLinks = sessionUser ? (
//     <div className='profile-container'>
//       <Link to='/spots'>Create a New Spot</Link>
//       <GiHamburgerMenu className="hamburger-menu"/>
//       <CgProfile
//         className='profile-icon'
//         onClick={handleIconClick}
//       />

//     {visible && (
//       <li className="dropdown-menu">
//             <ProfileButton
//             user={sessionUser}
//             clicked="visible"
//             className="profile-button-menu"
//             />{" "}
//       </li>
//     )}
//     </div>
//   ) : (
//     <div className="dropdown-link-container">
//       <OpenModalButton
//         buttonText="Sign Up"
//         modalComponent={<SignupFormModal />}
//         className='dropdown-link'
//       />
//       <OpenModalButton
//         buttonText="Log In"
//         modalComponent={<LoginFormModal />}
//         className='dropdown-link'
//       />
//     </div>
//   )

//   return (
//     <nav className='nav-bar'>
//       <NavLink to='/'>
//         <img
//           src={logo}
//           style={{ width: '150px', height: 'auto' }}
//           className='logo'
//         />
//       </NavLink>
//       <>
//       <CgProfile
//         className='profile-icon'
//         onClick={handleIconClick}
//       />{isLoaded && sessionsLinks}
//       </>
//     </nav>
//   );
// }

export default Navigation;
