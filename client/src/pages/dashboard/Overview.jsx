import React from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const { restaurant } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">
          {restaurant.name || "Restaurant Overview"}
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

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {restaurant.name
              ? `Welcome to ${restaurant.name}`
              : "Welcome to DineDesk"}
          </h3>
          <p className="text-gray-600 mb-4">
            {restaurant.name
              ? "Select a section from the sidebar to get started"
              : "Please set up your restaurant name in settings to get started"}
          </p>
          {!restaurant.name && (
            <button
              onClick={() => navigate("settings")}
              className="bg-[#cc6600] text-white px-6 py-2 rounded-lg hover:bg-[#b35500] transition-colors font-medium"
            >
              Go to Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
