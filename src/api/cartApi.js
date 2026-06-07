import axiosInstance from "./axiosInstance";

export const cartAPI = {
  // GET CART
  getCart: async () => {
    try {
      const response = await axiosInstance.get("/cart/");
      return response.data;
    } catch (error) {
      console.error("Get Cart Error:", error);
      throw error;
    }
  },

  // ADD TO CART
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axiosInstance.post("/cart/add/", {
        product_id: productId,
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Add To Cart Error:", error);
      throw error;
    }
  },

  // UPDATE QUANTITY
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await axiosInstance.put("/cart/update/", {
        item_id: cartItemId,
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Update Cart Item Error:", error);
      throw error;
    }
  },

  // REMOVE ITEM
removeCartItem: async (cartItemId) => {
  try {
    const response = await axiosInstance.delete("/cart/remove/", {
      data: {
        item_id: cartItemId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    throw error;
  }
},

  // CLEAR CART
  clearCart: async () => {
    try {
      const response = await axiosInstance.delete("/cart/clear/");
      return response.data;
    } catch (error) {
      console.error("Clear Cart Error:", error);
      throw error;
    }
  },
};
