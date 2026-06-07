import axiosInstance from "./axiosInstance";

// Get all user orders
export const getMyOrders = async () => {
  try {
    const response = await axiosInstance.get("/myorders/");

    return response.data;
  } catch (error) {
    console.error("Get My Orders Error:", error);

    throw (
      error.response?.data || {
        message: "Failed to fetch orders.",
      }
    );
  }
};

// Get single order details
export const getOrderDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/myorders/${id}/`);

    return response.data;
  } catch (error) {
    console.error("Get Order Details Error:", error);

    throw (
      error.response?.data || {
        message: "Failed to fetch order details.",
      }
    );
  }
};