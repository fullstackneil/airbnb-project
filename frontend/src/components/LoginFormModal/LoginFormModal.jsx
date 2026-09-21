import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import styles from './LoginForm.module.css';

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
      <h1 className={styles.heading}>Log In</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor='login-credential' className='visually-hidden'>Username or Email</label>
          <input
            id='login-credential'
            className={styles.credentialInput}
            type="text"
            autoComplete='username'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Username or Email'
            required
          />
          {/* Only show a field's message once the user has typed in it. */}
          {credential && 'credential' in validations && <span className={styles.fieldError}>{validations.credential}</span>}
          <label htmlFor='login-password' className='visually-hidden'>Password</label>
          <input
            id='login-password'
            className={styles.passwordInput}
            type="password"
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {password && 'password' in validations && <span className={styles.fieldError}>{validations.password}</span>}
          {validations.error && <span className={styles.formError} role='alert'>{validations.error}</span>}
        <button
        type="submit"
        disabled={'credential' in validations || 'password' in validations}
        className={styles.loginButton}>Log In
        </button>
        <button className={styles.demoButton}
          type='submit'
          onClick={(e) => handleSubmit(e, true)}
          >Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
