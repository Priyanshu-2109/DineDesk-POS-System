import React, { useState } from "react";
import {
  Plus,
  X,
  Search,
  Minus,
  Eye,
  CreditCard,
  Users,
  Clock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

const DashboardOrders = () => {
  const {
    tables,
    menu,
    orders,
    createOrder,
    addItemToOrder,
    markOrderComplete,
  } = useApp();
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Get only occupied tables with their orders
  const occupiedTables = tables.filter((table) => table.status === "occupied");
  const tableOrders = occupiedTables.map((table) => {
    const tableOrder = orders.find(
      (order) => order.tableId === table.id && order.status === "open"
    );
    return {
      table,
      order: tableOrder,
    };
  });

  const createNewOrder = () => {
    if (selectedTable && selectedItems.length > 0) {
      const orderId = createOrder(parseInt(selectedTable));

      // Add all selected items to the order
      selectedItems.forEach((item) => {
        for (let i = 0; i < item.qty; i++) {
          addItemToOrder(orderId, item.id);
        }
      });

      // Reset form
      setShowCreateOrder(false);
      setSelectedTable("");
      setSelectedItems([]);
      setSearchTerm("");
    }
  };

  const addItemToSelection = (menuItem) => {
    const existingItem = selectedItems.find((item) => item.id === menuItem.id);
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.id === menuItem.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...menuItem, qty: 1 }]);
    }
    setSearchTerm("");
  };

  const updateItemQuantity = (itemId, change) => {
    setSelectedItems(
      selectedItems
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.qty + change;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItemFromSelection = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  const filteredMenu = menu.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      searchTerm.length > 0
  );

  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const availableTables = tables.filter(
    (table) => table.status === "available"
  );

  const viewOrderDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOrderDetails(true);
  };

  const handleCheckout = (orderId) => {
    markOrderComplete(orderId);
    setShowOrderDetails(false);
    setSelectedOrderId(null);
  };

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);
  const selectedOrderTable = tables.find(
    (table) => table.currentOrderId === selectedOrderId
  );

  const calculateOrderTotal = (order) => {
    return (
      order?.items?.reduce((total, item) => total + item.price * item.qty, 0) ||
      0
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Orders Management</h2>
        <button
          onClick={() => setShowCreateOrder(true)}
          className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Order
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#cc6600] bg-opacity-10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-[#cc6600]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupied Tables</p>
              <p className="text-2xl font-bold text-[#3b1a0b]">
                {occupiedTables.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-[#3b1a0b]">
                {orders.filter((o) => o.status === "open").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue Today</p>
              <p className="text-2xl font-bold text-[#3b1a0b]">
                ₹
                {orders
                  .filter((o) => o.status === "complete")
                  .reduce(
                    (total, order) => total + calculateOrderTotal(order),
                    0
                  )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#3b1a0b]">
            Active Table Orders
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Click on any table to view detailed order information
          </p>
        </div>

        {tableOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                    Table
                  </th>
                  <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                    Order ID
                  </th>
                  <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                    Items Count
                  </th>
                  <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                    Total Amount
                  </th>
                  <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                    Time
                  </th>
                  <th className="text-left p-4 font-semibold text-[#3b1a0b]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableOrders.map(({ table, order }) => (
                  <tr
                    key={table.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => order && viewOrderDetails(order.id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#cc6600] bg-opacity-10 rounded-lg flex items-center justify-center">
                          <span className="font-medium text-[#cc6600]">
                            {table.name}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#3b1a0b]">
                            {table.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {table.seats} seats
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-600">
                      {order ? order.id.slice(-8) : "No Order"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {order ? order.items.length : 0} items
                    </td>
                    <td className="p-4 font-medium text-[#3b1a0b]">
                      ₹{order ? calculateOrderTotal(order) : 0}
                    </td>
                    <td className="p-4 text-gray-600">
                      {order
                        ? new Date(order.createdAt).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {order && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewOrderDetails(order.id);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckout(order.id);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Checkout"
                            >
                              <CreditCard className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Orders
            </h3>
            <p className="text-gray-500 mb-4">
              All tables are currently available. Create a new order to get
              started.
            </p>
            <button
              onClick={() => setShowCreateOrder(true)}
              className="bg-[#cc6600] text-white px-4 py-2 rounded-lg hover:bg-[#b35500] transition-colors"
            >
              Create First Order
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Create Order Modal */}
      <Modal
        isOpen={showCreateOrder}
        onClose={() => {
          setShowCreateOrder(false);
          setSelectedTable("");
          setSelectedItems([]);
          setSearchTerm("");
        }}
        title="Create New Order"
        size="lg"
      >
        <div className="space-y-6">
          {/* Table Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Available Table
            </label>
            {availableTables.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {availableTables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table.id)}
                    className={`p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                      selectedTable === table.id
                        ? "border-[#cc6600] bg-orange-50 text-[#cc6600] shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-lg">{table.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Users className="h-3 w-3 inline mr-1" />
                      {table.seats} seats
                    </div>
                    <div className="text-xs text-green-600 mt-1 font-medium">
                      Available
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No tables available</p>
                <p className="text-sm text-gray-400">
                  All tables are currently occupied
                </p>
              </div>
            )}
          </div>

          {/* Menu Item Search and Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Add Menu Items
            </label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
              />
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredMenu.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredMenu.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addItemToSelection(item)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.category}
                            </div>
                          </div>
                          <div className="text-[#cc6600] font-medium">
                            ₹{item.price}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p>No items found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Items */}
          {selectedItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Order Items ({selectedItems.length})
              </label>
              <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{item.price} × {item.qty} = ₹{item.price * item.qty}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateItemQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-[#cc6600] hover:bg-[#b35500] text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItemFromSelection(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 p-4 bg-gradient-to-r from-[#cc6600] to-[#b35500] text-white rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">
                      Total Items:{" "}
                      {selectedItems.reduce((sum, item) => sum + item.qty, 0)}
                    </p>
                    <p className="text-lg font-bold">
                      Total Amount: ₹{totalAmount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">
                      Table:{" "}
                      {selectedTable
                        ? tables.find((t) => t.id === selectedTable)?.name
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreateOrder(false);
              setSelectedTable("");
              setSelectedItems([]);
              setSearchTerm("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={createNewOrder}
            disabled={!selectedTable || selectedItems.length === 0}
            className="bg-[#cc6600] hover:bg-[#b35500]"
          >
            Create Order (₹{totalAmount})
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrderId(null);
        }}
        title={`Order Details - ${selectedOrderTable?.name || "Table"}`}
        size="lg"
      >
        {selectedOrder && selectedOrderTable && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-[#cc6600] to-[#b35500] text-white p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedOrderTable.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    <Users className="h-4 w-4 inline mr-1" />
                    {selectedOrderTable.seats} seats
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    Order ID: {selectedOrder.id.slice(-8)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Started at</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="text-xs opacity-75">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-lg font-semibold text-[#3b1a0b] mb-4">
                Order Items
              </h4>
              {selectedOrder.items.length > 0 ? (
                <div className="space-y-3">
                  {selectedOrder.items
                    .reduce((groupedItems, item) => {
                      const existing = groupedItems.find(
                        (g) => g.menuItemId === item.menuItemId
                      );
                      if (existing) {
                        existing.qty += item.qty;
                        existing.total += item.price * item.qty;
                      } else {
                        groupedItems.push({
                          ...item,
                          qty: item.qty,
                          total: item.price * item.qty,
                        });
                      }
                      return groupedItems;
                    }, [])
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {item.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            ₹{item.price} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            Qty: {item.qty}
                          </p>
                          <p className="text-sm text-gray-600">₹{item.total}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p>No items in this order</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">
                    {selectedOrder.items.length}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ₹{calculateOrderTotal(selectedOrder)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-[#3b1a0b] border-t pt-2">
                  <span>Total Amount:</span>
                  <span>₹{calculateOrderTotal(selectedOrder)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowOrderDetails(false);
              setSelectedOrderId(null);
            }}
          >
            Close
          </Button>
          {selectedOrder && (
            <Button
              onClick={() => handleCheckout(selectedOrder.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Checkout & Free Table
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardOrders;
