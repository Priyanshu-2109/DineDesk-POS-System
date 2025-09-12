const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { sendOrderReceipt } = require('../utils/emailService');

// @desc    Create a new order for a table
// @route   POST /api/orders/create
// @access  Private
const createOrder = async (req, res) => {
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

    const { tableId, notes } = req.body;

    // Check if user has a restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found. Please create restaurant information first.'
      });
    }

    // Verify table exists and belongs to user
    const table = await Table.findOne({ 
      _id: tableId, 
      owner: req.user._id,
      restaurant: restaurant._id,
      isActive: true 
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found or you do not have permission to create orders for this table'
      });
    }

    // Check if table already has an active order
    const existingOrder = await Order.findOne({
      table: tableId,
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] }
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: 'Table already has an active order',
        existingOrder: {
          _id: existingOrder._id,
          orderNumber: existingOrder.orderNumber,
          status: existingOrder.status
        }
      });
    }

    // Generate orderNumber before creating the order
    const generateOrderNumber = async () => {
      try {
        const today = new Date();
        const dateStr = today.getFullYear().toString().slice(-2) + 
                       String(today.getMonth() + 1).padStart(2, '0') + 
                       String(today.getDate()).padStart(2, '0');
        
        // Find the last order of today
        const lastOrder = await Order.findOne({
          orderNumber: new RegExp(`^ORD${dateStr}`)
        }).sort({ orderNumber: -1 });

        let sequenceNumber = 1;
        if (lastOrder && lastOrder.orderNumber) {
          const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
          if (!isNaN(lastSequence)) {
            sequenceNumber = lastSequence + 1;
          }
        }

        return `ORD${dateStr}${String(sequenceNumber).padStart(3, '0')}`;
      } catch (error) {
        console.error('Error generating order number:', error);
        // Fallback to timestamp-based number
        const timestamp = Date.now().toString().slice(-6);
        return `ORD${timestamp}`;
      }
    };

    const orderNumber = await generateOrderNumber();

    // Create new order
    const order = await Order.create({
      orderNumber: orderNumber,
      table: tableId,
      restaurant: restaurant._id,
      owner: req.user._id,
      notes: notes || '',
      items: []
    });

    // Update table status to occupied
    await Table.findByIdAndUpdate(tableId, { isOccupied: true });

    // Populate references
    await order.populate([
      { path: 'table', select: 'name capacity' },
      { path: 'restaurant', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        table: order.table,
        restaurant: order.restaurant,
        status: order.status,
        totalAmount: order.totalAmount,
        totalItems: order.totalItems,
        notes: order.notes,
        items: order.items,
        orderDate: order.orderDate,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during order creation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Add item to an existing order
// @route   POST /api/orders/:id/add-item
// @access  Private
const addItemToOrder = async (req, res) => {
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
    const { menuItemId, quantity } = req.body;

    // Find order and ensure it belongs to the current user
    const order = await Order.findOne({ 
      _id: id, 
      owner: req.user._id,
      status: { $in: ['pending', 'confirmed'] } // Only allow adding items to pending/confirmed orders
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or cannot be modified'
      });
    }

    // Verify menu item exists and belongs to user's restaurant
    const menuItem = await MenuItem.findOne({ 
      _id: menuItemId, 
      owner: req.user._id,
      restaurant: order.restaurant,
      isAvailable: true
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or not available'
      });
    }

    // Check if item already exists in order
    const existingItemIndex = order.items.findIndex(
      item => item.menuItem.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      order.items[existingItemIndex].quantity += parseInt(quantity);
      order.items[existingItemIndex].subtotal = 
        order.items[existingItemIndex].price * order.items[existingItemIndex].quantity;
    } else {
      // Add new item to order
      order.items.push({
        menuItem: menuItemId,
        item_name: menuItem.item_name,
        price: menuItem.price,
        quantity: parseInt(quantity),
        subtotal: menuItem.price * parseInt(quantity)
      });
    }

    await order.save();

    // Populate references
    await order.populate([
      { path: 'table', select: 'name capacity' },
      { path: 'restaurant', select: 'name' },
      { path: 'items.menuItem', select: 'item_name category price' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Item added to order successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        table: order.table,
        restaurant: order.restaurant,
        status: order.status,
        totalAmount: order.totalAmount,
        totalItems: order.totalItems,
        notes: order.notes,
        items: order.items,
        orderDate: order.orderDate,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Add item to order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item to order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get order by table ID
// @route   GET /api/orders/table/:tableId
// @access  Private
const getOrderByTable = async (req, res) => {
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

    const { tableId } = req.params;

    // Find active order for the table
    const order = await Order.findOne({
      table: tableId,
      owner: req.user._id,
      status: { $in: ['pending', 'confirmed', 'preparing', 'ready', 'served'] }
    }).populate([
      { path: 'table', select: 'name capacity' },
      { path: 'restaurant', select: 'name' },
      { path: 'items.menuItem', select: 'item_name category price' }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No active order found for this table'
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order by table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all orders for user's restaurant
// @route   GET /api/orders
// @access  Private
const getAllOrders = async (req, res) => {
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
    const { status, date } = req.query;

    // Build filter object
    let filter = { 
      restaurant: restaurant._id, 
      owner: req.user._id
    };

    if (status) {
      filter.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.orderDate = { $gte: startDate, $lt: endDate };
    }

    // Get orders with populated references
    const orders = await Order.find(filter)
      .populate([
        { path: 'table', select: 'name capacity' },
        { path: 'restaurant', select: 'name' },
        { path: 'items.menuItem', select: 'item_name category price' }
      ])
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Checkout/Complete an order
// @route   PUT /api/orders/:id/checkout
// @access  Private
const checkout = async (req, res) => {
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
    const { email } = req.body; // Get email from request body

    // Find order and ensure it belongs to the current user
    const order = await Order.findOne({ 
      _id: id, 
      owner: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission to checkout this order'
      });
    }

    // Check if order can be checked out
    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order has already been completed or cancelled'
      });
    }

    if (order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot checkout an empty order'
      });
    }

    // Update order status and completion time
    order.status = 'completed';
    order.completedAt = new Date();
    await order.save();

    // Update table status to available
    await Table.findByIdAndUpdate(order.table, { isOccupied: false });

    // Populate references
    await order.populate([
      { path: 'table', select: 'name capacity' },
      { path: 'restaurant', select: 'name' },
      { path: 'items.menuItem', select: 'item_name category price' }
    ]);

    // Send email receipt if email is provided
    let emailResult = null;
    if (email) {
      try {
        emailResult = await sendOrderReceipt(order, email);
        console.log('Email receipt result:', emailResult);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the checkout if email fails
        emailResult = { success: false, message: 'Failed to send email receipt' };
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order checked out successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        table: order.table,
        restaurant: order.restaurant,
        status: order.status,
        totalAmount: order.totalAmount,
        totalItems: order.totalItems,
        items: order.items,
        orderDate: order.orderDate,
        completedAt: order.completedAt
      },
      emailReceipt: email ? emailResult : null
    });

  } catch (error) {
    console.error('Checkout order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during checkout',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
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
    const { status } = req.body;

    // Find order and ensure it belongs to the current user
    const order = await Order.findOne({ 
      _id: id, 
      owner: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission to update this order'
      });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Populate references
    await order.populate([
      { path: 'table', select: 'name capacity' },
      { path: 'restaurant', select: 'name' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        table: order.table,
        status: order.status,
        totalAmount: order.totalAmount,
        totalItems: order.totalItems,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createOrder,
  addItemToOrder,
  getOrderByTable,
  getAllOrders,
  checkout,
  updateOrderStatus
};