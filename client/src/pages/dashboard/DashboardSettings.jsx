import React, { useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useApp } from "../../context/AppContext";

const DashboardSettings = () => {
  const { restaurant, updateRestaurantName } = useApp();
  const [name, setName] = useState(restaurant.name);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateRestaurantName(name);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3b1a0b]">Settings</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="h-6 w-6 text-[#cc6600]" />
          <h3 className="text-lg font-medium text-gray-900">
            Restaurant Information
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name
            </label>
            {isEditing ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
                  placeholder="Enter restaurant name"
                />
                <button
                  onClick={handleSave}
                  className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setName(restaurant.name);
                    setIsEditing(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">
                  {restaurant.name || "Not set"}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[#cc6600] hover:text-[#b35500] font-medium"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center py-10">
          <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            More Settings Coming Soon
          </h3>
          <p className="text-gray-500">
            Additional configuration options will be available here
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
