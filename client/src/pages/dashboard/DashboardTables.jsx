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

  const handleAddTable = () => {
    if (newTableData.number) {
      addTable(newTableData.number, parseInt(newTableData.capacity));
      setNewTableData({ number: "", capacity: 4 });
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
            className={`p-6 rounded-xl border-2 transition-all ${
              table.status === "available"
                ? "bg-green-50 border-green-200 hover:border-green-300"
                : "bg-red-50 border-red-200 hover:border-red-300"
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#3b1a0b]">{table.name}</h3>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-3">
                <Users className="h-4 w-4" />
                <span>{table.seats} seats</span>
              </div>

              <div
                className={`mb-4 px-3 py-1 rounded-full text-xs font-medium ${
                  table.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {table.status === "available" ? "Available" : "Occupied"}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => toggleTableStatus(table.id)}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    table.status === "available"
                      ? "bg-[#cc6600] text-white hover:bg-[#b35500]"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {table.status === "available" ? "Use Table" : "Free Table"}
                </button>

                <button
                  onClick={() => openDeleteModal(table)}
                  className="w-full py-2 px-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
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
              onChange={(e) =>
                setNewTableData({ ...newTableData, number: e.target.value })
              }
              placeholder="e.g., 1, A1, VIP-1"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (Number of Seats)
            </label>
            <Input
              type="number"
              value={newTableData.capacity}
              onChange={(e) =>
                setNewTableData({ ...newTableData, capacity: e.target.value })
              }
              min="1"
              max="20"
              className="w-full"
            />
          </div>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddTable} disabled={!newTableData.number}>
            Add Table
          </Button>
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
