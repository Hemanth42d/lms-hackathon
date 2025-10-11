import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FaArrowLeft,
  FaEnvelope,
  FaShieldAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [serverOtp, setServerOtp] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/send-password-reset-otp", {
        email,
      });

      if (response.data.success) {
        const otpFromServer = response.data.otp.toString();
        setServerOtp(otpFromServer);
        console.log("OTP received from server:", otpFromServer);
        setCurrentStep(2);
        setSuccess("OTP sent successfully to your email!");
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // OTP verification here
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const enteredOtp = otp.toString().trim();
    const serverOtpString = serverOtp.toString().trim();

    console.log("OTP verification:", {
      entered: enteredOtp,
      server: serverOtpString,
    });

    // Simulate verification delay
    setTimeout(() => {
      if (enteredOtp === serverOtpString) {
        console.log("OTP verification successful");
        setCurrentStep(3);
        setSuccess("OTP verified successfully!");
        setError("");
      } else {
        console.log("OTP verification failed");
        setError("Invalid OTP. Please check and try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Reset Password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/reset-password", {
        email,
        otp: serverOtp,
        newPassword,
      });

      if (response.data.success) {
        console.log("Password reset successful");
        setSuccess("Password reset successfully! Redirecting to login...");

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setOtp("");
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/send-password-reset-otp", {
        email,
      });

      if (response.data.success) {
        const otpFromServer = response.data.otp.toString();
        setServerOtp(otpFromServer);
        console.log("New OTP received:", otpFromServer);
        setSuccess("New OTP sent successfully!");
      } else {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get current step icon and title
  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: <FaEnvelope className="w-8 h-8 text-orange-500" />,
          title: "Forgot Password?",
          subtitle: "Enter your email address and we'll send you an OTP.",
        };
      case 2:
        return {
          icon: <FaShieldAlt className="w-8 h-8 text-orange-500" />,
          title: "Verify OTP",
          subtitle: `We've sent a 6-digit code to ${email}`,
        };
      case 3:
        return {
          icon: <FaLock className="w-8 h-8 text-orange-500" />,
          title: "Reset Password",
          subtitle: "Enter your new password below.",
        };
      default:
        return {};
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Illustration */}
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
                    {stepInfo.icon}
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

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2 w-4 h-4" />
              Back to Login
            </Link>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              EduConnect
            </Link>

            <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-900">
              {stepInfo.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{stepInfo.subtitle}</p>

            {/* Step Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step === currentStep
                      ? "bg-blue-600"
                      : step < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Forms based on current step */}
          <div className="space-y-6">
            {/* Step 1: Email Input */}
            {currentStep === 1 && (
              <form className="space-y-6" onSubmit={handleEmailSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step 2: OTP Input */}
            {currentStep === 2 && (
              <form className="space-y-6" onSubmit={handleOTPSubmit}>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength="6"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtp(value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors text-sm disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password Input */}
            {currentStep === 3 && (
              <form className="space-y-6" onSubmit={handlePasswordReset}>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showNewPassword ? (
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
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Navigation Links */}
            {currentStep === 1 && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or</span>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
