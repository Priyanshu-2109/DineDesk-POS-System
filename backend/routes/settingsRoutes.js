const express = require('express');
const { body } = require('express-validator');
const {
  getRestaurantInfo,
  updateRestaurantName,
  updateRestaurantInfo
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules for restaurant name update
const restaurantNameValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters')
    .notEmpty()
    .withMessage('Restaurant name is required')
];

// Validation rules for full restaurant info update
const restaurantInfoValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Street address cannot be more than 200 characters'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City cannot be more than 100 characters'),
  
  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('State cannot be more than 50 characters'),
  
  body('address.zipCode')
    .optional()
    .trim()
    .matches(/^[\d\-\s]+$/)
    .withMessage('Please provide a valid zip code'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('cuisine')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Cuisine type cannot be more than 50 characters')
];

// All routes are protected (require authentication)
router.use(protect);

// Restaurant information routes
router.get('/restaurant', getRestaurantInfo);
router.put('/restaurant', restaurantInfoValidation, updateRestaurantInfo);
router.put('/restaurant/name', restaurantNameValidation, updateRestaurantName);

module.exports = router;