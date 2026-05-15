import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUserGraduate, 
  FaUserPlus,
  FaArrowLeft
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    educationLevel: 'undergraduate',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingToken, setPendingToken] = useState(null);
  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const educationLevels = [
    { value: 'school', label: 'School Student' },
    { value: 'undergraduate', label: 'Undergraduate Student' },
    { value: 'graduate', label: 'Graduate Student' },
    { value: 'professional', label: 'Working Professional' },
  ];

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
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be less than 30 characters';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        educationLevel: formData.educationLevel,
      };
      
      const result = await register(userData);
      if (result.requireOTP) {
        setPendingToken(result.pendingToken);
        setShowOTP(true);
        toast.success('Verification code sent to your email');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
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
      await verifyOTP(formData.email, otp, pendingToken);
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reg-auth-container">
      <div className="reg-auth-card">
        <div className="reg-auth-header">
          <div className="reg-auth-logo">
            <FaUserPlus className="reg-auth-logo-icon" />
          </div>
          <h2 className="reg-auth-title">Create Account</h2>
          <p className="reg-auth-subtitle">Join us and start your career journey</p>
        </div>

        {showOTP ? (
          <form onSubmit={handleOTPSubmit} className="reg-auth-form">
            <div className="reg-auth-form-group">
              <label className="reg-auth-label">
                <FaLock className="reg-auth-icon" />
                Verification Code
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                className="reg-auth-input"
                placeholder="Enter 6-digit code"
                disabled={isSubmitting}
                maxLength="6"
                autoComplete="one-time-code"
              />
              <p className="reg-auth-help-text">
                Enter the code sent to {formData.email}
              </p>
            </div>

            <button
              type="submit"
              className="reg-auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <FaUserPlus className="reg-auth-button-icon" />
                  Verify & Create Account
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="reg-auth-back-btn" 
              onClick={() => setShowOTP(false)}
              disabled={isSubmitting}
            >
              Back to Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="reg-auth-form">
            <div className="reg-auth-form-group">
              <label className="reg-auth-label">
                <FaUser className="reg-auth-icon" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`reg-auth-input ${errors.username ? 'reg-auth-input-error' : ''}`}
                placeholder="Choose a username"
                disabled={isSubmitting}
              />
              {errors.username && (
                <span className="reg-auth-error-text">{errors.username}</span>
              )}
            </div>

            <div className="reg-auth-form-group">
              <label className="reg-auth-label">
                <FaEnvelope className="reg-auth-icon" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`reg-auth-input ${errors.email ? 'reg-auth-input-error' : ''}`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="reg-auth-error-text">{errors.email}</span>
              )}
            </div>

            <div className="reg-auth-form-group">
              <label className="reg-auth-label">
                <FaLock className="reg-auth-icon" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`reg-auth-input ${errors.password ? 'reg-auth-input-error' : ''}`}
                placeholder="Create a password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className="reg-auth-error-text">{errors.password}</span>
              )}
            </div>

            <div className="reg-auth-form-group">
              <label className="reg-auth-label">
                <FaLock className="reg-auth-icon" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`reg-auth-input ${errors.confirmPassword ? 'reg-auth-input-error' : ''}`}
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <span className="reg-auth-error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="reg-auth-form-group">
              <label className="reg-auth-label">
                <FaUserGraduate className="reg-auth-icon" />
                Education Level
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="reg-auth-select"
                disabled={isSubmitting}
              >
                {educationLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="reg-auth-terms">
              <label className="reg-auth-terms-label">
                <input type="checkbox" className="reg-auth-checkbox" required />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="reg-auth-terms-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="reg-auth-terms-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="reg-auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <FaUserPlus className="reg-auth-button-icon" />
                  Create Account
                </>
              )}
            </button>

            <div className="reg-auth-footer">
              <p className="reg-auth-footer-text">
                Already have an account?{' '}
                <Link to="/login" className="reg-auth-link">
                  <FaArrowLeft className="reg-auth-link-icon" />
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;