import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaGraduationCap,
  FaBook,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaUserShield,
  FaClipboardList,
  FaBell,
  FaFileAlt,
  FaQuestionCircle,
  FaUserCog,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: FaTachometerAlt,
      path: "/admin/dashboard",
      color: "text-blue-600",
    },
    {
      title: "User Management",
      icon: FaUsers,
      path: "/admin/users",
      color: "text-green-600",
      subItems: [
        { title: "All Users", path: "/admin/users/all" },
        { title: "Students", path: "/admin/users/students" },
        { title: "Teachers", path: "/admin/users/teachers" },
        { title: "Add User", path: "/admin/users/add" },
      ],
    },
    {
      title: "Course Management",
      icon: FaBook,
      path: "/admin/courses",
      color: "text-purple-600",
      subItems: [
        { title: "All Courses", path: "/admin/courses/all" },
        { title: "Create Course", path: "/admin/courses/create" },
        { title: "Categories", path: "/admin/courses/categories" },
      ],
    },
    {
      title: "Enrollment",
      icon: FaGraduationCap,
      path: "/admin/enrollments",
      color: "text-indigo-600",
    },
    {
      title: "Assignments",
      icon: FaClipboardList,
      path: "/admin/assignments",
      color: "text-orange-600",
    },
    {
      title: "Reports & Analytics",
      icon: FaChartBar,
      path: "/admin/analytics",
      color: "text-cyan-600",
      subItems: [
        { title: "User Analytics", path: "/admin/analytics/users" },
        { title: "Course Analytics", path: "/admin/analytics/courses" },
        { title: "Performance Reports", path: "/admin/analytics/performance" },
      ],
    },
    {
      title: "Content Management",
      icon: FaFileAlt,
      path: "/admin/content",
      color: "text-pink-600",
    },
    {
      title: "System Settings",
      icon: FaCog,
      path: "/admin/settings",
      color: "text-gray-600",
      subItems: [
        { title: "General Settings", path: "/admin/settings/general" },
        { title: "Email Settings", path: "/admin/settings/email" },
        { title: "Backup & Restore", path: "/admin/settings/backup" },
      ],
    },
    {
      title: "Notifications",
      icon: FaBell,
      path: "/admin/notifications",
      color: "text-yellow-600",
    },
    {
      title: "Support",
      icon: FaQuestionCircle,
      path: "/admin/support",
      color: "text-red-600",
    },
  ];

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const SidebarItem = ({ item }) => {
    const [showSubItems, setShowSubItems] = useState(false);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = isActiveRoute(item.path);

    return (
      <div className="mb-1">
        <div
          onClick={() => {
            if (hasSubItems) {
              setShowSubItems(!showSubItems);
            } else {
              navigate(item.path);
              onClose();
            }
          }}
          className={`
            flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
            ${
              isActive
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-r-3 border-blue-500 text-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }
          `}
        >
          <item.icon
            className={`w-5 h-5 ${
              isActive ? "text-blue-600" : item.color
            } transition-colors duration-200`}
          />
          <span className="ml-3 font-medium">{item.title}</span>
          {hasSubItems && (
            <FaChevronDown
              className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                showSubItems ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        {/* Sub Items */}
        {hasSubItems && showSubItems && (
          <div className="ml-8 mt-2 space-y-1">
            {item.subItems.map((subItem, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(subItem.path);
                  onClose();
                }}
                className={`
                  flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    isActiveRoute(subItem.path)
                      ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                <span className="text-sm font-medium">{subItem.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FaUserShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">
                  Learning Management System
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarItems.map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUserCog className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">administrator@lms.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <FaSignOutAlt className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
