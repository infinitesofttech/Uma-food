import axios from "axios";
import { BASE_URL } from "../utils/format";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

// CSRF helper
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Attach CSRF token for POST/PUT/PATCH/DELETE
axiosInstance.interceptors.request.use((config) => {
  const method = (config.method || "").toUpperCase();

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrftoken = getCookie("csrftoken");

    if (csrftoken) {
      config.headers["X-CSRFToken"] = csrftoken;
    }
  }

  return config;
});

export default axiosInstance;