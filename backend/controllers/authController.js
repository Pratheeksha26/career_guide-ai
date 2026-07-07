const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');

// Generate JWT Token
const generateToken = (userId, role = 'student') => {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
  if (!secret) {
    console.error('CRITICAL: JWT_SECRET or SESSION_SECRET is not defined!');
  }
  return jwt.sign(
    { 
      id: userId,
      role: role 
    }, 
    secret, 
    { expiresIn: '7d' }
  );
};

// Generate Temporary Registration Token
const generatePendingToken = (userData) => {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
  return jwt.sign(
    { 
      pendingUser: userData,
      type: 'registration'
    }, 
    secret, 
    { expiresIn: '15m' }
  );
};

// Register User
exports.register = async (req, res) => {
  try {
    const { username, email, password, educationLevel } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email or username already exists' 
      });
    }

    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Prepare pending user data (don't save to DB yet)
    const pendingUser = {
      username,
      email,
      password: hashedPassword,
      educationLevel: educationLevel || 'undergraduate',
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000)
    };

    // Generate temporary token to hold registration data
    const pendingToken = generatePendingToken(pendingUser);

    // Send OTP via email
    await emailService.sendOTP(email, otp);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      requireOTP: true,
      email: email,
      pendingToken // Frontend must send this back
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check if user is verified (optional: you might want to allow them to login but force verification)
    // Here we will proceed to password check first

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.lastLogin = new Date();
    await user.save();

    // Send OTP via email
    await emailService.sendOTP(user.email, otp);

    res.json({
      success: true,
      requireOTP: true,
      email: user.email,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// Verify OTP and complete login/registration
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, pendingToken } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    let user;

    // Case 1: Registration (User not in DB yet, data is in pendingToken)
    if (pendingToken) {
      try {
        const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
        const decoded = jwt.verify(pendingToken, secret);
        
        if (decoded.type !== 'registration' || decoded.pendingUser.email !== email) {
          return res.status(401).json({ success: false, message: 'Invalid verification token' });
        }

        const pendingData = decoded.pendingUser;

        // Check OTP
        if (pendingData.otp !== otp || new Date() > new Date(pendingData.otpExpires)) {
          return res.status(401).json({ success: false, message: 'Invalid or expired verification code' });
        }

        // OTP is valid, CREATE THE USER NOW
        user = await User.create({
          username: pendingData.username,
          email: pendingData.email,
          password: pendingData.password,
          educationLevel: pendingData.educationLevel,
          isVerified: true
        });

      } catch (err) {
        console.error('Pending token error:', err);
        return res.status(401).json({ success: false, message: 'Verification session expired' });
      }
    } 
    // Case 2: Login (User already in DB)
    else {
      user = await User.findOne({ where: { email } });
      if (!user || !user.otp || !user.otpExpires) {
        return res.status(401).json({ success: false, message: 'Invalid verification attempt' });
      }

      // Check if OTP matches and is not expired
      if (user.otp !== otp || new Date() > user.otpExpires) {
        return res.status(401).json({ success: false, message: 'Invalid or expired verification code' });
      }

      // Mark user as verified and clear OTP
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
    }

    // Generate final token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Verification successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        educationLevel: user.educationLevel,
        careerInterests: user.careerInterests || [],
        skills: user.skills || [],
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('OTP Verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Forgot Password Request
exports.forgotPassword = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with this email' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    await emailService.sendOTP(user.email, otp);

    res.json({
      success: true,
      message: 'Password reset code sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error during forgot password' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(401).json({ success: false, message: 'Invalid request' });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(401).json({ success: false, message: 'Invalid or expired reset code' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user record
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, educationLevel, careerInterests, skills } = req.body;
    const userId = req.userId;

    if (username) {
      const existingUser = await User.findOne({ 
        where: { 
          username, 
          id: { [Op.ne]: userId } 
        } 
      });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
    }

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (username) user.username = username;
    if (educationLevel) user.educationLevel = educationLevel;
    if (careerInterests) user.careerInterests = careerInterests;
    if (skills) user.skills = skills;
    
    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};