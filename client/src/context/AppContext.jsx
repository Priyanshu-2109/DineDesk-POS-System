import React, { createContext, useContext, useMemo, useState } from "react";

// Dummy assets/data
const initialTables = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `T${i + 1}`,
  seats: [2, 2, 4, 4, 6, 6, 2, 4, 4, 2, 6, 2][i],
  status: "available", // available | occupied
  currentOrderId: null,
}));

const initialMenu = [
  {
    id: "m1",
    name: "Paneer Butter Masala",
    price: 220,
    category: "Main Course",
  },
  { id: "m2", name: "Masala Dosa", price: 120, category: "South Indian" },
  { id: "m3", name: "Chole Bhature", price: 150, category: "North Indian" },
  { id: "m4", name: "Veg Biryani", price: 180, category: "Rice" },
  { id: "m5", name: "Masala Chai", price: 30, category: "Beverages" },
];

const initialOrders = [];

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null); // { name }

  // Auth modal state
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" });

  // Restaurant setup state
  const [restaurant, setRestaurant] = useState({ name: "" });
  const [tables, setTables] = useState(initialTables);
  const [menu, setMenu] = useState(initialMenu);
  const [orders, setOrders] = useState(initialOrders);

  // Actions
  const login = (name) => {
    setUser({ name });
    setAuthModal({ isOpen: false, mode: "login" });
  };

  const signup = (name) => {
    setUser({ name });
    setAuthModal({ isOpen: false, mode: "login" });
  };

  const logout = () => setUser(null);

  const openAuthModal = (mode = "login") =>
    setAuthModal({ isOpen: true, mode });
  const closeAuthModal = () => setAuthModal((m) => ({ ...m, isOpen: false }));

  const updateRestaurantName = (name) => setRestaurant((r) => ({ ...r, name }));

  const addTable = (tableNumber, capacity = 4) => {
    const id = tables.length ? Math.max(...tables.map((t) => t.id)) + 1 : 1;
    setTables((prev) => [
      ...prev,
      {
        id,
        name: `T${tableNumber || id}`,
        seats: capacity,
        status: "available",
        currentOrderId: null,
      },
    ]);
  };

  const removeTable = (id) =>
    setTables((prev) => prev.filter((t) => t.id !== id));

  const addMenuItem = (item) => {
    const id = `m${Date.now()}`;
    setMenu((prev) => [...prev, { id, ...item }]);
  };

  const createOrder = (tableId) => {
    const id = `o${Date.now()}`;
    const order = {
      id,
      tableId,
      items: [],
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, status: "occupied", currentOrderId: id } : t
      )
    );
    return id;
  };

  const addItemToOrder = (orderId, menuItemId) => {
    const item = menu.find((m) => m.id === menuItemId);
    if (!item) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: [
                ...o.items,
                {
                  id: `${orderId}-${Date.now()}`,
                  menuItemId,
                  name: item.name,
                  price: item.price,
                  qty: 1,
                },
              ],
            }
          : o
      )
    );
  };

  const markOrderComplete = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "complete", completedAt: new Date().toISOString() }
          : o
      )
    );
    // free the table
    setTables((prev) =>
      prev.map((t) =>
        t.currentOrderId === orderId
          ? { ...t, status: "available", currentOrderId: null }
          : t
      )
    );
  };

  // Additional helper functions for better order management
  const updateItemQuantityInOrder = (orderId, itemId, newQty) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((item) =>
                item.id === itemId ? { ...item, qty: newQty } : item
              ),
            }
          : o
      )
    );
  };

  const removeItemFromOrder = (orderId, itemId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.filter((item) => item.id !== itemId),
            }
          : o
      )
    );
  };

  const getOrderTotal = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return 0;
    return order.items.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
  };

  const getTableOrders = () => {
    return tables
      .filter((table) => table.status === "occupied")
      .map((table) => {
        const order = orders.find(
          (o) => o.tableId === table.id && o.status === "open"
        );
        return { table, order };
      });
  };

  const value = useMemo(
    () => ({
      // auth
      user,
      login,
      signup,
      logout,
      // modal
      authModal,
      openAuthModal,
      closeAuthModal,
      // data
      restaurant,
      updateRestaurantName,
      tables,
      addTable,
      removeTable,
      menu,
      addMenuItem,
      orders,
      createOrder,
      addItemToOrder,
      markOrderComplete,
      updateItemQuantityInOrder,
      removeItemFromOrder,
      getOrderTotal,
      getTableOrders,
    }),
    [user, authModal, restaurant, tables, menu, orders]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
