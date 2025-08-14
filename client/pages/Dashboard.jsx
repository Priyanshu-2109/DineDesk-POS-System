import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  Utensils,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Clock,
  DollarSign,
  Menu as MenuIcon,
  X,
  Home,
  LogOut,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "tables", label: "Tables", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "menu", label: "Menu", icon: Utensils },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Mock data for demonstration
  const mockTables = [
    { id: 1, number: 1, capacity: 4, status: "available", currentOrder: null },
    {
      id: 2,
      number: 2,
      capacity: 2,
      status: "occupied",
      currentOrder: "ORD-001",
    },
    { id: 3, number: 3, capacity: 6, status: "reserved", currentOrder: null },
    { id: 4, number: 4, capacity: 4, status: "available", currentOrder: null },
    {
      id: 5,
      number: 5,
      capacity: 8,
      status: "occupied",
      currentOrder: "ORD-002",
    },
    { id: 6, number: 6, capacity: 2, status: "cleaning", currentOrder: null },
  ];

  const mockOrders = [
    {
      id: "ORD-001",
      table: 2,
      items: ["Butter Chicken", "Naan"],
      amount: 850,
      status: "preparing",
      time: "10:30 AM",
    },
    {
      id: "ORD-002",
      table: 5,
      items: ["Dal Makhani", "Rice", "Coke"],
      amount: 650,
      status: "ready",
      time: "10:45 AM",
    },
    {
      id: "ORD-003",
      table: 3,
      items: ["Paneer Tikka", "Roti"],
      amount: 450,
      status: "delivered",
      time: "11:00 AM",
    },
    {
      id: "ORD-004",
      table: 1,
      items: ["Biryani", "Raita"],
      amount: 580,
      status: "preparing",
      time: "11:15 AM",
    },
  ];

  const mockMenu = [
    {
      id: 1,
      name: "Butter Chicken",
      category: "Main Course",
      price: 320,
      available: true,
    },
    {
      id: 2,
      name: "Dal Makhani",
      category: "Main Course",
      price: 180,
      available: true,
    },
    {
      id: 3,
      name: "Paneer Tikka",
      category: "Starter",
      price: 250,
      available: true,
    },
    {
      id: 4,
      name: "Biryani",
      category: "Main Course",
      price: 280,
      available: false,
    },
    {
      id: 5,
      name: "Gulab Jamun",
      category: "Dessert",
      price: 120,
      available: true,
    },
    {
      id: 6,
      name: "Masala Chai",
      category: "Beverage",
      price: 50,
      available: true,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">
          Restaurant Overview
        </h2>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-[#3b1a0b]">₹12,450</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Tables</p>
              <p className="text-2xl font-bold text-[#3b1a0b]">
                {mockTables.filter((t) => t.status === "occupied").length}/
                {mockTables.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Orders Today</p>
              <p className="text-2xl font-bold text-[#3b1a0b]">
                {mockOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Service Time</p>
              <p className="text-2xl font-bold text-[#3b1a0b]">12 min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#3b1a0b] mb-4">
            Table Status
          </h3>
          <div className="space-y-3">
            {mockTables.slice(0, 4).map((table) => (
              <div key={table.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Table {table.number}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    table.status === "available"
                      ? "bg-green-100 text-green-800"
                      : table.status === "occupied"
                      ? "bg-red-100 text-red-800"
                      : table.status === "reserved"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {table.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveSection("tables")}
            className="w-full mt-4 text-[#cc6600] text-sm font-medium hover:text-[#b35500]"
          >
            View All Tables →
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#3b1a0b] mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {mockOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {order.id}
                  </span>
                  <p className="text-xs text-gray-600">Table {order.table}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "preparing"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "ready"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveSection("orders")}
            className="w-full mt-4 text-[#cc6600] text-sm font-medium hover:text-[#b35500]"
          >
            View All Orders →
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#3b1a0b] mb-4">
            Menu Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available Items</span>
              <span className="font-medium">
                {mockMenu.filter((item) => item.available).length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Out of Stock</span>
              <span className="font-medium">
                {mockMenu.filter((item) => !item.available).length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium">{mockMenu.length}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveSection("menu")}
            className="w-full mt-4 text-[#cc6600] text-sm font-medium hover:text-[#b35500]"
          >
            Manage Menu →
          </button>
        </div>
      </div>
    </div>
  );

  const renderTables = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Table Management</h2>
        <button className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockTables.map((table) => (
          <div
            key={table.id}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
              table.status === "available"
                ? "bg-green-50 border-green-200 hover:border-green-300"
                : table.status === "occupied"
                ? "bg-red-50 border-red-200 hover:border-red-300"
                : table.status === "reserved"
                ? "bg-yellow-50 border-yellow-200 hover:border-yellow-300"
                : "bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#3b1a0b]">
                Table {table.number}
              </h3>
              <p className="text-sm text-gray-600">{table.capacity} seats</p>
              <div
                className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  table.status === "available"
                    ? "bg-green-100 text-green-800"
                    : table.status === "occupied"
                    ? "bg-red-100 text-red-800"
                    : table.status === "reserved"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
              </div>
              {table.currentOrder && (
                <p className="text-xs text-gray-600 mt-2">
                  Order: {table.currentOrder}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-[#cc6600] text-white py-2 px-3 rounded-lg text-xs hover:bg-[#b35500]">
                  {table.status === "available" ? "Reserve" : "View"}
                </button>
                <button className="p-2 text-gray-500 hover:text-[#cc6600]">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Order Management</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Order ID
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Table
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Items
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Amount
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Time
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-[#3b1a0b]">{order.id}</td>
                  <td className="p-4 text-gray-600">Table {order.table}</td>
                  <td className="p-4 text-gray-600">
                    {order.items.join(", ")}
                  </td>
                  <td className="p-4 font-medium text-[#3b1a0b]">
                    ₹{order.amount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "preparing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{order.time}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Menu Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
            />
          </div>
          <button className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Item Name
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Category
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Price
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockMenu.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-[#3b1a0b]">
                    {item.name}
                  </td>
                  <td className="p-4 text-gray-600">{item.category}</td>
                  <td className="p-4 font-medium text-[#3b1a0b]">
                    ₹{item.price}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.available ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "tables":
        return renderTables();
      case "orders":
        return renderOrders();
      case "menu":
        return renderMenu();
      case "analytics":
        return (
          <div className="text-center py-20">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-gray-500">
              Detailed analytics and reports coming soon...
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-20">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Restaurant Settings
            </h3>
            <p className="text-gray-500">
              Configuration and settings panel coming soon...
            </p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <Link to="/" className="text-xl font-bold text-[#3b1a0b]">
                DineDesk
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#cc6600] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-[#3b1a0b]">
                {user?.name || "Restaurant Owner"}
              </p>
              <p className="text-xs text-gray-600">Administrator</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
