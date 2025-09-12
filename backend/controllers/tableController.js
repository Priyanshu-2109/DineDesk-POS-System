const { validationResult } = require('express-validator');
const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');

// @desc    Add a new table
// @route   POST /api/tables/add-table
// @access  Private
const addTable = async (req, res) => {
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

    const { name, capacity } = req.body;

    // Check if user has a restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found. Please create restaurant information first.'
      });
    }

    // Check if table name already exists in this restaurant
    const existingTable = await Table.findOne({ 
      name: name.trim(), 
      restaurant: restaurant._id,
      isActive: true 
    });

    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: 'Table with this name already exists in your restaurant'
      });
    }

    // Create new table
    const table = await Table.create({
      name: name.trim(),
      capacity: parseInt(capacity),
      restaurant: restaurant._id,
      owner: req.user._id
    });

    // Populate restaurant info in response
    await table.populate('restaurant', 'name');

    res.status(201).json({
      success: true,
      message: 'Table added successfully',
      table: {
        _id: table._id,
        name: table.name,
        capacity: table.capacity,
        restaurant: table.restaurant,
        owner: table.owner,
        isActive: table.isActive,
        isOccupied: table.isOccupied,
        position: table.position,
        createdAt: table.createdAt,
        updatedAt: table.updatedAt
      }
    });

  } catch (error) {
    console.error('Add table error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Table with this name already exists in your restaurant'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during table creation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/delete-table/:id
// @access  Private
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for validation errors (e.g., invalid MongoId)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Table ID is required'
      });
    }

    // Find table and ensure it belongs to the current user
    // NOTE: do not restrict by isActive here so previously soft-deleted
    // tables can still be hard-deleted. Just ensure ownership.
    const table = await Table.findOne({ 
      _id: id, 
      owner: req.user._id
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found or you do not have permission to delete this table'
      });
    }

    // Check if table is currently occupied
    if (table.isOccupied) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete table that is currently occupied'
      });
    }

    // Hard delete - remove the document from the database
    await table.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Table permanently deleted successfully',
      deletedTable: {
        _id: table._id,
        name: table.name,
        capacity: table.capacity
      }
    });

  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during table deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all tables for user's restaurant
// @route   GET /api/tables
// @access  Private
const getTables = async (req, res) => {
  try {
    // Find user's restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get all active tables for this restaurant
    const tables = await Table.find({ 
      restaurant: restaurant._id, 
      owner: req.user._id,
      isActive: true 
    }).populate('restaurant', 'name');

    res.status(200).json({
      success: true,
      count: tables.length,
      tables
    });

  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tables',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  addTable,
  deleteTable,
  getTables
};