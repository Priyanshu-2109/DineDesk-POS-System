// Role-based access control middleware

// Check if user has required role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

// Check if user has required subscription
exports.requireSubscription = (...plans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const userSubscription =
      req.user.subscription || req.user.subscriptionDetails?.planId;

    if (!plans.includes(userSubscription)) {
      return res.status(403).json({
        success: false,
        message: "This feature requires a higher subscription plan",
        requiredPlans: plans,
        currentPlan: userSubscription,
      });
    }

    next();
  };
};

// Check subscription status (active or not)
exports.requireActiveSubscription = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  const subscriptionDetails = req.user.subscriptionDetails;

  if (
    !subscriptionDetails ||
    !subscriptionDetails.status ||
    subscriptionDetails.status !== "active"
  ) {
    return res.status(403).json({
      success: false,
      message: "This feature requires an active subscription",
      subscriptionStatus: subscriptionDetails?.status || "none",
    });
  }

  // Check if subscription has expired
  if (
    subscriptionDetails.endDate &&
    new Date(subscriptionDetails.endDate) < new Date()
  ) {
    return res.status(403).json({
      success: false,
      message: "Your subscription has expired. Please renew to continue",
      expiredOn: subscriptionDetails.endDate,
    });
  }

  next();
};

// Combined middleware: check both role and subscription
exports.authorizeWithSubscription = (roles = [], subscriptions = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Check role
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized`,
      });
    }

    // Check subscription
    const userSubscription =
      req.user.subscription || req.user.subscriptionDetails?.planId;
    if (subscriptions.length > 0 && !subscriptions.includes(userSubscription)) {
      return res.status(403).json({
        success: false,
        message: "This feature requires a specific subscription plan",
        requiredPlans: subscriptions,
        currentPlan: userSubscription,
      });
    }

    next();
  };
};
