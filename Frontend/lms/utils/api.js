const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
}/api`;

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(options.token),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API call failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: (token) =>
    apiCall("/profile", {
      method: "GET",
      token,
    }),

  // Update user profile
  updateProfile: (profileData, token) =>
    apiCall("/profile", {
      method: "PUT",
      token,
      body: JSON.stringify(profileData),
    }),

  // Change password
  changePassword: (passwordData, token) =>
    apiCall("/change-password", {
      method: "POST",
      token,
      body: JSON.stringify(passwordData),
    }),
};

export default apiCall;
