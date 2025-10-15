import React from "react";
import { FaBars, FaBell } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const location = useLocation();

  const sidebarItems = [
    { title: "Dashboard", path: "/admin/dashboard" },
    { title: "User Management", path: "/admin/users" },
    { title: "Course Management", path: "/admin/courses" },
    { title: "Enrollment", path: "/admin/enrollments" },
    { title: "Assignments", path: "/admin/assignments" },
    { title: "Reports & Analytics", path: "/admin/analytics" },
    { title: "Content Management", path: "/admin/content" },
    { title: "System Settings", path: "/admin/settings" },
    { title: "Notifications", path: "/admin/notifications" },
    { title: "Support", path: "/admin/support" },
  ];

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find((item) => isActiveRoute(item.path));
    return currentItem?.title || "Admin Dashboard";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FaBars className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {getCurrentPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <FaBell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
              Quick Action
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
