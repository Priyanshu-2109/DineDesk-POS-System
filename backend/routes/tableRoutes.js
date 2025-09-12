const express = require('express');
const { body, param } = require('express-validator');
const {
  addTable,
  deleteTable,
  getTables
} = require('../controllers/tableController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules for adding a table
const addTableValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Table name must be between 1 and 50 characters')
    .notEmpty()
    .withMessage('Table name is required'),
  
  body('capacity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Table capacity must be a number between 1 and 20')
    .notEmpty()
    .withMessage('Table capacity is required')
];

// Validation rules for deleting a table
const deleteTableValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid table ID format')
];

// All routes are protected (require authentication)
router.use(protect);

// Table management routes
router.get('/', getTables);
router.post('/add-table', addTableValidation, addTable);
router.delete('/delete-table/:id', deleteTableValidation, deleteTable);

module.exports = router;