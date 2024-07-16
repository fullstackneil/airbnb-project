import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const validationsObj = {};

    if (credential.length < 4) {
      validationsObj.credential = "Username must be 4 characters or more";
    }

    if (password.length < 6) {
      validationsObj.password = "Password must be 6 characters or more";
    }
    setValidations(validationsObj);
  }, [credential, password]);

  const handleSubmit = async (e, isDemoUser = false) => {
    e.preventDefault();
    setValidations({});

    if (isDemoUser) {
      const demoCredentials = {
        credential: "Demo-User",
        password: "password",
      };
      return dispatch(sessionActions.login(demoCredentials))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setValidations({error: data.message});
        }
      });

    } else {
      return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setValidations({error: data.message});
        }
      });
    }
  };
    return (
    <div id='login-popup-container'>
      <h1 className="login-text">Log In</h1>
      <form onSubmit={handleSubmit} className="login-modal">
          <input
            className='credentials-input-box'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Username or Email'
            required
          />
          {credential in validations && <span id='invalid-credentials'>{validations.credential}</span>}
          <input
            className='password-input-box'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {password in validations && <span id='invalid-password'>{validations.password}</span>}
          {validations.error && <span id='error-message'>{validations.error}</span>}
        <button
        type="submit"
        disabled={Object.keys(validations).length > 0}
        className='login-button'>Log In
        </button>
        <button className='demo-user-container'
          type='submit'
          onClick={(e) => handleSubmit(e, true)}
          >Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
