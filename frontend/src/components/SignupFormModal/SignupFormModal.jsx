import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

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

  // Clear validations when the modal is first opened
  const initializeForm = () => {
    setEmail("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setValidations({});
  };

  const validate = () => {
    const validationsObj = {};

    if (!email) validationsObj.email = "Email is required";
    if (username.length < 5) validationsObj.username = "Username must be more than four characters";
    if (!firstName) validationsObj.firstName = "First Name is required";
    if (!lastName) validationsObj.lastName = "Last Name is required";
    if (password.length < 7) validationsObj.password = "Password must be more than six characters";
    if (confirmPassword.length < 7) validationsObj.confirmPassword = "Confirm Password must be more than six characters";
    if (password !== confirmPassword) validationsObj.confirmPassword = "Confirm Password field must be the same as the Password field";

    return validationsObj;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationsObj = validate();
    if (Object.keys(validationsObj).length > 0) {
      setValidations(validationsObj);
      return;
    }

    setValidations({});
    dispatch(sessionActions.signup({
      email,
      username,
      firstName,
      lastName,
      password
    }))
    .then(() => {
      closeModal();
      initializeForm(); // Clear form on successful submission
    })
    .catch(async (res) => {
      const data = await res.json();
      if (data?.errors) {
        setValidations(data.errors);
      }
    });
  };

  const isButtonDisabled = () => {
    return !email || username.length < 4 || !firstName || !lastName || password.length < 6 || confirmPassword.length < 6
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
          />
        </label>
        {'firstName' in validations && <p className='validation-msg'>{validations.firstName}</p>}
        <label className="sign-up-field">
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {'lastName' in validations && <p className='validation-msg'>{validations.lastName}</p>}
        <label className="sign-up-field">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {'email' in validations && <p className='validation-msg'>{validations.email}</p>}
        <label className="sign-up-field">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {'username' in validations && <p className='validation-msg'>{validations.username}</p>}
        <label className="sign-up-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {'password' in validations && <p className='validation-msg'>{validations.password}</p>}
        <label className="sign-up-field">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {'confirmPassword' in validations && <p className='validation-msg'>{validations.confirmPassword}</p>}
        <button
          type="submit"
          className='signup-button'
          disabled={isButtonDisabled()}
        >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
