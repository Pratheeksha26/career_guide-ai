import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaKey, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    return newErrors;
  };

  const validateResetForm = () => {
    const newErrors = {};
    if (!formData.otp || formData.otp.length !== 6) {
      newErrors.otp = 'Valid 6-digit code is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmailForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await forgotPassword(formData.email);
      if (result && result.success) {
        setStep(2);
      }
    } catch (error) {
      console.error('Email submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateResetForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await resetPassword(formData.email, formData.otp, formData.newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-auth-container">
      <div className="forgot-auth-card">
        <div className="forgot-auth-header">
          <div className="forgot-auth-logo">
            <FaKey className="forgot-auth-logo-icon" />
          </div>
          <h2 className="forgot-auth-title">Reset Password</h2>
          <p className="forgot-auth-subtitle">
            {step === 1 ? 'Enter your email to receive a reset code' : 'Enter the code and your new password'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="forgot-auth-form">
            <div className="forgot-auth-form-group">
              <label className="forgot-auth-label">
                <FaEnvelope className="forgot-auth-icon" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`forgot-auth-input ${errors.email ? 'forgot-auth-input-error' : ''}`}
                placeholder="Enter your registered email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="forgot-auth-error-text">{errors.email}</span>
              )}
            </div>

            <button
              type="submit"
              className="forgot-auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span>Sending...</span> : <span>Send Reset Code</span>}
            </button>
            
            <div className="forgot-auth-footer">
              <Link to="/login" className="forgot-auth-link">
                <FaArrowLeft className="forgot-auth-link-icon" />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="forgot-auth-form">
            <div className="forgot-auth-form-group">
              <label className="forgot-auth-label">
                <FaLock className="forgot-auth-icon" />
                Verification Code
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '').substring(0, 6)})}
                className={`forgot-auth-input ${errors.otp ? 'forgot-auth-input-error' : ''}`}
                placeholder="Enter 6-digit code"
                disabled={isSubmitting}
                maxLength="6"
              />
              {errors.otp && (
                <span className="forgot-auth-error-text">{errors.otp}</span>
              )}
              <p className="forgot-auth-help-text">Sent to {formData.email}</p>
            </div>

            <div className="forgot-auth-form-group">
              <label className="forgot-auth-label">
                <FaKey className="forgot-auth-icon" />
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`forgot-auth-input ${errors.newPassword ? 'forgot-auth-input-error' : ''}`}
                placeholder="Enter new password"
                disabled={isSubmitting}
              />
              {errors.newPassword && (
                <span className="forgot-auth-error-text">{errors.newPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="forgot-auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span>Resetting...</span> : <span>Reset Password</span>}
            </button>
            
            <button 
              type="button" 
              className="forgot-auth-back-btn" 
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              <FaArrowLeft className="forgot-auth-link-icon" style={{marginRight: '8px'}} />
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
