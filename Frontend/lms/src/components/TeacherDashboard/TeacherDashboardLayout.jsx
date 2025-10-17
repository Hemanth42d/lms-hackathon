import { useState } from "react";
import { Outlet } from "react-router";
import { FaBell, FaBars } from "react-icons/fa";
import TeacherSidebar from "./TeacherSidebar";
import { useAuth } from "../../../context/AuthContext";

const TeacherDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Get teacher data from auth context
  const teacherData = {
    name: user?.userName || "Teacher",
    title: "Teacher",
    avatar:
      user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.userName || "Teacher"
      )}&size=200&background=3b82f6&color=fff`,
    email: user?.email || "teacher@example.com",
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <TeacherSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <FaBars className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-gray-900">
                Teacher Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <img
                src={teacherData.avatar}
                alt={teacherData.name}
                className="w-8 h-8 rounded-full border border-gray-200"
              />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {teacherData.name.split(" ")[1]}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your courses today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative transition-colors">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <img
                  src={teacherData.avatar}
                  alt={teacherData.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
                <div className="hidden xl:block">
                  <p className="text-sm font-medium text-gray-900">
                    {teacherData.name}
                  </p>
                  <p className="text-xs text-gray-500">{teacherData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboardLayout;
