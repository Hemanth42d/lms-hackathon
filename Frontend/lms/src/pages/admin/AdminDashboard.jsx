import React from "react";
import {
  FaUsers,
  FaBook,
  FaGraduationCap,
  FaChartLine,
  FaBell,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: FaUsers,
      color: "bg-blue-500",
    },
    {
      title: "Active Courses",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: FaBook,
      color: "bg-green-500",
    },
    {
      title: "Enrollments",
      value: "12,389",
      change: "+15%",
      trend: "up",
      icon: FaGraduationCap,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: "$84,532",
      change: "-3%",
      trend: "down",
      icon: FaChartLine,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <FaArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              {
                action: "New user registered",
                user: "John Doe",
                time: "2 minutes ago",
              },
              {
                action: "Course completed",
                user: "Jane Smith",
                time: "1 hour ago",
              },
              {
                action: "Assignment submitted",
                user: "Bob Johnson",
                time: "3 hours ago",
              },
              {
                action: "New course created",
                user: "Alice Brown",
                time: "5 hours ago",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Add User", icon: FaUsers, color: "bg-blue-500" },
              { title: "Create Course", icon: FaBook, color: "bg-green-500" },
              {
                title: "View Reports",
                icon: FaChartLine,
                color: "bg-purple-500",
              },
              {
                title: "Send Notification",
                icon: FaBell,
                color: "bg-orange-500",
              },
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <div
                  className={`${action.color} p-2 rounded-lg inline-block mb-2`}
                >
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {action.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
