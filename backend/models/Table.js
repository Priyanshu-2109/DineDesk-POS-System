const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a table name'],
    trim: true,
    maxlength: [50, 'Table name cannot be more than 50 characters'],
    minlength: [1, 'Table name must be at least 1 character']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide table capacity'],
    min: [1, 'Table capacity must be at least 1'],
    max: [20, 'Table capacity cannot exceed 20 people']
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
  isActive: {
    type: Boolean,
    default: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
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

// Ensure table name is unique within the same restaurant
tableSchema.index({ name: 1, restaurant: 1 }, { unique: true });

// Update the updatedAt field before saving
tableSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Table', tableSchema);