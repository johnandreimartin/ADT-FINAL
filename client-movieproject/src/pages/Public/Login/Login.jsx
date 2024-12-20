import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css'; // Ensure the updated CSS is linked
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');
    console.log(data);

    try {
      const res = await axios.post('/user/login', data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      console.log(res);
      localStorage.setItem('accessToken', res.data.access_token);
      navigate('/Home');
      setStatus('idle');
    } catch (e) {
      console.error(e);
      setStatus('idle');
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="login-page">
      <div className="login-banner">
        <h1>Welcome Back!</h1>
        <p>Sign in to access your account.</p>
      </div>
      <div className="login-container">
        <form className="login-form">
          <h3>Login</h3>
          <div className="form-group">
            <label>E-mail:</label>
            <input
              type="text"
              name="email"
              ref={emailRef}
              onChange={(e) => handleOnChange(e, 'email')}
            />
            {debounceState && isFieldsDirty && email === '' && (
              <span className="errors">This field is required</span>
            )}
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type={isShowPassword ? 'text' : 'password'}
              name="password"
              ref={passwordRef}
              onChange={(e) => handleOnChange(e, 'password')}
            />
            {debounceState && isFieldsDirty && password === '' && (
              <span className="errors">This field is required</span>
            )}
          </div>
          <div className="show-password" onClick={handleShowPassword}>
            {isShowPassword ? 'Hide' : 'Show'} Password
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button
            type="button"
            className="login-button"
            disabled={status === 'loading'}
            onClick={() => {
              if (status === 'loading') {
                return;
              }
              if (email && password) {
                handleLogin({
                  type: 'login',
                  user: { email, password },
                });
              } else {
                setIsFieldsDirty(true);
                if (email === '') {
                  emailRef.current.focus();
                }

                if (password === '') {
                  passwordRef.current.focus();
                }
              }
            }}
          >
            {status === 'idle' ? 'Login' : 'Loading'}
          </button>
          <div className="register-container">
            <a href="/register">
              <small>Register</small>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
