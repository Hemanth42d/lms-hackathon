import React, { useState } from "react";
import { Link } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", toLink: "#home" },
    { name: "Features", toLink: "#features" },
    { name: "Reviews", toLink: "#reviews" },
    { name: "Contact us", toLink: "#contactus" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="h-[8vh] fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                LMS NAME
              </Link>
            </div>

            {/* Desktop Navigation - Increased spacing */}
            <div className="hidden md:flex items-center space-x-12 lg:space-x-16 xl:space-x-20">
              {navLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.toLink}
                  className="relative text-gray-700 hover:text-blue-600 font-medium text-lg lg:text-xl transition-all duration-300 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-base lg:text-lg whitespace-nowrap">
                Login / SignUp
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
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
                  className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 rounded-md text-base"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md"
                >
                  Login / SignUp
                </button>
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
