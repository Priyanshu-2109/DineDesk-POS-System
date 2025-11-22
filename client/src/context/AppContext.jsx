import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

// Initialize with empty data - new users start with clean slate
// Data should be fetched from backend or added by user
const initialTables = [];
const initialMenu = [];
const initialOrders = [];

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user, token } = useAuth();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Auth modal state
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" });

  // Contact form modal state
  const [contactModal, setContactModal] = useState(false);

  // Restaurant setup state
  const [restaurant, setRestaurant] = useState({ name: "" });
  const [tables, setTables] = useState(initialTables);
  const [menu, setMenu] = useState(initialMenu);
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);

  // Fetch data from backend when user logs in
  useEffect(() => {
    if (user && token) {
      fetchRestaurantData();
      fetchTables();
      fetchMenu();
      fetchOrders();
    } else {
      // Clear data when user logs out
      setRestaurant({ name: "" });
      setTables([]);
      setMenu([]);
      setOrders([]);
    }
  }, [user, token]);

  // Fetch restaurant info
  const fetchRestaurantData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/restaurant`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.restaurant) {
          setRestaurant({ name: data.restaurant.name || "" });
        }
      }
    } catch (error) {
      console.error("Failed to fetch restaurant data:", error);
    }
  };

  // Fetch tables from backend
  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tables`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend format
        const transformedTables = data.tables.map((table) => ({
          id: table._id,
          name: table.name,
          seats: table.capacity,
          status: table.isOccupied ? "occupied" : "available",
          currentOrderId: table.currentOrder || null,
          _id: table._id,
        }));
        setTables(transformedTables);
      }
    } catch (error) {
      console.error("Failed to fetch tables:", error);
    }
  };

  // Fetch menu from backend
  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend format
        const transformedMenu = data.menuItems.map((item) => ({
          id: item._id,
          name: item.item_name,
          category: item.category,
          price: item.price,
          available: item.isAvailable,
          _id: item._id,
        }));
        setMenu(transformedMenu);
      }
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform if needed
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const openAuthModal = (mode = "login") =>
    setAuthModal({ isOpen: true, mode });
  const closeAuthModal = () => setAuthModal((m) => ({ ...m, isOpen: false }));

  const openContactModal = () => setContactModal(true);
  const closeContactModal = () => setContactModal(false);

  // Update restaurant name in backend
  const updateRestaurantName = async (name) => {
    setRestaurant((r) => ({ ...r, name }));

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/settings/restaurant/name`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        console.error("Failed to update restaurant name");
      }
    } catch (error) {
      console.error("Error updating restaurant name:", error);
    }
  };

  // Add table to backend
  const addTable = async (tableNumber, capacity = 4) => {
    // Optimistically update UI
    const tempId = `temp-${Date.now()}`;
    const newTable = {
      id: tempId,
      name: `T${tableNumber || tables.length + 1}`,
      seats: capacity,
      status: "available",
      currentOrderId: null,
    };
    setTables((prev) => [...prev, newTable]);

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tables/add-table`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `T${tableNumber || tables.length + 1}`,
          capacity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace temp table with real data from backend
        setTables((prev) =>
          prev.map((t) =>
            t.id === tempId
              ? {
                  id: data.table._id,
                  name: data.table.name,
                  seats: data.table.capacity,
                  status: data.table.isOccupied ? "occupied" : "available",
                  currentOrderId: null,
                  _id: data.table._id,
                }
              : t
          )
        );
      } else {
        // Remove temp table on error
        setTables((prev) => prev.filter((t) => t.id !== tempId));
        const errorData = await response.json();
        console.error("Failed to add table:", errorData.message);
        alert(errorData.message || "Failed to add table");
      }
    } catch (error) {
      // Remove temp table on error
      setTables((prev) => prev.filter((t) => t.id !== tempId));
      console.error("Error adding table:", error);
      alert("Error adding table. Please try again.");
    }
  };

  // Remove table from backend
  const removeTable = async (id) => {
    // Optimistically remove from UI
    const tableToRemove = tables.find((t) => t.id === id || t._id === id);
    setTables((prev) => prev.filter((t) => t.id !== id && t._id !== id));

    if (!token || !tableToRemove?._id) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/tables/delete-table/${tableToRemove._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Restore table on error
        setTables((prev) => [...prev, tableToRemove]);
        const errorData = await response.json();
        console.error("Failed to delete table:", errorData.message);
        alert(errorData.message || "Failed to delete table");
      }
    } catch (error) {
      // Restore table on error
      setTables((prev) => [...prev, tableToRemove]);
      console.error("Error deleting table:", error);
      alert("Error deleting table. Please try again.");
    }
  };

  // Add menu item to backend
  const addMenuItem = async (item) => {
    // Optimistically update UI
    const tempId = `temp-${Date.now()}`;
    const newItem = { id: tempId, ...item };
    setMenu((prev) => [...prev, newItem]);

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/menu/add-item`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_name: item.name,
          category: item.category,
          price: item.price,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace temp item with real data from backend
        setMenu((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  id: data.menuItem._id,
                  name: data.menuItem.item_name,
                  category: data.menuItem.category,
                  price: data.menuItem.price,
                  available: data.menuItem.isAvailable,
                  _id: data.menuItem._id,
                }
              : m
          )
        );
      } else {
        // Remove temp item on error
        setMenu((prev) => prev.filter((m) => m.id !== tempId));
        const errorData = await response.json();
        console.error("Failed to add menu item:", errorData.message);
        alert(errorData.message || "Failed to add menu item");
      }
    } catch (error) {
      // Remove temp item on error
      setMenu((prev) => prev.filter((m) => m.id !== tempId));
      console.error("Error adding menu item:", error);
      alert("Error adding menu item. Please try again.");
    }
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
      prev.map((o) => (o.id === orderId ? { ...o, status: "complete" } : o))
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

  const checkoutTable = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    if (table && table.currentOrderId) {
      markOrderComplete(table.currentOrderId);
    }
  };

  const updateItemQuantity = (orderId, itemId, change) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            items: o.items
              .map((item) => {
                if (item.id === itemId) {
                  const newQty = item.qty + change;
                  return newQty > 0 ? { ...item, qty: newQty } : null;
                }
                return item;
              })
              .filter(Boolean),
          };
        }
        return o;
      })
    );
  };

  const removeItemFromOrder = (orderId, itemId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            items: o.items.filter((item) => item.id !== itemId),
          };
        }
        return o;
      })
    );
  };

  const getTableOrders = (tableId) => {
    return orders.filter(
      (order) => order.tableId === tableId && order.status === "open"
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

  const getTableTotal = (tableId) => {
    const tableOrders = getTableOrders(tableId);
    return tableOrders.reduce(
      (total, order) => total + getOrderTotal(order.id),
      0
    );
  };

  const value = useMemo(
    () => ({
      // modal
      authModal,
      openAuthModal,
      closeAuthModal,
      // Contact modal
      contactModal,
      openContactModal,
      closeContactModal,
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
      checkoutTable,
      updateItemQuantity,
      removeItemFromOrder,
      getTableOrders,
      getOrderTotal,
      getTableTotal,
      // fetch functions
      fetchTables,
      fetchMenu,
      fetchOrders,
      loading,
    }),
    [
      authModal,
      contactModal,
      restaurant,
      tables,
      menu,
      orders,
      user,
      token,
      loading,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
