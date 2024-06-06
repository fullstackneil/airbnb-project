import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';
import { Navigate } from 'react-router-dom'

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validations, setValidations] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const validationsObj = {};

    if (email.length < 1) {
      validationsObj.email = "Email is required";
    } else if (username.length < 4) {
      validationsObj.username = "Username must be more than four characters";
    } else if (firstName.length < 1) {
      validationsObj.firstName = "First Name is required";
    } else if (lastName.length < 1) {
      validationsObj.lastName = "Last Name is required";
    } else if (password.length < 6) {
      validationsObj.password = "Password must be more than six characters";
    } else if (confirmPassword.length < 6) {
      validationsObj.confirmPassword =
        "Confirm Password must be more than six characters";
    }

    setValidations(validationsObj);

  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setValidations({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setValidations(data.errors);
          }
        });
    }
    return setValidations({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signup-form-container">
      <form onSubmit={handleSubmit} className='sign-up-modal'>
        <h1 className='signup-text'>Sign Up</h1>
        <label className="sign-up-field">
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            // placeholder="First Name"
          />
        </label>
        {validations.firstName && <p>{validations.firstName}</p>}
        <label className="sign-up-field">
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            // placeholder="Last Name"
          />
        </label>
        {validations.lastName && <p>{validations.lastName}</p>}
        <label className="sign-up-field">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // placeholder="Email"
          />
        </label>
        {validations.email && <p>{validations.email}</p>}
        <label className="sign-up-field">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            // placeholder="Username"
          />
        </label>
        {validations.username && <p>{validations.username}</p>}
        <label className="sign-up-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            // placeholder="Password"
          />
        </label>
        {validations.password && <p>{validations.password}</p>}
        <label className="sign-up-field">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            // placeholder="Confirm Password"
          />
        </label>
        {validations.confirmPassword && <p>{validations.confirmPassword}</p>}
        <button
        type="submit"
        className='signup-button'
        disabled={Object.keys(validations).length > 0}
        >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
