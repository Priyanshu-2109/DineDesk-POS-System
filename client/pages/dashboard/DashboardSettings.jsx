import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

const DashboardSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3b1a0b]">Settings</h2>

      <div className="text-center py-20">
        <SettingsIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Restaurant Settings
        </h3>
        <p className="text-gray-500">
          Configuration and settings panel coming soon...
        </p>
      </div>
    </div>
  );
};

export default DashboardSettings;
