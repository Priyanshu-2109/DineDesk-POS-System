const express = require('express');
const { body } = require('express-validator');
const {
  signup,
  login,
  getMe,
  logout,
  setSubscription
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  // Note: subscription is set only by owner when they purchase; do not accept at signup
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Subscription update validation
const subscriptionValidation = [
  body('subscription')
    .isIn(['starter', 'professional', 'enterprise'])
    .withMessage('Subscription must be starter, professional, or enterprise')
];

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
// Update subscription for the authenticated user
router.put('/subscription', protect, subscriptionValidation, setSubscription);

module.exports = router;