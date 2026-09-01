import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [restaurantId, setRestaurantId] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? localStorage.getItem("cart_restaurantId") || null : null;
  });
  const [items, setItems] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("cart_items");
      localStorage.removeItem("cart_restaurantId");
      return [];
    }
    const stored = localStorage.getItem("cart_items");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
    if (restaurantId) localStorage.setItem("cart_restaurantId", restaurantId);
  }, [items, restaurantId]);

  const addItem = (item, quantity = 1) => {
    // A cart may only contain items from a single restaurant at a time
    if (restaurantId && restaurantId !== item.restaurantId && items.length > 0) {
      const confirmSwitch = window.confirm(
        "Your cart contains items from a different restaurant. Start a new cart?"
      );
      if (!confirmSwitch) return;
      setItems([]);
    }
    setRestaurantId(item.restaurantId);

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        { menuItemId: item._id, name: item.name, price: item.price, quantity, restaurantId: item.restaurantId },
      ];
    });
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i)));
  };

  const removeItem = (menuItemId) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    localStorage.removeItem("cart_items");
    localStorage.removeItem("cart_restaurantId");
  };

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, restaurantId, addItem, updateQuantity, removeItem, clearCart, totalAmount, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
