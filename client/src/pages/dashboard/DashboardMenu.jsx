import React, { useState } from "react";
import { Plus, Edit3, Trash2, Search, FolderPlus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const DashboardMenu = () => {
  const { menu, addMenuItem, updateMenuItem, removeMenuItem } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([
    "Starters",
    "Main Course",
    "Desserts",
    "Beverages",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [newItemData, setNewItemData] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [editItemData, setEditItemData] = useState({
    name: "",
    category: "",
    price: "",
  });

  const handleToggleAvailability = async (itemId) => {
    const item = menu.find((m) => m.id === itemId || m._id === itemId);
    if (!item) return;

    const updatedAvailability = !item.available;

    toast.promise(
      updateMenuItem(itemId, { isAvailable: updatedAvailability }),
      {
        loading: "Updating availability...",
        success: `${item.name} marked as ${
          updatedAvailability ? "Available" : "Out of Stock"
        }`,
        error: (err) => err.message || "Failed to update availability",
      }
    );
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      toast.success(`Category "${newCategory.trim()}" added`);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
    toast.success(`Category "${category}" removed`);
  };

  const handleAddItem = async () => {
    if (newItemData.name && newItemData.category && newItemData.price) {
      toast.promise(
        addMenuItem({
          name: newItemData.name,
          category: newItemData.category,
          price: parseInt(newItemData.price),
          available: true,
        }),
        {
          loading: "Adding menu item...",
          success: `${newItemData.name} added to menu`,
          error: (err) => err.message || "Failed to add menu item",
        }
      );
      setNewItemData({ name: "", category: "", price: "" });
      setShowAddModal(false);
    }
  };

  const handleEditItem = async () => {
    if (!selectedItem || !editItemData.name || !editItemData.category || !editItemData.price) {
      return;
    }

    toast.promise(
      updateMenuItem(selectedItem.id || selectedItem._id, {
        name: editItemData.name,
        category: editItemData.category,
        price: parseInt(editItemData.price),
      }),
      {
        loading: "Updating menu item...",
        success: `${editItemData.name} updated successfully`,
        error: (err) => err.message || "Failed to update menu item",
      }
    );
    setEditItemData({ name: "", category: "", price: "" });
    setSelectedItem(null);
    setShowEditModal(false);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    toast.promise(
      removeMenuItem(selectedItem.id || selectedItem._id),
      {
        loading: "Deleting menu item...",
        success: `${selectedItem.name} deleted successfully`,
        error: (err) => err.message || "Failed to delete menu item",
      }
    );
    setSelectedItem(null);
    setShowDeleteModal(false);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditItemData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const filteredMenu = menu.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#3b1a0b]">Menu</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Categories</span>
            <span className="sm:hidden">Categories</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
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
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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
                      <button
                        onClick={() =>
                          handleToggleAvailability(item.id || item._id)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          item.available
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {item.available ? "Available" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
                          title="Edit item"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                          title="Delete item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMenu.length === 0 && menu.length > 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No menu items found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredMenu.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#3b1a0b] text-base mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <span className="font-bold text-[#cc6600] text-lg ml-2">
                    ₹{item.price}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleToggleAvailability(item.id || item._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      item.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.available ? "Available" : "Out of Stock"}
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredMenu.length === 0 && menu.length > 0 && (
              <div className="p-8 text-center text-gray-500">
                No menu items found matching your search.
              </div>
            )}
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
            <select
              value={newItemData.category}
              onChange={(e) =>
                setNewItemData({ ...newItemData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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

      {/* Category Management Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Manage Categories"
        size="md"
      >
        <div className="space-y-4" style={{ maxHeight: "500px" }}>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Existing Categories:
            </p>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No categories yet. Add your first category above.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {categories.map((category) => {
                  const itemCount = menu.filter(
                    (item) => item.category === category
                  ).length;
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">
                          {category}
                        </span>
                        <span className="bg-[#cc6600] text-white text-xs px-2 py-1 rounded-full">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <Modal.Footer>
          <Button onClick={() => setShowCategoryModal(false)}>Done</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
          setEditItemData({ name: "", category: "", price: "" });
        }}
        title="Edit Menu Item"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name
            </label>
            <Input
              type="text"
              value={editItemData.name}
              onChange={(e) =>
                setEditItemData({ ...editItemData, name: e.target.value })
              }
              placeholder="e.g., Butter Chicken"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={editItemData.category}
              onChange={(e) =>
                setEditItemData({ ...editItemData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹)
            </label>
            <Input
              type="number"
              value={editItemData.price}
              onChange={(e) =>
                setEditItemData({ ...editItemData, price: e.target.value })
              }
              placeholder="0"
              min="1"
              className="w-full"
            />
          </div>
        </div>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowEditModal(false);
              setSelectedItem(null);
              setEditItemData({ name: "", category: "", price: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditItem}
            disabled={
              !editItemData.name || !editItemData.category || !editItemData.price
            }
          >
            Update Item
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        title="Delete Menu Item"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{selectedItem?.name}</strong>?
            This action cannot be undone.
          </p>
        </div>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedItem(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteItem}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardMenu;
