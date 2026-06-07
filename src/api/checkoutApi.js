import axiosInstance from "./axiosInstance";

// CREATE ORDER (Checkout)
export const createOrder = async (payload) => {
  try {
    const res = await axiosInstance.post("/checkout/", payload);
    return res.data;
  } catch (error) {
    console.error("Checkout Error:", error);
    throw error;
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (payload) => {
  try {
    const res = await axiosInstance.post("/verify-payment/", payload);
    return res.data;
  } catch (error) {
    console.error("Verify Payment Error:", error);
    throw error;
  }
};