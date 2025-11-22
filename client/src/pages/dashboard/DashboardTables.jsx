import React, { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const DashboardTables = () => {
  const { tables, addTable, removeTable } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [newTableData, setNewTableData] = useState({
    number: "",
    capacity: 4,
  });
  const [errors, setErrors] = useState({});

  const validateTableData = () => {
    const newErrors = {};

    if (!newTableData.number.trim()) {
      newErrors.number = "Table number/name is required";
    } else if (
      tables.some(
        (table) =>
          table.name.toLowerCase() === newTableData.number.toLowerCase()
      )
    ) {
      newErrors.number = "Table with this name already exists";
    }

    if (!newTableData.capacity || newTableData.capacity < 1) {
      newErrors.capacity = "Capacity must be at least 1 seat";
    } else if (newTableData.capacity > 20) {
      newErrors.capacity = "Capacity cannot exceed 20 seats";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTable = async () => {
    if (validateTableData()) {
      const promise = addTable(
        newTableData.number,
        parseInt(newTableData.capacity)
      );
      setNewTableData({ number: "", capacity: 4 });
      setErrors({});
      setShowAddModal(false);

      toast.promise(promise, {
        loading: "Adding table...",
        success: `Table ${newTableData.number} added successfully!`,
        error: (err) => err?.message || "Failed to add table",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (tableToDelete) {
      const promise = removeTable(tableToDelete.id);
      const tableName = tableToDelete.name;
      setTableToDelete(null);
      setShowDeleteModal(false);

      toast.promise(promise, {
        loading: "Deleting table...",
        success: `Table ${tableName} deleted successfully!`,
        error: (err) => err?.message || "Failed to delete table",
      });
    }
  };

  const openDeleteModal = (table) => {
    setTableToDelete(table);
    setShowDeleteModal(true);
  };

  const toggleTableStatus = (tableId) => {
    // This function can be implemented to change table occupancy status
    // For now, we'll keep it simple
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#3b1a0b]">Tables</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center justify-center gap-2 transition-colors focus:outline-none w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Table
        </button>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Users className="h-20 w-20 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No Tables Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Get started by adding your first table to manage your restaurant
            seating
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Table
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {table.name}
                </h3>
                <Users className="h-5 w-5 text-gray-600" />
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <span>{table.seats} seats</span>
              </div>

              <div
                className={`mb-3 px-2 py-1 rounded text-sm font-medium ${
                  table.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {table.status === "available" ? "Available" : "Occupied"}
              </div>

              <button
                onClick={() => openDeleteModal(table)}
                disabled={table.status === "occupied"}
                className={`w-full py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none ${
                  table.status === "occupied"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                title={
                  table.status === "occupied"
                    ? "Cannot delete occupied table"
                    : "Delete table"
                }
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Table Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setErrors({});
          setNewTableData({ number: "", capacity: 4 });
        }}
        title="Add New Table"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Number/Name
            </label>
            <Input
              type="text"
              value={newTableData.number}
              onChange={(e) => {
                setNewTableData({ ...newTableData, number: e.target.value });
                if (errors.number) {
                  setErrors({ ...errors, number: "" });
                }
              }}
              placeholder="e.g., 1, A1, VIP-1"
              className={`w-full ${
                errors.number
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {errors.number && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">•</span>
                {errors.number}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (Number of Seats)
            </label>
            <Input
              type="number"
              value={newTableData.capacity}
              onChange={(e) => {
                setNewTableData({ ...newTableData, capacity: e.target.value });
                if (errors.capacity) {
                  setErrors({ ...errors, capacity: "" });
                }
              }}
              min="1"
              max="20"
              className={`w-full ${
                errors.capacity
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">•</span>
                {errors.capacity}
              </p>
            )}
          </div>
        </div>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false);
              setErrors({});
              setNewTableData({ number: "", capacity: 4 });
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddTable}>Add Table</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Table {tableToDelete?.name}?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone. The table will be permanently removed
            from your restaurant.
          </p>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Delete Table
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardTables;
