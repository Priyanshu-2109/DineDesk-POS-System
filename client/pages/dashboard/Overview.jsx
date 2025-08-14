import React from "react";

const Overview = () => {
  return (
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

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Welcome to DineDesk
          </h3>
          <p className="text-gray-600">
            Select a section from the sidebar to get started
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
