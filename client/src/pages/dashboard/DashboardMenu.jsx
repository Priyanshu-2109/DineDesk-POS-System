import React, { useState } from "react";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const DashboardMenu = () => {
  const { menu, addMenuItem } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItemData, setNewItemData] = useState({
    name: "",
    category: "",
    price: "",
  });

  const handleAddItem = () => {
    if (newItemData.name && newItemData.category && newItemData.price) {
      addMenuItem({
        name: newItemData.name,
        category: newItemData.category,
        price: parseInt(newItemData.price),
        available: true,
      });
      setNewItemData({ name: "", category: "", price: "" });
      setShowAddModal(false);
    }
  };

  const filteredMenu = menu.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Menu</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
        />
      </div>

      {menu.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Search className="h-20 w-20 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No Menu Items Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start building your menu by adding your first item
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Item
          </Button>
        </div>
      ) : (
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMenu.map((item) => (
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
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMenu.length === 0 && menu.length > 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No menu items found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Menu Item"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name
            </label>
            <Input
              type="text"
              value={newItemData.name}
              onChange={(e) =>
                setNewItemData({ ...newItemData, name: e.target.value })
              }
              placeholder="e.g., Butter Chicken"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Input
              type="text"
              value={newItemData.category}
              onChange={(e) =>
                setNewItemData({ ...newItemData, category: e.target.value })
              }
              placeholder="e.g., Main Course, Starter, Dessert"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹)
            </label>
            <Input
              type="number"
              value={newItemData.price}
              onChange={(e) =>
                setNewItemData({ ...newItemData, price: e.target.value })
              }
              placeholder="0"
              min="1"
              className="w-full"
            />
          </div>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddItem}
            disabled={
              !newItemData.name || !newItemData.category || !newItemData.price
            }
          >
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardMenu;
