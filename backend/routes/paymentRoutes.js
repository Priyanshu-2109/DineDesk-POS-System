const express = require("express");
const {
  createOrder,
  verifyPayment,
  getPlans,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/plans", getPlans);

// Protected routes
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
