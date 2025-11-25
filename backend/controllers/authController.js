const { validationResult } = require("express-validator");
const User = require("../models/User");
const { sendTokenResponse } = require("../utils/auth");
const { sendFreeTrialNotification } = require("../utils/emailService");

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password, subscription } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user with explicit subscription null so field appears in DB
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      subscription: null,
    });

    // Send free trial notification to company email (non-blocking)
    sendFreeTrialNotification({
      name: user.name,
      email: user.email,
    }).catch((error) => {
      console.error("Error sending free trial notification:", error);
      // Don't block user signup if notification fails
    });

    // Don't generate token upon signup. Token is generated only on login.
    // Return created user (without password) so client can proceed to login.
    const safeUserDoc = await User.findById(user._id).select("-password");
    // Normalize to plain object and ensure subscription key exists (null if unset)
    const safeUser = safeUserDoc ? safeUserDoc.toObject() : null;
    if (safeUser) {
      safeUser.subscription =
        typeof safeUser.subscription === "undefined"
          ? null
          : safeUser.subscription;
    }

    res.status(201).json({
      success: true,
      message: "User created. Please login to receive authentication token.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during signup",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact administrator.",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Send token response (utils will include subscription)
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userDoc = await User.findById(req.user._id).select("-password");
    const user = userDoc ? userDoc.toObject() : null;
    if (user) {
      user.subscription =
        typeof user.subscription === "undefined" ? null : user.subscription;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// @desc    Set subscription for current user (user purchases/subscribes)
// @route   PUT /api/auth/subscription
// @access  Private
const setSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;

    // validate subscription server-side
    const allowed = ["starter", "professional", "enterprise"];
    if (!allowed.includes(subscription)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid subscription tier" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.subscription = subscription;
    await user.save();

    const updated = user.toObject();
    updated.subscription =
      typeof updated.subscription === "undefined" ? null : updated.subscription;

    res
      .status(200)
      .json({ success: true, message: "Subscription updated", user: updated });
  } catch (error) {
    console.error("Set subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email address",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // Save OTP and expiry (10 minutes)
    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send OTP via email
    const emailService = require("../utils/emailService");
    try {
      await emailService.sendPasswordResetOTP(user.email, user.name, otp);

      res.status(200).json({
        success: true,
        message: "OTP sent to your email address",
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Clear OTP fields if email fails
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, OTP, and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+resetPasswordOTP +resetPasswordOTPExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Check if OTP exists and not expired
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpire) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found. Please request a new OTP.",
      });
    }

    if (user.resetPasswordOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    const bcrypt = require("bcryptjs");
    const isOTPValid = await bcrypt.compare(otp, user.resetPasswordOTP);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  setSubscription,
  forgotPassword,
  resetPassword,
};
