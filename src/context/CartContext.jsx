import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { useAuth } from "./AuthContext";
import { cartAPI } from "../api/cartApi";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 Transform backend data → frontend format
  const transformCartData = (backendCart) => {
    if (!backendCart?.items) return [];

    return backendCart.items.map((item) => ({
      id: item.id,
      ...item.product || item.food_item, // flexible backend support
      quantity: item.quantity,
      cartItemId: item.id,
    }));
  };

  // 📦 GET CART
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    try {
      setLoading(true);

      const data = await cartAPI.getCart();
      const items = transformCartData(data);

      setCartItems(items);
    } catch (error) {
      // console.error("Fetch Cart Error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // 🔁 Auto load cart on login/logout
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, authLoading, fetchCart]);

  // 🔔 Notification helper
  const showNotification = useCallback((message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 2500);
  }, []);

  // ❌ Hide notification (exposed for global Notification component)
  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // ➕ ADD TO CART
  const addToCart = useCallback(
    async (product, quantity = 1) => {
      if (!isAuthenticated) {
        showNotification("Please login to add items to cart");
        return;
      }

      try {
        setLoading(true);

        await cartAPI.addToCart(product.id, quantity);
        await fetchCart();

        showNotification(`${product.name} added to cart`);
      } catch (error) {
        // console.error("Add Cart Error:", error);
        showNotification("Failed to add item");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchCart, showNotification]
  );

  // ❌ REMOVE ITEM
  const removeFromCart = useCallback(
    async (cartItemId) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        await cartAPI.removeCartItem(cartItemId);
        await fetchCart();

        showNotification("Item removed from cart");
      } catch (error) {
        // console.error("Remove Cart Error:", error);
        showNotification("Failed to remove item");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchCart, showNotification]
  );

  // 🔢 UPDATE QUANTITY
  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      if (!isAuthenticated) return;

      if (quantity <= 0) {
        return removeFromCart(cartItemId);
      }

      try {
        setLoading(true);

        await cartAPI.updateCartItem(cartItemId, quantity);
        await fetchCart();
      } catch (error) {
        console.error("Update Cart Error:", error);
        showNotification("Failed to update quantity");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchCart, removeFromCart, showNotification]
  );

  // 🧹 CLEAR CART
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);

      await cartAPI.clearCart();
      setCartItems([]);

      showNotification("Cart cleared");
    } catch (error) {
      // console.error("Clear Cart Error:", error);
      showNotification("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, showNotification]);

  // 📊 CALCULATIONS
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        notification,
        hideNotification,
        loading,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;