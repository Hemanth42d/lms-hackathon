import React, { useState } from "react";
import { Link } from "react-router";
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset email sent to:", email);
    setIsSubmitted(true);
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
                    <FaEnvelope className="w-8 h-8 text-orange-500" />
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

            {!isSubmitted ? (
              <>
                <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-900">
                  Forgot Password?
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  No worries! Enter your email address and we'll send you a
                  reset link.
                </p>
              </>
            ) : (
              <>
                <div className="mt-6 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900">
                  Check Your Email
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
              </>
            )}
          </div>
          {!isSubmitted ? (
            <div className="space-y-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  Send Reset Link
                </button>
              </form>

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
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <button
                  onClick={() => window.open("mailto:", "_blank")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  Open Email App
                </button>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Try Different Email
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive the email? Check your spam folder or
                </p>
                <button
                  onClick={() => {
                    console.log("Resending email to:", email);
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors text-sm"
                >
                  Resend Reset Link
                </button>
              </div>
              <div className="text-center pt-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
