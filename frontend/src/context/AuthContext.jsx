import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      const token = authService.getToken();
      const storedUser = authService.getStoredUser();
      
      if (token && storedUser) {
        try {
          // Try to get fresh user data from server
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // If server returns null, clear local storage
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      if (result.success) {
        if (result.requireOTP) {
          return result;
        }
        setUser(result.user);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        navigate('/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.login(userData);
      if (result.success) {
        if (result.requireOTP) {
          return result;
        }
        setUser(result.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        
        // Redirect to original destination or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        toast.error(result.message || 'Login failed');
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData);
      if (result.success) {
        setUser(result.user);
        toast.success('Profile updated successfully');
      }
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const result = await authService.changePassword(passwordData);
      if (result.success) {
        toast.success('Password changed successfully');
      }
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Password change failed');
      throw error;
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp, pendingToken = null) => {
    setLoading(true);
    try {
      const result = await authService.verifyOTP(email, otp, pendingToken);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        toast.success('Verification successful!');
        navigate('/');
      } else {
        toast.error(result.message || 'Verification failed');
      }
      return result;
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'Verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        toast.success('Password reset code sent to your email');
      }
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to request password reset');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email, otp, newPassword) => {
    setLoading(true);
    try {
      const result = await authService.resetPassword(email, otp, newPassword);
      if (result.success) {
        toast.success('Password reset successfully');
        navigate('/login');
      }
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    verifyOTP,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};