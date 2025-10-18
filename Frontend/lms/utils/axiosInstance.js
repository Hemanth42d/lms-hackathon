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
    // Enhanced error handling for production
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;

    // Log errors in development
    if (import.meta.env.DEV) {
      console.log("API Error:", error.response?.data || error.message);
      console.log("Full URL:", error.config?.url);
      console.log("Status Code:", statusCode);
    }

    // Handle specific error cases
    if (statusCode === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/login";
      }
    } else if (statusCode === 404) {
      console.error("Resource not found:", error.config?.url);
    } else if (statusCode >= 500) {
      console.error("Server error:", errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
