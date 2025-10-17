import { NavLink, useNavigate } from "react-router";
import {
  FaTachometerAlt,
  FaBook,
  FaGraduationCap,
  FaEnvelope,
  FaCog,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

const StudentSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: <FaTachometerAlt className="w-5 h-5" />,
    },
    {
      name: "Courses",
      path: "/student/courses",
      icon: <FaBook className="w-5 h-5" />,
    },
    {
      name: "My Courses",
      path: "/student/my-courses",
      icon: <FaGraduationCap className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/student/settings",
      icon: <FaCog className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    // For example: clear tokens, call logout API, etc.
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // You can also call your logout API here
      // await axiosInstance.post("/logout");
      navigate("/login");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">EduHub</h2>
        </div>

        {/* Menu Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-gray-200 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 w-full"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
