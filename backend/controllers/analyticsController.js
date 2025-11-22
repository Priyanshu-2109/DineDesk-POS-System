const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Table = require("../models/Table");
const User = require("../models/User");

// Get dashboard overview analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { period = "7d" } = req.query; // 7d, 30d, 90d, 1y

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Base query - owners see their restaurant, managers/staff see assigned restaurant
    const baseQuery = { owner: userId };

    // Get total revenue
    const revenueData = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          orderCount: { $sum: 1 },
          averageOrder: { $avg: "$total" },
        },
      },
    ]);

    // Get previous period for comparison
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(
      previousStartDate.getDate() - (now - startDate) / (1000 * 60 * 60 * 24)
    );

    const previousRevenueData = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: previousStartDate, $lt: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const currentRevenue = revenueData[0]?.totalRevenue || 0;
    const previousRevenue = previousRevenueData[0]?.totalRevenue || 0;
    const revenueGrowth =
      previousRevenue > 0
        ? (
            ((currentRevenue - previousRevenue) / previousRevenue) *
            100
          ).toFixed(2)
        : 0;

    // Get order statistics
    const totalOrders = revenueData[0]?.orderCount || 0;
    const averageOrderValue = revenueData[0]?.averageOrder || 0;

    // Get top selling items
    const topItems = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          itemName: { $first: "$items.item_name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    // Get daily revenue for chart
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get table performance
    const tablePerformance = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $lookup: {
          from: "tables",
          localField: "table",
          foreignField: "_id",
          as: "tableInfo",
        },
      },
      { $unwind: "$tableInfo" },
      {
        $group: {
          _id: "$table",
          tableName: { $first: "$tableInfo.name" },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    // Get peak hours
    const peakHours = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          orderCount: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get category breakdown
    const categoryBreakdown = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "menuitems",
          localField: "items.menuItem",
          foreignField: "_id",
          as: "menuItemInfo",
        },
      },
      { $unwind: "$menuItemInfo" },
      {
        $group: {
          _id: "$menuItemInfo.category",
          totalRevenue: { $sum: "$items.subtotal" },
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // Response based on user role
    const analytics = {
      overview: {
        totalRevenue: currentRevenue,
        revenueGrowth: parseFloat(revenueGrowth),
        totalOrders,
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      },
      topSellingItems: topItems,
      dailyRevenue,
      tablePerformance,
      peakHours,
      categoryBreakdown,
      period,
    };

    // Admin gets additional system-wide metrics
    if (userRole === "admin") {
      const systemMetrics = await User.aggregate([
        {
          $group: {
            _id: "$subscription",
            count: { $sum: 1 },
          },
        },
      ]);
      analytics.systemMetrics = systemMetrics;
    }

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: error.message,
    });
  }
};

// Get sales report
exports.getSalesReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, groupBy = "day" } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const baseQuery = { owner: userId };

    let groupFormat;
    switch (groupBy) {
      case "hour":
        groupFormat = "%Y-%m-%d %H:00";
        break;
      case "day":
        groupFormat = "%Y-%m-%d";
        break;
      case "week":
        groupFormat = "%Y-W%V";
        break;
      case "month":
        groupFormat = "%Y-%m";
        break;
      default:
        groupFormat = "%Y-%m-%d";
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          totalRevenue: { $sum: "$total" },
          orderCount: { $sum: 1 },
          averageOrder: { $avg: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesData,
        period: { start, end },
        groupBy,
      },
    });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales report",
      error: error.message,
    });
  }
};

// Get menu performance
exports.getMenuPerformance = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = "30d" } = req.query;

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const baseQuery = { owner: userId };

    const menuPerformance = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "menuitems",
          localField: "items.menuItem",
          foreignField: "_id",
          as: "menuItemInfo",
        },
      },
      { $unwind: "$menuItemInfo" },
      {
        $group: {
          _id: "$items.menuItem",
          itemName: { $first: "$items.item_name" },
          category: { $first: "$menuItemInfo.category" },
          price: { $first: "$items.price" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          averageQuantityPerOrder: {
            $divide: ["$totalQuantitySold", "$orderCount"],
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // Get items not sold
    const soldItemIds = menuPerformance.map((item) => item._id);
    const notSoldItems = await MenuItem.find({
      owner: userId,
      _id: { $nin: soldItemIds },
    }).select("item_name category price");

    res.status(200).json({
      success: true,
      data: {
        soldItems: menuPerformance,
        notSoldItems,
        period,
      },
    });
  } catch (error) {
    console.error("Error fetching menu performance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu performance",
      error: error.message,
    });
  }
};

// Get customer insights (for professional/enterprise plans)
exports.getCustomerInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const userSubscription = req.user.subscription;

    // Feature available for professional and enterprise only
    if (!["professional", "enterprise"].includes(userSubscription)) {
      return res.status(403).json({
        success: false,
        message:
          "This feature is only available for Professional and Enterprise plans",
      });
    }

    const { period = "30d" } = req.query;
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const baseQuery = { owner: userId };

    // Get repeat customer patterns
    const customerPatterns = await Order.aggregate([
      {
        $match: {
          ...baseQuery,
          status: "completed",
          createdAt: { $gte: startDate },
          customerEmail: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$customerEmail",
          visitCount: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          averageSpent: { $avg: "$total" },
          lastVisit: { $max: "$createdAt" },
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);

    // Calculate customer metrics
    const totalCustomers = customerPatterns.length;
    const repeatCustomers = customerPatterns.filter(
      (c) => c.visitCount > 1
    ).length;
    const repeatRate =
      totalCustomers > 0
        ? ((repeatCustomers / totalCustomers) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        customerPatterns,
        metrics: {
          totalCustomers,
          repeatCustomers,
          repeatRate: parseFloat(repeatRate),
        },
        period,
      },
    });
  } catch (error) {
    console.error("Error fetching customer insights:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer insights",
      error: error.message,
    });
  }
};

// Export data (CSV format for reports)
exports.exportAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = "sales", startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const baseQuery = { owner: userId };

    let data = [];
    let headers = [];

    if (type === "sales") {
      const orders = await Order.find({
        ...baseQuery,
        status: "completed",
        createdAt: { $gte: start, $lte: end },
      })
        .populate("table", "name")
        .sort({ createdAt: -1 });

      headers = [
        "Order Number",
        "Date",
        "Table",
        "Total Amount",
        "Payment Method",
        "Status",
      ];
      data = orders.map((order) => [
        order.orderNumber,
        new Date(order.createdAt).toLocaleDateString(),
        order.table?.name || "N/A",
        order.total,
        order.paymentMethod || "N/A",
        order.status,
      ]);
    }

    // Convert to CSV
    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=analytics-${type}-${Date.now()}.csv`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    console.error("Error exporting analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export analytics",
      error: error.message,
    });
  }
};
