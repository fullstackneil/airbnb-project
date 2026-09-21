import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import styles from './SignupForm.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // These match the server's rules in backend/routes/api/users.js.
    if (firstName.trim().length < 3) validationsObj.firstName = "First name must be 3 characters or more";
    if (lastName.trim().length < 3) validationsObj.lastName = "Last name must be 3 characters or more";
    if (!EMAIL_PATTERN.test(email.trim())) validationsObj.email = "Please provide a valid email";
    if (username.trim().length < 4) validationsObj.username = "Username must be 4 characters or more";
    else if (EMAIL_PATTERN.test(username.trim())) validationsObj.username = "Username cannot be an email";
    if (password.length < 6) validationsObj.password = "Password must be 6 characters or more";
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

  // Enable once every field has something in it; submitting then explains
  // exactly what (if anything) still needs fixing.
  const isButtonDisabled = () => {
    return !email || !username || !firstName || !lastName || !password || !confirmPassword;
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h1 className={styles.heading}>Sign Up</h1>
        <label className={styles.field}>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {'firstName' in validations && <p className={styles.validationMessage} role='alert'>{validations.firstName}</p>}
        <label className={styles.field}>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {'lastName' in validations && <p className={styles.validationMessage} role='alert'>{validations.lastName}</p>}
        <label className={styles.field}>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {'email' in validations && <p className={styles.validationMessage} role='alert'>{validations.email}</p>}
        <label className={styles.field}>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {'username' in validations && <p className={styles.validationMessage} role='alert'>{validations.username}</p>}
        <label className={styles.field}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {'password' in validations && <p className={styles.validationMessage} role='alert'>{validations.password}</p>}
        <label className={styles.field}>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {'confirmPassword' in validations && <p className={styles.validationMessage} role='alert'>{validations.confirmPassword}</p>}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isButtonDisabled()}
        >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
