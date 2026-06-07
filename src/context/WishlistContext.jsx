import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useAuth } from "./AuthContext";
import {
  getWishlist,
  addWishlist,
  removeWishlist,
  clearWishlistAPI,
} from "../api/wishlistAPI";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const wishlistCount = wishlistItems.length;

  // 🔄 FETCH WISHLIST
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    try {
      setLoading(true);

      const data = await getWishlist();

      setWishlistItems(data.items || []);
    } catch (error) {
      // console.error("Fetch Wishlist Error:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // 📦 LOAD ON LOGIN
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, authLoading, fetchWishlist]);

  // 🔔 NOTIFICATION
  const showNotification = useCallback((msg) => {
    setNotification(msg);

    setTimeout(() => {
      setNotification(null);
    }, 2000);
  }, []);

  // ❌ Hide notification (exposed for global Notification component)
  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // ➕ ADD
  const addToWishlist = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        showNotification("Please login first ❤️");
        return;
      }

      try {
        setLoading(true);
        await addWishlist(product.id);
        await fetchWishlist();
        showNotification("Added to wishlist ❤️");
      } catch (error) {
        // console.error("Add Wishlist Error:", error);
        showNotification("Failed to add item");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchWishlist, showNotification],
  );

  // ❌ REMOVE
  const removeFromWishlist = useCallback(
    async (itemId) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        await removeWishlist(itemId);
        await fetchWishlist();

        showNotification("Removed from wishlist");
      } catch (error) {
        // console.error("Remove Wishlist Error:", error);
        showNotification("Failed to remove item");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchWishlist, showNotification],
  );

  // 🔁 TOGGLE
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => item.food_item.id === productId);
    },
    [wishlistItems],
  );

  const toggleWishlist = useCallback(
    async (product) => {
      const exists = wishlistItems.find(
        (item) => item.food_item.id === product.id,
      );

      if (exists) {
        await removeFromWishlist(exists.id);
      } else {
        await addToWishlist(product);
      }
    },
    [wishlistItems, addToWishlist, removeFromWishlist],
  );

  // 🧹 CLEAR
  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);

      await clearWishlistAPI();
      setWishlistItems([]);

      showNotification("Wishlist cleared");
    } catch (error) {
      // console.error("Clear Wishlist Error:", error);
      showNotification("Failed to clear wishlist");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, showNotification]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        notification,
        hideNotification,

        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
