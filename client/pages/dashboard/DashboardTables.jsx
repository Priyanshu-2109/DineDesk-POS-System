import React, { useState } from "react";
import { Plus } from "lucide-react";

const DashboardTables = () => {
  const [tables, setTables] = useState([
    { id: 1, number: 1, capacity: 4, status: "available" },
    { id: 2, number: 2, capacity: 2, status: "occupied" },
    { id: 3, number: 3, capacity: 6, status: "available" },
    { id: 4, number: 4, capacity: 4, status: "occupied" },
    { id: 5, number: 5, capacity: 8, status: "available" },
    { id: 6, number: 6, capacity: 2, status: "available" },
  ]);

  const toggleTableStatus = (tableId) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              status: table.status === "available" ? "occupied" : "available",
            }
          : table
      )
    );
  };

  const addTable = () => {
    const newTable = {
      id: tables.length + 1,
      number: tables.length + 1,
      capacity: 4,
      status: "available",
    };
    setTables([...tables, newTable]);
  };

  const removeTable = (tableId) => {
    setTables(tables.filter((table) => table.id !== tableId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Tables</h2>
        <button
          onClick={addTable}
          className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
              table.status === "available"
                ? "bg-green-50 border-green-200 hover:border-green-300"
                : "bg-red-50 border-red-200 hover:border-red-300"
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#3b1a0b]">
                Table {table.number}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {table.capacity} seats
              </p>

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
                  onClick={() => removeTable(table.id)}
                  className="w-full py-2 px-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Remove Table
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardTables;
