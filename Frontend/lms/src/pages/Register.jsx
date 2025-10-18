import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash, FaUser, FaChalkboardTeacher } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { setUser, setToken } = useAuth();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    await registerUser();
  };

  const registerUser = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/register", {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.data.success) {
        // Store user data and token in context
        setUser(response.data.user);
        setToken(response.data.token);

        console.log("User registered successfully");

        // Navigate based on role
        if (formData.role === "Student") {
          navigate("/student");
        } else if (formData.role === "Teacher") {
          navigate("/teacher");
        } else if (formData.role === "admin") {
          navigate("/admin");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
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
              <div className="w-48 h-48 bg-white/80 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm border border-white/50">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <FaUser className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              AnthroLearn
            </Link>
            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Experience innovative learning journeys
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Register Form */}
          <div className="space-y-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your full name"
                />
              </div>

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
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Create a password"
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
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "Student" })
                    }
                    className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.role === "Student"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <FaUser className="mr-2 w-4 h-4" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "Teacher" })
                    }
                    className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.role === "Teacher"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <FaChalkboardTeacher className="mr-2 w-4 h-4" />
                    Teacher
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Sign in link */}
            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
