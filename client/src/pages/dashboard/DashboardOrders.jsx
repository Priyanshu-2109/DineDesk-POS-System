import React, { useState } from "react";
import {
  Plus,
  X,
  Search,
  Minus,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  AlertTriangle,
  Eye,
  CreditCard,
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
    updateItemQuantity,
    removeItemFromOrder,
    checkoutTable,
    getTableOrders,
    getOrderTotal,
    getTableTotal,
  } = useApp();

  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showViewOrder, setShowViewOrder] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTables, setExpandedTables] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [sendBill, setSendBill] = useState(false);

  // Get only occupied tables with orders
  const occupiedTablesWithOrders = tables.filter(
    (table) => table.status === "occupied" && table.currentOrderId
  );

  const handleTableClick = (tableId, action = "add") => {
    const table = tables.find((t) => t.id === tableId);

    if (action === "view") {
      setSelectedTable(tableId);
      setShowViewOrder(true);
      return;
    }

    if (action === "checkout") {
      setSelectedTable(tableId);
      setShowCheckout(true);
      setCustomerEmail("");
      setSendBill(false);
      return;
    }

    // Default 'add' action
    setSelectedTable(tableId);
    setShowAddOrder(true);
    setSelectedItems([]);
    setSearchTerm("");

    if (table.status === "occupied" && table.currentOrderId) {
      setWarningMessage(
        `Table ${table.name} already has an active order. Adding items will be added to the existing order.`
      );
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleTableSelect = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    if (table.status === "occupied" && table.currentOrderId) {
      setWarningMessage(
        `Table ${table.name} already has an active order. Adding items will be added to the existing order.`
      );
      setShowWarning(true);
      setSelectedTable(tableId);
    } else {
      setSelectedTable(tableId);
      setShowWarning(false);
    }
  };

  const proceedWithOrder = () => {
    setShowWarning(false);
  };

  const addOrder = () => {
    if (selectedTable && selectedItems.length > 0) {
      const table = tables.find((t) => t.id === selectedTable);
      let orderId;

      if (table.currentOrderId) {
        orderId = table.currentOrderId;
      } else {
        orderId = createOrder(selectedTable);
      }

      selectedItems.forEach((item) => {
        for (let i = 0; i < item.qty; i++) {
          addItemToOrder(orderId, item.id);
        }
      });

      setShowAddOrder(false);
      setSelectedTable("");
      setSelectedItems([]);
      setSearchTerm("");
    }
  };

  const addItemToSelectedItems = (menuItem) => {
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

  const updateSelectedItemQuantity = (itemId, change) => {
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

  const removeSelectedItem = (itemId) => {
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

  const toggleTableExpansion = (tableId) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableId]: !prev[tableId],
    }));
  };

  const handleCheckout = (tableId) => {
    checkoutTable(tableId);
  };

  const confirmCheckout = () => {
    if (sendBill && customerEmail && !isValidEmail(customerEmail)) {
      alert("Please enter a valid email address to send the bill.");
      return;
    }

    const table = tables.find((t) => t.id === selectedTable);

    // Here you can add logic to send email bill if needed
    if (sendBill && customerEmail) {
      console.log(`Sending bill to: ${customerEmail} for Table ${table?.name}`);
      // Add your email sending logic here
    }

    checkoutTable(selectedTable);
    setShowCheckout(false);
    setSelectedTable("");
    setCustomerEmail("");
    setSendBill(false);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3b1a0b]">Orders</h2>
      </div>

      {/* All Tables Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#3b1a0b]">All Tables</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map((table) => {
            const tableOrders = getTableOrders(table.id);
            const tableTotal = getTableTotal(table.id);
            const isOccupied = table.status === "occupied";

            return (
              <div
                key={table.id}
                onClick={() => {
                  if (isOccupied) {
                    handleTableClick(table.id, "add");
                  } else {
                    handleTableClick(table.id, "add");
                  }
                }}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${
                  isOccupied
                    ? "bg-red-50 border-red-200 hover:border-red-300"
                    : "bg-green-50 border-green-200 hover:border-green-300"
                }`}
              >
                <div className="text-center">
                  <div className="relative mb-2">
                    <h3 className="text-base font-bold text-[#3b1a0b]">
                      {table.name}
                    </h3>
                    {isOccupied && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-red-500 text-white rounded-full p-1">
                          <ShoppingCart className="h-3 w-3" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    {table.seats} seats
                  </div>

                  <div
                    className={`mb-3 px-3 py-1 rounded-full text-sm font-medium ${
                      isOccupied
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isOccupied ? "Occupied" : "Available"}
                  </div>

                  {/* Action Buttons */}
                  {isOccupied && (
                    <div className="flex justify-center gap-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTableClick(table.id, "view");
                        }}
                        title="View Order Details"
                        className="w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTableClick(table.id, "checkout");
                        }}
                        title="Checkout"
                        className="w-12 h-12 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <CreditCard className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Orders Section - Only show if there are occupied tables */}
        {occupiedTablesWithOrders.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#3b1a0b] mb-4">
              Active Orders Details
            </h3>
            <div className="space-y-4">
              {occupiedTablesWithOrders.map((table) => {
                const tableOrders = getTableOrders(table.id);
                const tableTotal = getTableTotal(table.id);
                const isExpanded = expandedTables[table.id];

                return (
                  <div
                    key={table.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleTableExpansion(table.id)}
                            className="flex items-center gap-2 text-left"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-[#3b1a0b]">
                                {table.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {table.seats} seats •{" "}
                                {tableOrders.reduce(
                                  (total, order) => total + order.items.length,
                                  0
                                )}{" "}
                                item
                                {tableOrders.reduce(
                                  (total, order) => total + order.items.length,
                                  0
                                ) !== 1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#cc6600]">
                              ₹{tableTotal}
                            </div>
                            <div className="text-sm text-gray-500">Total</div>
                          </div>
                          <Button
                            onClick={() => handleCheckout(table.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Checkout
                          </Button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="space-y-4">
                            {tableOrders.map((order) => (
                              <div
                                key={order.id}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-medium text-gray-900">
                                    Order #{order.id.slice(-6)}
                                  </h4>
                                  <div className="text-sm text-gray-500">
                                    {new Date(
                                      order.createdAt
                                    ).toLocaleTimeString()}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  {order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-gray-100"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-900">
                                          {item.name}
                                        </span>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                          Qty: {item.qty}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="font-medium text-[#cc6600]">
                                          ₹{item.price * item.qty}
                                        </span>
                                        <div className="text-xs text-gray-500">
                                          ₹{item.price} each
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                  <span className="font-medium text-gray-900">
                                    Order Total:
                                  </span>
                                  <span className="font-bold text-[#cc6600]">
                                    ₹{getOrderTotal(order.id)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Warning Modal */}
      <Modal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        title="Table Already Occupied"
        size="md"
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-700">{warningMessage}</p>
            <p className="text-sm text-gray-500 mt-2">
              Do you want to proceed and add items to the existing order?
            </p>
          </div>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWarning(false)}>
            Cancel
          </Button>
          <Button onClick={proceedWithOrder}>Proceed</Button>
        </Modal.Footer>
      </Modal>

      {/* Enhanced Add Order Modal */}
      <Modal
        isOpen={showAddOrder}
        onClose={() => {
          setShowAddOrder(false);
          setSelectedTable("");
          setSelectedItems([]);
          setSearchTerm("");
          setShowWarning(false);
        }}
        title={
          selectedTable
            ? tables.find((t) => t.id === selectedTable)?.status === "occupied"
              ? `Add Items - Table ${
                  tables.find((t) => t.id === selectedTable)?.name
                }`
              : `Create Order - Table ${
                  tables.find((t) => t.id === selectedTable)?.name
                }`
            : "Create New Order"
        }
        size="lg"
        className="max-w-4xl w-full mx-4"
      >
        <div className="flex flex-col lg:flex-row gap-4 max-h-[70vh]">
          {/* Left Side - Search Items */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Add Items
            </h3>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
              />
            </div>

            {/* Search Results */}
            <div className="h-64 overflow-y-auto">
              {searchTerm ? (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">
                    Search Results{" "}
                    {filteredMenu.length > 5 &&
                      `(showing 5 of ${filteredMenu.length})`}
                  </h4>
                  <div className="space-y-1">
                    {filteredMenu.length > 0 ? (
                      filteredMenu.slice(0, 5).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => addItemToSelectedItems(item)}
                          className="w-full p-2 text-left hover:bg-gray-50 border border-gray-200 rounded-md transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.category}
                              </div>
                            </div>
                            <div className="text-[#cc6600] font-bold text-sm">
                              ₹{item.price}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="py-6 text-gray-500 text-center text-sm">
                        No items found
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Search to Find Items
                  </h4>
                  <p className="text-xs text-gray-500">
                    Use the search box above to find menu items
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="w-full lg:w-72">
            <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-900">
                  Order Summary
                </h3>
                {selectedItems.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {selectedItems.reduce((sum, item) => sum + item.qty, 0)}{" "}
                    items
                  </span>
                )}
              </div>

              {selectedItems.length > 0 ? (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              ₹{item.price} × {item.qty} = ₹
                              {(item.price * item.qty).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeSelectedItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove item"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-md p-1">
                          <button
                            onClick={() =>
                              updateSelectedItemQuantity(item.id, -1)
                            }
                            className="w-6 h-6 rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3 text-gray-600" />
                          </button>
                          <span className="w-6 text-center font-semibold text-gray-800 text-sm">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateSelectedItemQuantity(item.id, 1)
                            }
                            className="w-6 h-6 rounded-full bg-[#cc6600] hover:bg-[#b35500] text-white flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="bg-gradient-to-r from-[#cc6600] to-[#b35500] p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white text-sm">
                        Total:
                      </span>
                      <span className="text-xl font-bold text-white">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Create Order Button */}
                  <Button
                    onClick={addOrder}
                    disabled={!selectedTable || selectedItems.length === 0}
                    className="w-full py-2 text-sm font-semibold bg-gradient-to-r from-[#cc6600] to-[#b35500] hover:from-[#b35500] hover:to-[#a04000]"
                  >
                    {selectedTable &&
                    tables.find((t) => t.id === selectedTable)?.status ===
                      "occupied"
                      ? "Add to Order"
                      : "Create Order"}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-gray-600 font-medium mb-2">
                    No items selected
                  </h4>
                  <p className="text-sm text-gray-500">
                    Search and click items to add them to your order
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* View Order Modal */}
      <Modal
        isOpen={showViewOrder}
        onClose={() => setShowViewOrder(false)}
        title=""
        size="lg"
        className="max-h-[90vh] overflow-hidden"
      >
        <div className="space-y-6">
          {selectedTable &&
            (() => {
              const tableOrders = getTableOrders(selectedTable);
              const tableTotal = getTableTotal(selectedTable);
              const table = tables.find((t) => t.id === selectedTable);

              if (tableOrders.length === 0) {
                return (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Orders Found
                    </h3>
                    <p className="text-gray-500">
                      This table doesn't have any active orders
                    </p>
                  </div>
                );
              }

              return (
                <div>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#cc6600] to-[#b35500] rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {table?.name}
                        </h2>
                        <div className="flex items-center gap-4 text-orange-100">
                          <span className="flex items-center gap-1">
                            <ShoppingCart className="h-4 w-4" />
                            {tableOrders.reduce(
                              (total, order) => total + order.items.length,
                              0
                            )}{" "}
                            Items
                          </span>
                          <span className="flex items-center gap-1">
                            👥 {table?.seats} Seats
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-100 text-sm">
                          Total Amount
                        </div>
                        <div className="text-3xl font-bold">₹{tableTotal}</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {tableOrders.map((order) =>
                      order.items.map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span>₹{item.price} per item</span>
                                <span>•</span>
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                                  Qty: {item.qty}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#cc6600]">
                                ₹{(item.price * item.qty).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Order Summary
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {tableOrders.reduce(
                            (total, order) => total + order.items.length,
                            0
                          )}{" "}
                          items ordered
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#cc6600]">
                          ₹{tableTotal}
                        </div>
                        <div className="text-gray-500 text-sm">
                          Total Amount
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowViewOrder(false)}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
          <Button
            onClick={() => {
              setShowViewOrder(false);
              handleTableClick(selectedTable, "checkout");
            }}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Proceed to Checkout
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          setSelectedTable("");
          setCustomerEmail("");
          setSendBill(false);
        }}
        title=""
        size="lg"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          {selectedTable &&
            (() => {
              const table = tables.find((t) => t.id === selectedTable);
              const tableOrders = getTableOrders(selectedTable);
              const tableTotal = getTableTotal(selectedTable);

              return (
                <div>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Checkout Confirmation
                        </h2>
                        <p className="text-green-100">
                          Table {table?.name} • {table?.seats} Seats
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-100 text-sm">
                          Total Amount
                        </div>
                        <div className="text-3xl font-bold">₹{tableTotal}</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {tableOrders.map((order) =>
                        order.items.map((item, index) => (
                          <div
                            key={`${item.id}-${index}`}
                            className="flex justify-between items-center py-2"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">
                                {item.name}
                              </span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {item.qty}x
                              </span>
                            </div>
                            <span className="font-semibold text-[#cc6600]">
                              ₹{(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-[#cc6600]">
                          ₹{tableTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email Bill Option */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="sendBill"
                        checked={sendBill}
                        onChange={(e) => setSendBill(e.target.checked)}
                        className="w-4 h-4 text-[#cc6600] bg-gray-100 border-gray-300 rounded focus:ring-[#cc6600] focus:ring-2"
                      />
                      <label
                        htmlFor="sendBill"
                        className="text-sm font-medium text-gray-900"
                      >
                        Send digital bill via email
                      </label>
                    </div>

                    {sendBill && (
                      <div className="space-y-2">
                        <label
                          htmlFor="customerEmail"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Customer Email Address
                        </label>
                        <input
                          type="email"
                          id="customerEmail"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="customer@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500">
                          A digital copy of the bill will be sent to this email
                          address
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
        </div>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCheckout(false);
              setSelectedTable("");
              setCustomerEmail("");
              setSendBill(false);
            }}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={confirmCheckout}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Complete Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardOrders;
