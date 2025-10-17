import { FaBars, FaSearch, FaBell, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router";

const StudentNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <FaBars className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              EduHub
            </span>
          </div>
        </div>

        {/* Search Bar - Hidden on small screens */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Icon for Mobile */}
          <button className="md:hidden text-gray-600 hover:text-gray-900">
            <FaSearch className="w-5 h-5" />
          </button>

          {/* Notifications - Links to Notifications Page */}
          <button
            onClick={() => navigate("/student/notifications")}
            className="relative text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
          >
            <FaBell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
              3
            </span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src="https://ui-avatars.com/api/?name=Student+User&background=3b82f6&color=fff"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
