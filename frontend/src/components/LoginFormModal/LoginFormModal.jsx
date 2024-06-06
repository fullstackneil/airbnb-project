import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  let isDemoUser = false;

  useEffect(() => {
    const errorsObj = {};

    if (credential.length < 4) {
      errorsObj.credential = "Username must be 4 characters or more";
    }

    if (password.length < 6) {
      errorsObj.password = "Password must be 6 characters or more";
    }
    setErrors(errors);
  }, [credential, password]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setErrors({});
  //   return dispatch(sessionActions.login({ credential, password }))
  //     .then(closeModal)
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       if (data && data.errors) {
  //         setErrors(data.errors);
  //       }
  //     });
  // };
  const createDemoUser = () => {
    isDemoUser = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDemoUser === true) {
      const demoUser = {
        credential: "demo.user@gmail.com",
        password: "password",
      };

      await dispatch(sessionActions.login(demoUser)).then(closeModal);
    } else {
      setErrors({});
      return dispatch(sessionActions.login({ credential, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (parseInt(res.status) === 401) {
            setErrors({ error: "The provided credientials are invalid" });
          }
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
  };

  return (
    <>
      <h1 className="login-text">Log In</h1>
      <form onSubmit={handleSubmit} className="login-modal" autoComplete="off">
      {Object.keys(errors).length >= 1 && (
          <p className="login-error">{errors.error}</p>
        )}
        {errors.credential && (
          <p className="login-error">{errors.credential}</p>
        )}
        <label className='credentials-container'>
          <input
            className='credentials-input-box'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Username or Email'
            required
          />
        </label>
        <label className='password-modal'>
          <input
            className='password-input-box'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button
        type="submit"
        disabled={Object.values(errors).length >= 1}
        className='login-button'>Log In
        </button>
        <div className='demo-user-container'>
          <a href={createDemoUser} className="demo-user-link">
          Demo User
          </a>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
