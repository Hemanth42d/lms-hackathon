import React, { useState } from "react";
import { Link } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", toLink: "#home" },
    { name: "Features", toLink: "#features" },
    { name: "Pricing", toLink: "#pricing" },
    { name: "Support", toLink: "#support" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="h-[8vh] fixed top-0 w-full bg-white z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                AnthroLearn
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.toLink}
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm lg:text-base transition-colors duration-300 px-3 py-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <button className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md">
                  Explore Demo
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
              >
                {isMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-80 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.toLink}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-200 rounded-md"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg transition-all duration-300">
                    Login
                  </button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-sm">
                    Explore Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-[8vh]"></div>
    </>
  );
};

export default LandingNavbar;
