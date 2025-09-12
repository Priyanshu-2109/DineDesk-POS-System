import React, { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
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

  const handleAddTable = () => {
    if (validateTableData()) {
      addTable(newTableData.number, parseInt(newTableData.capacity));
      setNewTableData({ number: "", capacity: 4 });
      setErrors({});
      setShowAddModal(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (tableToDelete) {
      removeTable(tableToDelete.id);
      setTableToDelete(null);
      setShowDeleteModal(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Tables</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              className="w-full py-2 px-3 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        ))}
      </div>

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
