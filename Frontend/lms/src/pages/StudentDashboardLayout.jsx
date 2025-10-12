import { useState } from "react";
import { Outlet } from "react-router";
import StudentSidebar from "../components/StudentDashboard/StudentSidebar";
import StudentNavbar from "../components/StudentDashboard/StudentNavbar";

const StudentDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <StudentNavbar toggleSidebar={toggleSidebar} />

      <div className="flex pt-16">
        {/* Fixed Sidebar */}
        <StudentSidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 transition-all duration-300">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default StudentDashboardLayout;
