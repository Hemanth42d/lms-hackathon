import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaChalkboardTeacher,
  FaCog,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  const loginUser = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/login", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const { token, user } = response.data;
      setToken(token);
      setUser(user);

      toast.success("Login successful!");

      // Navigate based on actual role from database
      switch (formData.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "Teacher":
          navigate("/teacher/dashboard");
          break;
        case "Student":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 404) {
        toast.error("Login endpoint not found. Check your API routes.");
      } else if (error.response?.status === 401) {
        toast.error(
          "Invalid credentials. Please check your email and password."
        );
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-300/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-20 w-24 h-24 bg-yellow-300/30 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-orange-200/40 rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="max-w-md">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 transform rotate-3 hover:rotate-1 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-8 bg-blue-100 rounded w-full mt-6"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>

              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-md">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              EduConnect
            </Link>
            <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-900">
              Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Empowering education with cutting-edge tools
            </p>
          </div>
          <div className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Login As
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "Student" })
                    }
                    className={`flex items-center justify-center py-3 px-3 rounded-lg border-2 transition-all duration-300 ${
                      formData.role === "Student"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <FaUser className="mr-2 w-4 h-4" />
                    <span className="text-sm font-medium">Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "Teacher" })
                    }
                    className={`flex items-center justify-center py-3 px-3 rounded-lg border-2 transition-all duration-300 ${
                      formData.role === "Teacher"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <FaChalkboardTeacher className="mr-2 w-4 h-4" />
                    <span className="text-sm font-medium">Teacher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "admin" })}
                    className={`flex items-center justify-center py-3 px-3 rounded-lg border-2 transition-all duration-300 ${
                      formData.role === "admin"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <FaCog className="mr-2 w-4 h-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Quick Login Buttons for Testing */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">
                Quick Login (for testing):
              </p>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() =>
                    setFormData({
                      email: "admin@lms.com",
                      password: "password123",
                      role: "admin",
                    })
                  }
                  className="flex-1 px-2 py-1 bg-red-100 text-red-700 rounded"
                >
                  Admin
                </button>
                <button
                  onClick={() =>
                    setFormData({
                      email: "john.smith@lms.com",
                      password: "password123",
                      role: "Teacher",
                    })
                  }
                  className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded"
                >
                  Teacher
                </button>
                <button
                  onClick={() =>
                    setFormData({
                      email: "alice.johnson@student.com",
                      password: "password123",
                      role: "Student",
                    })
                  }
                  className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded"
                >
                  Student
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  New to EduConnect?
                </span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
