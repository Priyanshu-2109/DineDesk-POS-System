import React, { useState } from "react";
import {
  Plus,
  Edit,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import { Button, Card, Input } from "../components/ui";
import { useApp } from "../context/AppContext";
 
const Tables = () => {
  const { tables, updateTable } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTable, setNewTable] = useState({
    number: "",
    capacity: 2,
    location: "Main Floor",
  });

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.number.toString().includes(searchTerm) ||
      table.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || table.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100";
      case "occupied":
        return "text-red-600 bg-red-100";
      case "reserved":
        return "text-yellow-600 bg-yellow-100";
      case "cleaning":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-5 w-5" />;
      case "occupied":
        return <Users className="h-5 w-5" />;
      case "reserved":
        return <Clock className="h-5 w-5" />;
      case "cleaning":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const handleStatusChange = (tableId, newStatus) => {
    updateTable(tableId, { status: newStatus });
  };

  const handleAddTable = () => {
    if (newTable.number && newTable.capacity) {
      const table = {
        id: Date.now().toString(),
        number: newTable.number,
        capacity: parseInt(newTable.capacity),
        location: newTable.location,
        status: "available",
        currentOrder: null,
        lastCleaned: new Date().toISOString(),
      };
      // In a real app, this would call an API
      setNewTable({ number: "", capacity: 2, location: "Main Floor" });
      setShowAddTable(false);
    }
  };

  const statusOptions = [
    { value: "available", label: "Available", color: "bg-green-500" },
    { value: "occupied", label: "Occupied", color: "bg-red-500" },
    { value: "reserved", label: "Reserved", color: "bg-yellow-500" },
    { value: "cleaning", label: "Cleaning", color: "bg-blue-500" },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-[#ffe8db] to-[#fff4ef] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3b1a0b] mb-2">
              Tables Management
            </h1>
            <p className="text-gray-600">
              Manage your restaurant tables and track their status
            </p>
          </div>
          <Button
            onClick={() => setShowAddTable(true)}
            className="bg-[#cc6600] hover:bg-[#b35500] text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Table
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-semibold text-[#3b1a0b]">
                  {tables.filter((t) => t.status === "available").length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-semibold text-[#3b1a0b]">
                  {tables.filter((t) => t.status === "occupied").length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reserved</p>
                <p className="text-2xl font-semibold text-[#3b1a0b]">
                  {tables.filter((t) => t.status === "reserved").length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-[#cc6600]/10 rounded-full">
                <Users className="h-6 w-6 text-[#cc6600]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Tables
                </p>
                <p className="text-2xl font-semibold text-[#3b1a0b]">
                  {tables.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tables by number or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-5 w-5" />}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTables.map((table) => (
            <Card
              key={table.id}
              className="transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#3b1a0b]">
                  Table {table.number}
                </h3>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{table.capacity} people</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{table.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(
                      table.status
                    )}`}
                  >
                    {getStatusIcon(table.status)}
                    <span className="capitalize">{table.status}</span>
                  </div>
                </div>

                {table.currentOrder && (
                  <div className="mt-4 p-3 bg-[#cc6600]/10 rounded-lg">
                    <p className="text-sm font-medium text-[#3b1a0b]">
                      Current Order
                    </p>
                    <p className="text-sm text-gray-600">
                      Order #{table.currentOrder}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <select
                    value={table.status}
                    onChange={(e) =>
                      handleStatusChange(table.id, e.target.value)
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600]"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Table Modal */}
        {showAddTable && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#3b1a0b]">
                  Add New Table
                </h3>
                <Button variant="ghost" onClick={() => setShowAddTable(false)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Table Number"
                  placeholder="Enter table number"
                  value={newTable.number}
                  onChange={(e) =>
                    setNewTable({ ...newTable, number: e.target.value })
                  }
                />

                <Input
                  label="Capacity"
                  type="number"
                  placeholder="Number of seats"
                  value={newTable.capacity}
                  onChange={(e) =>
                    setNewTable({ ...newTable, capacity: e.target.value })
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-[#3b1a0b] mb-1">
                    Location
                  </label>
                  <select
                    value={newTable.location}
                    onChange={(e) =>
                      setNewTable({ ...newTable, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600]"
                  >
                    <option value="Main Floor">Main Floor</option>
                    <option value="Second Floor">Second Floor</option>
                    <option value="Terrace">Terrace</option>
                    <option value="Private Room">Private Room</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddTable(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTable}
                    className="flex-1 bg-[#cc6600] hover:bg-[#b35500] text-white"
                  >
                    Add Table
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;
