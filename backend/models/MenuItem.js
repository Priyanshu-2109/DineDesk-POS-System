const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: [true, "Please provide item name"],
    trim: true,
    maxlength: [100, "Item name cannot be more than 100 characters"],
    minlength: [1, "Item name must be at least 1 character"],
  },
  category: {
    type: String,
    required: [true, "Please provide item category"],
    trim: true,
    maxlength: [50, "Category name cannot be more than 50 characters"],
    minlength: [1, "Category name must be at least 1 character"],
  },
  price: {
    type: Number,
    required: [true, "Please provide item price"],
    min: [0, "Price cannot be negative"],
    max: [999999, "Price cannot exceed 999,999"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure item name is unique within the same restaurant
menuItemSchema.index({ item_name: 1, restaurant: 1 }, { unique: true });

// Update the updatedAt field before saving
menuItemSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
