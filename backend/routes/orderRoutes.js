const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createOrder,
  addItemToOrder,
  getOrderByTable,
  getAllOrders,
  checkout,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules for creating an order
const createOrderValidation = [
  body('tableId')
    .isMongoId()
    .withMessage('Invalid table ID format')
    .notEmpty()
    .withMessage('Table ID is required'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot be more than 500 characters')
];

// Validation rules for adding item to order
const addItemValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),
    
  body('menuItemId')
    .isMongoId()
    .withMessage('Invalid menu item ID format')
    .notEmpty()
    .withMessage('Menu item ID is required'),
  
  body('quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be a number between 1 and 50')
    .notEmpty()
    .withMessage('Quantity is required')
];

// Validation rules for order ID parameter
const orderIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format')
];

// Validation rules for table ID parameter
const tableIdValidation = [
  param('tableId')
    .isMongoId()
    .withMessage('Invalid table ID format')
];

// Validation rules for updating order status
const updateStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),
    
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'])
    .withMessage('Please select a valid order status')
    .notEmpty()
    .withMessage('Status is required')
];

// Validation rules for checkout with email receipt
const checkoutValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),
    
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

// Validation rules for getting orders with filters
const getOrdersValidation = [
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'])
    .withMessage('Please select a valid order status'),

  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO format (YYYY-MM-DD)')
];

// All routes are protected (require authentication)
router.use(protect);

// Order management routes
router.get('/', getOrdersValidation, getAllOrders);
router.get('/table/:tableId', tableIdValidation, getOrderByTable);
router.post('/create', createOrderValidation, createOrder);
router.post('/:id/add-item', addItemValidation, addItemToOrder);
router.put('/:id/checkout', checkoutValidation, checkout);
router.put('/:id/status', updateStatusValidation, updateOrderStatus);

module.exports = router;