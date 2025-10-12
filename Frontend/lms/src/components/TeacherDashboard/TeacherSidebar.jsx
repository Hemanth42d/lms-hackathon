import { useLocation, useNavigate } from "react-router";
import {
  FaHome,
  FaBookOpen,
  FaUsers,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaGraduationCap,
  FaCalendarAlt,
  FaComments,
} from "react-icons/fa";

const TeacherSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Sample teacher data
  const teacherData = {
    name: "Dr. Sarah Johnson",
    title: "Computer Science Professor",
    avatar:
      "https://ui-avatars.com/api/?name=Dr+Sarah+Johnson&size=200&background=3b82f6&color=fff",
  };

  const sidebarItems = [
    {
      name: "Dashboard",
      path: "/teacher/dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: "My Courses",
      path: "/teacher/courses",
      icon: <FaBookOpen className="w-5 h-5" />,
    },
    {
      name: "Messages",
      path: "/teacher/messages",
      icon: <FaComments className="w-5 h-5" />,
    },
    {
      name: "Profile",
      path: "/teacher/profile",
      icon: <FaUser className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/teacher/settings",
      icon: <FaCog className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FaGraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">EduPlatform</h1>
              <p className="text-xs text-gray-500">Teacher Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        {/* Teacher Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={teacherData.avatar}
              alt={teacherData.name}
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {teacherData.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {teacherData.title}
              </p>
            </div>
          </div>
        </div>
        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span
                  className={`mr-3 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
                {item.name === "Messages" && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        {/* Bottom Section - Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;
