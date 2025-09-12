const { validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Add a new menu item
// @route   POST /api/menu/add-item
// @access  Private
const addItem = async (req, res) => {
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

    const { item_name, category, price } = req.body;

    // Check if user has a restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found. Please create restaurant information first.'
      });
    }

    // Check if item name already exists in this restaurant
    const existingItem = await MenuItem.findOne({ 
      item_name: item_name.trim(), 
      restaurant: restaurant._id
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Menu item with this name already exists in your restaurant'
      });
    }

    // Create new menu item
    const menuItem = await MenuItem.create({
      item_name: item_name.trim(),
      category: category.toLowerCase(),
      price: parseFloat(price),
      restaurant: restaurant._id,
      owner: req.user._id
    });

    // Populate restaurant info in response
    await menuItem.populate('restaurant', 'name');

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      menuItem: {
        _id: menuItem._id,
        item_name: menuItem.item_name,
        category: menuItem.category,
        price: menuItem.price,
        isAvailable: menuItem.isAvailable,
        restaurant: menuItem.restaurant,
        owner: menuItem.owner,
        createdAt: menuItem.createdAt,
        updatedAt: menuItem.updatedAt
      }
    });

  } catch (error) {
    console.error('Add menu item error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Menu item with this name already exists in your restaurant'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during menu item creation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Edit/Update a menu item
// @route   PUT /api/menu/:id
// @access  Private
const editItem = async (req, res) => {
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

    const { id } = req.params;
    const { item_name, category, price, isAvailable } = req.body;

    // Find menu item and ensure it belongs to the current user
    const menuItem = await MenuItem.findOne({ 
      _id: id, 
      owner: req.user._id
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or you do not have permission to edit this item'
      });
    }

    // Check if new item name already exists in this restaurant (excluding current item)
    if (item_name && item_name.trim() !== menuItem.item_name) {
      const existingItem = await MenuItem.findOne({ 
        item_name: item_name.trim(), 
        restaurant: menuItem.restaurant,
        _id: { $ne: id }
      });

      if (existingItem) {
        return res.status(400).json({
          success: false,
          message: 'Menu item with this name already exists in your restaurant'
        });
      }
    }

    // Update fields
    if (item_name) menuItem.item_name = item_name.trim();
    if (category) menuItem.category = category.toLowerCase();
    if (price !== undefined) menuItem.price = parseFloat(price);
    if (isAvailable !== undefined) menuItem.isAvailable = Boolean(isAvailable);

    await menuItem.save();

    // Populate restaurant info in response
    await menuItem.populate('restaurant', 'name');

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      menuItem: {
        _id: menuItem._id,
        item_name: menuItem.item_name,
        category: menuItem.category,
        price: menuItem.price,
        isAvailable: menuItem.isAvailable,
        restaurant: menuItem.restaurant,
        owner: menuItem.owner,
        createdAt: menuItem.createdAt,
        updatedAt: menuItem.updatedAt
      }
    });

  } catch (error) {
    console.error('Edit menu item error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Menu item with this name already exists in your restaurant'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during menu item update',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private
const deleteItem = async (req, res) => {
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

    const { id } = req.params;

    // Find menu item and ensure it belongs to the current user
    const menuItem = await MenuItem.findOne({ 
      _id: id, 
      owner: req.user._id
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or you do not have permission to delete this item'
      });
    }

    // Hard delete - remove the document from the database
    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item permanently deleted successfully',
      deletedItem: {
        _id: menuItem._id,
        item_name: menuItem.item_name,
        category: menuItem.category,
        price: menuItem.price
      }
    });

  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during menu item deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all menu items for user's restaurant
// @route   GET /api/menu
// @access  Private
const getItems = async (req, res) => {
  try {
    // Find user's restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get query parameters for filtering
    const { category, available } = req.query;

    // Build filter object
    let filter = { 
      restaurant: restaurant._id, 
      owner: req.user._id
    };

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (available !== undefined) {
      filter.isAvailable = available === 'true';
    }

    // Get all menu items for this restaurant with optional filters
    const menuItems = await MenuItem.find(filter)
      .populate('restaurant', 'name')
      .sort({ category: 1, item_name: 1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems
    });

  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu items',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get a single menu item by ID
// @route   GET /api/menu/:id
// @access  Private
const getItem = async (req, res) => {
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

    const { id } = req.params;

    // Find menu item and ensure it belongs to the current user
    const menuItem = await MenuItem.findOne({ 
      _id: id, 
      owner: req.user._id
    }).populate('restaurant', 'name');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or you do not have permission to view this item'
      });
    }

    res.status(200).json({
      success: true,
      menuItem
    });

  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  addItem,
  editItem,
  deleteItem,
  getItems,
  getItem
};