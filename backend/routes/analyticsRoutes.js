const express = require("express");
const {
  getDashboardAnalytics,
  getSalesReport,
  getMenuPerformance,
  getCustomerInsights,
  exportAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Analytics routes
router.get("/dashboard", getDashboardAnalytics);
router.get("/sales-report", getSalesReport);
router.get("/menu-performance", getMenuPerformance);
router.get("/customer-insights", getCustomerInsights); // Professional/Enterprise only
router.get("/export", exportAnalytics);

module.exports = router;
