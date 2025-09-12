const { validationResult } = require('express-validator');
const Restaurant = require('../models/Restaurant');

// @desc    Get restaurant information for current user
// @route   GET /api/settings/restaurant
// @access  Private
const getRestaurantInfo = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant information not found'
      });
    }

    res.status(200).json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Get restaurant info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update restaurant name
// @route   PUT /api/settings/restaurant/name
// @access  Private
const updateRestaurantName = async (req, res) => {
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

    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant name is required'
      });
    }

    // Find or create restaurant for the user
    let restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      // Create new restaurant if doesn't exist
      restaurant = await Restaurant.create({
        name: name.trim(),
        owner: req.user._id
      });
    } else {
      // Update existing restaurant name
      restaurant.name = name.trim();
      await restaurant.save();
    }

    res.status(200).json({
      success: true,
      message: 'Restaurant name updated successfully',
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        owner: restaurant.owner,
        createdAt: restaurant.createdAt,
        updatedAt: restaurant.updatedAt
      }
    });

  } catch (error) {
    console.error('Update restaurant name error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during restaurant name update',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Create or update full restaurant information
// @route   PUT /api/settings/restaurant
// @access  Private
const updateRestaurantInfo = async (req, res) => {
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

    const allowedFields = ['name', 'address', 'phone', 'email', 'website', 'cuisine'];
    const updateData = {};

    // Filter only allowed fields from request body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Find or create restaurant for the user
    let restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      // Create new restaurant if doesn't exist
      restaurant = await Restaurant.create({
        ...updateData,
        owner: req.user._id
      });
    } else {
      // Update existing restaurant
      Object.keys(updateData).forEach(key => {
        restaurant[key] = updateData[key];
      });
      await restaurant.save();
    }

    res.status(200).json({
      success: true,
      message: 'Restaurant information updated successfully',
      restaurant
    });

  } catch (error) {
    console.error('Update restaurant info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during restaurant update',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getRestaurantInfo,
  updateRestaurantName,
  updateRestaurantInfo
};