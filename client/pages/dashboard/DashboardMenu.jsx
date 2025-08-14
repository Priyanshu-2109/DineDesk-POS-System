import React, { useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";

const DashboardMenu = () => {
  const [menuItems, setMenuItems] = useState([
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
    { id: 5, name: "Naan", category: "Bread", price: 50, available: true },
    {
      id: 6,
      name: "Rice",
      category: "Main Course",
      price: 80,
      available: true,
    },
  ]);

  const toggleAvailability = (itemId) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  const deleteItem = (itemId) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Menu</h2>
        <button className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </button>
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
              {menuItems.map((item) => (
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
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.available ? "Available" : "Out of Stock"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
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
};

export default DashboardMenu;
