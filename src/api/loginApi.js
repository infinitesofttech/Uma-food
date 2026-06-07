import axiosInstance from "./axiosInstance";

// STEP 1: Send OTP
export const loginUser = async (credentials) => {
  const res = await axiosInstance.post(
    "/",
    credentials
  );

  return res.data;
};

// Get User
export const getUser = async () => {
  try {
    const res = await axiosInstance.get("/user/");
    return res.data;
  } catch (error) {
    if (error.response?.status !== 401) {
      // console.error("Get User Error:", error);
    }
    throw (
      error.response?.data || {
        message: "Failed to fetch user details.",
      }
    );
  }
};

// Check Admin
export const checkAdmin = async () => {
  try {
    const res = await axiosInstance.get("/admin/check-admin/");

    return res.data;
  } catch (error) {
    console.error("Check Admin Error:", error);

    throw (
      error.response?.data || {
        message: "Failed to check admin status.",
      }
    );
  }
};

// Logout
export const logoutAPI = async () => {
  try {
    const res = await axiosInstance.post("/logout/");
    return res.data;
  } catch (error) {
    console.error("Logout Error:", error);

    throw (
      error.response?.data || {
        message: "Logout failed.",
      }
    );
  }
};