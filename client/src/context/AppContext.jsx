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
        
        // Also fetch orders to sync currentOrderId properly
        if (token) {
          await fetchOrders();
        }
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
        // Transform backend data to match frontend format
        const transformedOrders = data.orders.map((order) => ({
          id: order._id,
          tableId: order.table._id || order.table,
          items: order.items.map((item) => ({
            id: `${order._id}-${item.menuItem}`,
            menuItemId: item.menuItem,
            name: item.item_name || item.menuItem.item_name,
            price: item.price,
            qty: item.quantity,
          })),
          status: order.status === "completed" ? "complete" : "open",
          createdAt: order.createdAt,
          orderNumber: order.orderNumber,
          _id: order._id,
        }));
        setOrders(transformedOrders);
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
    const tableName = tableNumber || `Table ${tables.length + 1}`;
    const newTable = {
      id: tempId,
      name: tableName,
      seats: capacity,
      status: "available",
      currentOrderId: null,
    };
    setTables((prev) => [...prev, newTable]);

    if (!token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tables/add-table`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tableName,
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
        throw new Error(errorData.message || "Failed to add table");
      }
    } catch (error) {
      // Remove temp table on error
      setTables((prev) => prev.filter((t) => t.id !== tempId));
      console.error("Error adding table:", error);
      throw error;
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

    if (!token) {
      throw new Error("Not authenticated");
    }

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
        throw new Error(errorData.message || "Failed to add menu item");
      }
    } catch (error) {
      // Remove temp item on error
      setMenu((prev) => prev.filter((m) => m.id !== tempId));
      console.error("Error adding menu item:", error);
      throw error;
    }
  };

  // Update menu item
  const updateMenuItem = async (itemId, updates) => {
    // Optimistically update UI
    const oldMenu = [...menu];
    setMenu((prev) =>
      prev.map((m) =>
        m.id === itemId || m._id === itemId ? { ...m, ...updates } : m
      )
    );

    if (!token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/update-item/${itemId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update with real data from backend
        setMenu((prev) =>
          prev.map((m) =>
            m.id === itemId || m._id === itemId
              ? {
                  ...m,
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
        // Rollback on error
        setMenu(oldMenu);
        const errorData = await response.json();
        console.error("Failed to update menu item:", errorData.message);
        throw new Error(errorData.message || "Failed to update menu item");
      }
    } catch (error) {
      // Rollback on error
      setMenu(oldMenu);
      console.error("Error updating menu item:", error);
      throw error;
    }
  };

  // Remove menu item
  const removeMenuItem = async (itemId) => {
    // Optimistically remove from UI
    const oldMenu = [...menu];
    setMenu((prev) => prev.filter((m) => m.id !== itemId && m._id !== itemId));

    if (!token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/menu/delete-item/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Rollback on error
        setMenu(oldMenu);
        const errorData = await response.json();
        console.error("Failed to delete menu item:", errorData.message);
        throw new Error(errorData.message || "Failed to delete menu item");
      }
    } catch (error) {
      // Rollback on error
      setMenu(oldMenu);
      console.error("Error deleting menu item:", error);
      throw error;
    }
  };

  const createOrder = async (tableId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create order');
      }

      const data = await response.json();
      const order = {
        id: data.order._id,
        tableId: tableId,
        items: [],
        status: "open",
        createdAt: data.order.createdAt,
        orderNumber: data.order.orderNumber,
      };
      
      setOrders((prev) => [order, ...prev]);
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableId ? { ...t, status: "occupied", currentOrderId: order.id } : t
        )
      );
      
      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const addItemToOrder = async (orderId, menuItemId) => {
    const item = menu.find((m) => m.id === menuItemId);
    if (!item) return;

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/add-item`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItemId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to order');
      }

      // Update local state optimistically
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
      
      // Refresh orders to get updated data from backend
      await fetchOrders();
    } catch (error) {
      console.error('Error adding item to order:', error);
      throw error;
    }
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

  const checkoutTable = async (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    if (table && table.currentOrderId) {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${table.currentOrderId}/checkout`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to checkout order');
        }

        // Update local state
        markOrderComplete(table.currentOrderId);
        
        // Refresh data from backend
        await fetchOrders();
        await fetchTables();
      } catch (error) {
        console.error('Error during checkout:', error);
        throw error;
      }
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
      updateMenuItem,
      removeMenuItem,
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
