const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  item_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
    // Remove required: true to prevent validation error
  },
  table: {
    type: mongoose.Schema.ObjectId,
    ref: 'Table',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
      message: 'Please select a valid order status'
    },
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update totals and timestamps
orderSchema.pre('save', function(next) {
  // Update the updatedAt field
  this.updatedAt = new Date();
  
  // Calculate totals
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);

  next();
});

// Update subtotal when item is modified
orderItemSchema.pre('save', function(next) {
  this.subtotal = this.price * this.quantity;
  next();
});

// Index for better query performance
orderSchema.index({ table: 1, status: 1 });
orderSchema.index({ restaurant: 1, orderDate: -1 });
orderSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);