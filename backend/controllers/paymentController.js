const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

// @desc    Create payment order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    // Initialize Razorpay with environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay configuration missing",
        error:
          "RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not found in environment variables",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { plan } = req.body;

    // Define subscription plans with pricing
    const plans = {
      starter: { amount: 99900, currency: "INR", name: "Starter Plan" }, // ₹999
      professional: {
        amount: 199900,
        currency: "INR",
        name: "Professional Plan",
      }, // ₹1999
      enterprise: { amount: 299900, currency: "INR", name: "Enterprise Plan" }, // ₹2999
    };

    if (!plans[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan",
      });
    }

    // Generate a short unique receipt ID (max 40 chars)
    // Format: rcpt_<last8charsOfUserId>_<timestamp>
    const userIdSuffix = req.user._id.toString().slice(-8);
    const timestamp = Date.now().toString().slice(-10); // last 10 digits
    const receipt = `rcpt_${userIdSuffix}_${timestamp}`;

    const options = {
      amount: plans[plan].amount, // amount in paise
      currency: plans[plan].currency,
      receipt: receipt,
      notes: {
        userId: req.user._id.toString(),
        plan: plan,
        planName: plans[plan].name,
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        plan: plan,
        planName: plans[plan].name,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @desc    Verify payment and update subscription
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    // Initialize Razorpay with environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay configuration missing",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Fetch payment details from Razorpay to ensure it's captured
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }

    // Update user subscription
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.subscription = plan;
    await user.save();

    // Return updated user data
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: "Payment verified and subscription updated successfully",
      user: updatedUser,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @desc    Get subscription plans
// @route   GET /api/payment/plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: "starter",
        name: "Starter Plan",
        price: 999,
        currency: "INR",
        interval: "month",
        features: [
          "Up to 5 tables",
          "Basic menu management",
          "Order tracking",
          "Email support",
        ],
      },
      {
        id: "professional",
        name: "Professional Plan",
        price: 1999,
        currency: "INR",
        interval: "month",
        popular: true,
        features: [
          "Up to 20 tables",
          "Advanced menu management",
          "Order tracking & analytics",
          "Customer management",
          "Priority support",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise Plan",
        price: 2999,
        currency: "INR",
        interval: "month",
        features: [
          "Unlimited tables",
          "Full restaurant management",
          "Advanced analytics",
          "Multi-location support",
          "Dedicated support",
        ],
      },
    ];

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPlans,
};
