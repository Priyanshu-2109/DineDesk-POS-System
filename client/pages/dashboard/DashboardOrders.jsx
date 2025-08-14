import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const DashboardOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      table: 2,
      items: ["Butter Chicken", "Naan"],
      amount: 850,
      status: "preparing",
    },
    {
      id: "ORD-002",
      table: 5,
      items: ["Dal Makhani", "Rice"],
      amount: 650,
      status: "ready",
    },
    {
      id: "ORD-003",
      table: 3,
      items: ["Paneer Tikka"],
      amount: 450,
      status: "delivered",
    },
  ]);

  const [showAddOrder, setShowAddOrder] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const tables = [1, 2, 3, 4, 5, 6];
  const menuItems = [
    { name: "Butter Chicken", price: 320 },
    { name: "Dal Makhani", price: 180 },
    { name: "Paneer Tikka", price: 250 },
    { name: "Biryani", price: 280 },
    { name: "Naan", price: 50 },
    { name: "Rice", price: 80 },
  ];

  const addOrder = () => {
    if (selectedTable && selectedItems.length > 0) {
      const newOrder = {
        id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        table: parseInt(selectedTable),
        items: selectedItems.map((item) => item.name),
        amount: selectedItems.reduce((total, item) => total + item.price, 0),
        status: "preparing",
      };
      setOrders([...orders, newOrder]);
      setShowAddOrder(false);
      setSelectedTable("");
      setSelectedItems([]);
    }
  };

  const toggleItem = (item) => {
    const isSelected = selectedItems.find(
      (selected) => selected.name === item.name
    );
    if (isSelected) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.name !== item.name)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Orders</h2>
        <button
          onClick={() => setShowAddOrder(true)}
          className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Order
        </button>
      </div>

      {/* Add Order Modal */}
      {showAddOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#3b1a0b]">
                Add New Order
              </h3>
              <button onClick={() => setShowAddOrder(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3b1a0b] mb-2">
                  Select Table
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a table</option>
                  {tables.map((table) => (
                    <option key={table} value={table}>
                      Table {table}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b1a0b] mb-2">
                  Select Items
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {menuItems.map((item) => (
                    <label
                      key={item.name}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.find(
                          (selected) => selected.name === item.name
                        )}
                        onChange={() => toggleItem(item)}
                        className="rounded"
                      />
                      <span className="flex-1">{item.name}</span>
                      <span className="text-[#cc6600] font-medium">
                        ₹{item.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="text-right">
                  <span className="text-lg font-bold text-[#3b1a0b]">
                    Total: ₹
                    {selectedItems.reduce(
                      (total, item) => total + item.price,
                      0
                    )}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddOrder(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addOrder}
                  disabled={!selectedTable || selectedItems.length === 0}
                  className="flex-1 px-4 py-2 bg-[#cc6600] text-white rounded-lg hover:bg-[#b35500] disabled:opacity-50"
                >
                  Add Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Order ID
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Table
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Items
                </th>
                <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                  Amount
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
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-[#3b1a0b]">{order.id}</td>
                  <td className="p-4 text-gray-600">Table {order.table}</td>
                  <td className="p-4 text-gray-600">
                    {order.items.join(", ")}
                  </td>
                  <td className="p-4 font-medium text-[#3b1a0b]">
                    ₹{order.amount}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                        order.status === "preparing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        setOrders(orders.filter((o) => o.id !== order.id))
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
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

export default DashboardOrders;
