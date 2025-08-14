import React, { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  Utensils,
  BarChart3,
  Settings,
  Menu as MenuIcon,
  X,
  Home,
  LogOut,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/dashboard" },
    { id: "tables", label: "Tables", icon: Users, path: "/dashboard/tables" },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      path: "/dashboard/orders",
    },
    { id: "menu", label: "Menu", icon: Utensils, path: "/dashboard/menu" },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/dashboard/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
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
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#cc6600] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent
                      className={`${sidebarOpen ? "h-5 w-5" : "h-6 w-6"}`}
                    />
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  </Link>
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
            <LogOut className={`${sidebarOpen ? "h-5 w-5" : "h-6 w-6"}`} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
