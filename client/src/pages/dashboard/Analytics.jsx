import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Award,
  Download,
  Calendar,
  Clock,
  PieChart,
  Activity,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Analytics = () => {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/analytics/dashboard?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/export?type=sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${Date.now()}.csv`;
        a.click();
      }
    } catch (error) {
      console.error("Failed to export analytics:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Analytics</h2>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc6600]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">
          Analytics Dashboard
        </h2>
        <div className="flex gap-3">
          {/* Period Selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>

          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "overview"
              ? "text-[#cc6600] border-b-2 border-[#cc6600]"
              : "text-gray-600 hover:text-[#cc6600]"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "sales"
              ? "text-[#cc6600] border-b-2 border-[#cc6600]"
              : "text-gray-600 hover:text-[#cc6600]"
          }`}
        >
          Sales
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "menu"
              ? "text-[#cc6600] border-b-2 border-[#cc6600]"
              : "text-gray-600 hover:text-[#cc6600]"
          }`}
        >
          Menu Performance
        </button>
        {["professional", "enterprise"].includes(user?.subscription) && (
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "customers"
                ? "text-[#cc6600] border-b-2 border-[#cc6600]"
                : "text-gray-600 hover:text-[#cc6600]"
            }`}
          >
            Customer Insights
          </button>
        )}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && analytics && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                {analytics.overview.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.overview.totalRevenue)}
              </p>
              <p
                className={`text-sm mt-2 ${
                  analytics.overview.revenueGrowth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {analytics.overview.revenueGrowth >= 0 ? "+" : ""}
                {analytics.overview.revenueGrowth}% from last period
              </p>
            </Card>

            {/* Total Orders */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.overview.totalOrders}
              </p>
              <p className="text-sm text-gray-600 mt-2">Orders completed</p>
            </Card>

            {/* Average Order Value */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.overview.averageOrderValue)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Per order</p>
            </Card>

            {/* Best Seller */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Award className="h-6 w-6 text-[#cc6600]" />
                </div>
                <TrendingUp className="h-5 w-5 text-[#cc6600]" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Top Selling Item</p>
              <p className="text-lg font-bold text-gray-900 truncate">
                {analytics.topSellingItems[0]?.itemName || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {analytics.topSellingItems[0]?.totalQuantity || 0} sold
              </p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Revenue Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#cc6600]" />
                Daily Revenue Trend
              </h3>
              <div className="h-64">
                {analytics.dailyRevenue && analytics.dailyRevenue.length > 0 ? (
                  <div className="flex items-end justify-between h-full gap-2">
                    {analytics.dailyRevenue.map((day, index) => {
                      const maxRevenue = Math.max(
                        ...analytics.dailyRevenue.map((d) => d.revenue)
                      );
                      const height = (day.revenue / maxRevenue) * 100;

                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div className="w-full flex flex-col justify-end items-center h-48">
                            <div
                              className="w-full bg-[#cc6600] rounded-t hover:bg-[#b35500] transition-colors cursor-pointer relative group"
                              style={{ height: `${height}%`, minHeight: "4px" }}
                              title={`${formatCurrency(day.revenue)}`}
                            >
                              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {formatCurrency(day.revenue)}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 transform -rotate-45 origin-top-left mt-2">
                            {new Date(day._id).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </Card>

            {/* Peak Hours Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#cc6600]" />
                Peak Hours
              </h3>
              <div className="h-64">
                {analytics.peakHours && analytics.peakHours.length > 0 ? (
                  <div className="flex items-end justify-between h-full gap-1">
                    {analytics.peakHours.map((hour, index) => {
                      const maxOrders = Math.max(
                        ...analytics.peakHours.map((h) => h.orderCount)
                      );
                      const height = (hour.orderCount / maxOrders) * 100;

                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div className="w-full flex flex-col justify-end items-center h-48">
                            <div
                              className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                              style={{ height: `${height}%`, minHeight: "4px" }}
                              title={`${hour.orderCount} orders`}
                            >
                              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {hour.orderCount} orders
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">{hour._id}:00</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Items */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Selling Items
              </h3>
              <div className="space-y-3">
                {analytics.topSellingItems &&
                analytics.topSellingItems.length > 0 ? (
                  analytics.topSellingItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#cc6600] text-white rounded-full font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.itemName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.totalQuantity} sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No items sold yet
                  </p>
                )}
              </div>
            </Card>

            {/* Table Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Table Performance
              </h3>
              <div className="space-y-3">
                {analytics.tablePerformance &&
                analytics.tablePerformance.length > 0 ? (
                  analytics.tablePerformance.slice(0, 5).map((table, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold">
                          {table.tableName}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Table {table.tableName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {table.totalOrders} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(table.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No table data yet
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Category Breakdown */}
          {analytics.categoryBreakdown &&
            analytics.categoryBreakdown.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[#cc6600]" />
                  Category Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analytics.categoryBreakdown.map((category, index) => {
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                      "bg-orange-500",
                      "bg-pink-500",
                      "bg-indigo-500",
                    ];
                    return (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div
                          className={`w-12 h-12 ${
                            colors[index % colors.length]
                          } rounded-lg mb-3 flex items-center justify-center text-white font-bold`}
                        >
                          {category._id
                            ? category._id.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <p className="font-medium text-gray-900 mb-1">
                          {category._id || "Other"}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {formatCurrency(category.totalRevenue)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {category.totalQuantity} items sold
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="text-center py-20">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Detailed Sales Report
          </h3>
          <p className="text-gray-500 mb-4">
            Advanced sales analytics coming soon
          </p>
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === "menu" && (
        <div className="text-center py-20">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Menu Performance Analysis
          </h3>
          <p className="text-gray-500 mb-4">
            Detailed menu insights coming soon
          </p>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <div className="text-center py-20">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Customer Insights
          </h3>
          <p className="text-gray-500 mb-4">
            Customer analytics for Professional & Enterprise plans
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
