import axios from "axios";

const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

const axiosInstance = axios.create({
  baseURL: `${backendBase}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

// Automatically add JWT token to Authorization header if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.log("API Error:", error.response?.data || error.message);
      console.log("Full URL:", error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
