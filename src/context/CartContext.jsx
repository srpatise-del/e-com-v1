import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadGuestCart = () => {
    const stored = localStorage.getItem("guestCart");
    setCartItems(stored ? JSON.parse(stored) : []);
  };

  const persistGuestCart = (items) => {
    localStorage.setItem("guestCart", JSON.stringify(items));
    setCartItems(items);
  };

  const fetchCart = async () => {
    // ผู้ใช้ที่ยังไม่ล็อกอินจะใช้ตะกร้าใน localStorage แทนฐานข้อมูล
    if (!user) {
      loadGuestCart();
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCartItems(data.items || []);
    } catch (error) {
      console.error("โหลดตะกร้าไม่สำเร็จ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      const existing = cartItems.find((item) => item.productId === product._id);
      const updated = existing
        ? cartItems.map((item) =>
            item.productId === product._id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...cartItems, { productId: product._id, quantity, product }];
      persistGuestCart(updated);
      return;
    }

    await api.post("/cart", { productId: product._id, quantity });
    await fetchCart();
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) {
      const updated = cartItems
        .map((item) => (item.productId === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);
      persistGuestCart(updated);
      return;
    }

    await api.put(`/cart/${itemId}`, { quantity });
    await fetchCart();
  };

  const removeFromCart = async (itemId) => {
    if (!user) {
      const updated = cartItems.filter((item) => item.productId !== itemId);
      persistGuestCart(updated);
      return;
    }

    await api.delete(`/cart/${itemId}`);
    await fetchCart();
  };

  const clearCart = () => {
    localStorage.removeItem("guestCart");
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => {
    const price = item.product?.price || item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      total,
      loading,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }),
    [cartItems, cartCount, total, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
