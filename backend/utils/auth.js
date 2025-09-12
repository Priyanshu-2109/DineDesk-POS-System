const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Generate token
  const token = generateToken(user._id);

  // Create user object without password
  const userInfo = {
    _id: user._id,
    name: user.name,
    email: user.email,
    subscription: (typeof user.subscription === 'undefined') ? null : user.subscription,
    isActive: user.isActive,
    restaurant: user.restaurant,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userInfo
  });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse
};