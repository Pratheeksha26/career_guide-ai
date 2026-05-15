import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const { login, verifyOTP, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      if (result.requireOTP) {
        setShowOTP(true);
        toast.success('Verification code sent to your email');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await verifyOTP(formData.email, otp);
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for session expired message
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('session') === 'expired') {
      toast.error('Your session has expired. Please login again.');
    }
  }, [location]);

  return (
    <div className="login-auth-container">
      <div className="login-auth-card">
        <div className="login-auth-header">
          <div className="login-auth-logo">
            <FaSignInAlt className="login-auth-logo-icon" />
          </div>
          <h2 className="login-auth-title">Welcome Back</h2>
          <p className="login-auth-subtitle">Sign in to continue your career journey</p>
        </div>

        {showOTP ? (
          <form onSubmit={handleOTPSubmit} className="login-auth-form">
            <div className="login-auth-form-group">
              <label className="login-auth-label">
                <FaLock className="login-auth-icon" />
                Verification Code
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                className="login-auth-input"
                placeholder="Enter 6-digit code"
                disabled={isSubmitting}
                maxLength="6"
                autoComplete="one-time-code"
              />
              <p className="login-auth-help-text">
                Enter the code sent to {formData.email}
              </p>
            </div>

            <button
              type="submit"
              className="login-auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <FaSignInAlt className="login-auth-button-icon" />
                  Verify & Sign In
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="login-auth-back-btn" 
              onClick={() => setShowOTP(false)}
              disabled={isSubmitting}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="login-auth-form">
            <div className="login-auth-form-group">
              <label className="login-auth-label">
                <FaEnvelope className="login-auth-icon" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`login-auth-input ${errors.email ? 'login-auth-input-error' : ''}`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="login-auth-error-text">{errors.email}</span>
              )}
            </div>

            <div className="login-auth-form-group">
              <label className="login-auth-label">
                <FaLock className="login-auth-icon" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`login-auth-input ${errors.password ? 'login-auth-input-error' : ''}`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className="login-auth-error-text">{errors.password}</span>
              )}
            </div>

            <div className="login-auth-options">
              <label className="login-auth-remember">
                <input type="checkbox" className="login-auth-checkbox" />
                Remember me
              </label>
              <Link to="/forgot-password" name="forgot-password" className="login-auth-forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <FaSignInAlt className="login-auth-button-icon" />
                  Sign In
                </>
              )}
            </button>

            <div className="login-auth-divider">
              <span className="login-auth-divider-text">Or continue with</span>
            </div>

            <div className="login-auth-social-btns">
              <button type="button" className="login-auth-social-btn">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="login-auth-social-icon"
                />
                Google
              </button>
              <button type="button" className="login-auth-social-btn">
                <img
                  src="https://github.githubassets.com/favicons/favicon.png"
                  alt="GitHub"
                  className="login-auth-social-icon"
                />
                GitHub
              </button>
            </div>

            <div className="login-auth-footer">
              <p className="login-auth-footer-text">
                Don't have an account?{' '}
                <Link to="/register" className="login-auth-link">
                  <FaUserPlus className="login-auth-link-icon" />
                  Sign up now
                </Link>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;