const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/auth');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

  const { name, email, password, subscription } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user with explicit subscription null so field appears in DB
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      subscription: null
    });

    // Don't generate token upon signup. Token is generated only on login.
    // Return created user (without password) so client can proceed to login.
    const safeUserDoc = await User.findById(user._id).select('-password');
    // Normalize to plain object and ensure subscription key exists (null if unset)
    const safeUser = safeUserDoc ? safeUserDoc.toObject() : null;
    if (safeUser) {
      safeUser.subscription = (typeof safeUser.subscription === 'undefined') ? null : safeUser.subscription;
    }

    res.status(201).json({
      success: true,
      message: 'User created. Please login to receive authentication token.',
      user: safeUser
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

  // Update last login
  await user.updateLastLogin();

  // Send token response (utils will include subscription)
  sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userDoc = await User.findById(req.user._id).select('-password');
    const user = userDoc ? userDoc.toObject() : null;
    if (user) {
      user.subscription = (typeof user.subscription === 'undefined') ? null : user.subscription;
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Set subscription for current user (user purchases/subscribes)
// @route   PUT /api/auth/subscription
// @access  Private
const setSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;

    // validate subscription server-side
    const allowed = ['starter', 'professional', 'enterprise'];
    if (!allowed.includes(subscription)) {
      return res.status(400).json({ success: false, message: 'Invalid subscription tier' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.subscription = subscription;
    await user.save();

    const updated = user.toObject();
    updated.subscription = (typeof updated.subscription === 'undefined') ? null : updated.subscription;

    res.status(200).json({ success: true, message: 'Subscription updated', user: updated });
  } catch (error) {
    console.error('Set subscription error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  setSubscription
};