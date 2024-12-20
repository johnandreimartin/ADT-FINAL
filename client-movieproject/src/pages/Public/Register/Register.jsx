import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Register.css'; // Updated CSS for the design
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNo: '',
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [status, setStatus] = useState('idle');
  const [debounceState, setDebounceState] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Refs for input elements
  const refs = {
    email: useRef(),
    password: useRef(),
    confirmPassword: useRef(),
    firstName: useRef(),
    middleName: useRef(),
    lastName: useRef(),
    contactNo: useRef(),
  };

  const debouncedFormData = useDebounce(formData, 2000);

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleChange = (e, field) => {
    setIsFieldsDirty(true);
    setDebounceState(false);
    setFormData((prevData) => ({ ...prevData, [field]: e.target.value }));

    if (field === 'confirmPassword' || field === 'password') {
      setPasswordError(
        field === 'confirmPassword' || field === 'password'
          ? formData.password !== e.target.value
          : ''
      );
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setStatus('loading');

    try {
      const response = await axios.post('//register', { ...formData, role: 'user' }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/');
      setStatus('idle');
    } catch (error) {
      alert(error.response.data.message);
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [debouncedFormData]);

  return (
    <div className="register-page">
      <div className="register-banner">
        <h1>Join Us Today!</h1>
        <p>Create an account to get started.</p>
      </div>
      <div className="register-container">
        <form className="register-form">
          <h3>Register</h3>
          {['firstName', 'middleName', 'lastName', 'contactNo', 'email', 'password', 'confirmPassword'].map(
            (field) => (
              <div key={field} className="form-group">
                <label>{`${field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}:`}</label>
                <input
                  type={
                    (field === 'password' || field === 'confirmPassword') && !isShowPassword ? 'password' : 'text'
                  }
                  name={field}
                  ref={refs[field]}
                  onChange={(e) => handleChange(e, field)}
                />
                {debounceState && isFieldsDirty && !formData[field] && (
                  <span className="errors">This field is required</span>
                )}
              </div>
            )
          )}
          {passwordError && <span className="errors">{passwordError}</span>}
          <div className="show-password" onClick={handleShowPassword}>
            {isShowPassword ? 'Hide' : 'Show'} Password
          </div>
          <button
            type="button"
            className="register-button"
            disabled={status === 'loading'}
            onClick={() => {
              if (!formData.email || !formData.password || !formData.confirmPassword) {
                setIsFieldsDirty(true);
                if (!formData.email) refs.email.current.focus();
                else if (!formData.password) refs.password.current.focus();
                else if (!formData.confirmPassword) refs.confirmPassword.current.focus();
                return;
              }

              handleRegister();
            }}
          >
            {status === 'idle' ? 'Register' : 'Loading'}
          </button>
          <div className="login-container">
            <small>
              Already have an account? <a href="/">Login</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
