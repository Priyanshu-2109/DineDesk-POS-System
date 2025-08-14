import React from "react";
import { BarChart3 } from "lucide-react";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3b1a0b]">Analytics</h2>

      <div className="text-center py-20">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Analytics Dashboard
        </h3>
        <p className="text-gray-500">
          Detailed analytics and reports coming soon...
        </p>
      </div>
    </div>
  );
};

export default Analytics;
