import axiosInstance from "./axiosInstance";


// GET WISHLIST
export const getWishlist = async () => {
  try {
    const response = await axiosInstance.get("/wishlist/");
    return response.data;
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    throw (
      error.response?.data || {
        message: "Failed to fetch wishlist.",
      }
    );
  }
};

// ADD TO WISHLIST
export const addWishlist = async (productId) => {
  try {
    const response = await axiosInstance.post(
      "/add-wishlist/",
      {
        product_id: productId,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Add Wishlist Error:", error);

    throw (
      error.response?.data || {
        message: "Failed to add item to wishlist.",
      }
    );
  }
};

// REMOVE FROM WISHLIST
export const removeWishlist = async (itemId) => {
  try {
    const response = await axiosInstance.delete(
      `/remove-wishlist/${itemId}/`
    );

    return response.data;
  } catch (error) {
    console.error("Remove Wishlist Error:", error);

    throw (
      error.response?.data || {
        message: "Failed to remove item from wishlist.",
      }
    );
  }
};

// CLEAR WISHLIST
export const clearWishlistAPI = async () => {
  try {
    const response = await axiosInstance.delete(
      "/clear-wishlist/"
    );

    return response.data;
  } catch (error) {
    console.error("Clear Wishlist Error:", error);

    throw (
      error.response?.data || {
        message: "Failed to clear wishlist.",
      }
    );
  }
};