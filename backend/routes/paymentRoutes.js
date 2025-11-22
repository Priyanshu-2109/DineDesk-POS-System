const express = require("express");
const {
  createOrder,
  verifyPayment,
  getPlans,
  testEmail,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/plans", getPlans);

// Test email endpoint (for development/testing)
router.post("/test-email", testEmail);

// Protected routes
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
