import { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaUsers,
  FaClipboardList,
  FaClock,
  FaChartLine,
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaBell,
  FaGraduationCap,
  FaPlus,
  FaEdit,
} from "react-icons/fa";

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data
  const sampleData = {
    stats: {
      totalCourses: 8,
      totalStudents: 245,
      activeAssignments: 12,
      pendingSubmissions: 38,
    },
    recentActivity: [
      {
        id: 1,
        type: "submission",
        student: "John Smith",
        course: "Data Structures",
        assignment: "Binary Tree Implementation",
        timestamp: "2 hours ago",
        status: "pending",
        avatar:
          "https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff",
      },
      {
        id: 2,
        type: "submission",
        student: "Emma Davis",
        course: "Machine Learning",
        assignment: "Neural Network Project",
        timestamp: "4 hours ago",
        status: "graded",
        grade: "A-",
        avatar:
          "https://ui-avatars.com/api/?name=Emma+Davis&background=f59e0b&color=fff",
      },
      {
        id: 3,
        type: "enrollment",
        student: "Mike Chen",
        course: "Web Development",
        timestamp: "1 day ago",
        status: "new",
        avatar:
          "https://ui-avatars.com/api/?name=Mike+Chen&background=ef4444&color=fff",
      },
      {
        id: 4,
        type: "submission",
        student: "Lisa Rodriguez",
        course: "Database Design",
        assignment: "E-commerce Database Schema",
        timestamp: "1 day ago",
        status: "late",
        avatar:
          "https://ui-avatars.com/api/?name=Lisa+Rodriguez&background=8b5cf6&color=fff",
      },
    ],
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setDashboardData(sampleData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading skeleton components
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  const ActivitySkeleton = () => (
    <div className="flex items-center space-x-4 p-4 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-16 h-6 bg-gray-200 rounded"></div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "graded":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-red-100 text-red-800";
      case "new":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "submission":
        return <FaClipboardList className="w-4 h-4" />;
      case "enrollment":
        return <FaGraduationCap className="w-4 h-4" />;
      default:
        return <FaBell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))
          : [
              {
                title: "Total Courses",
                value: dashboardData?.stats.totalCourses,
                icon: <FaBookOpen className="w-6 h-6" />,
                bgColor: "bg-blue-50",
                textColor: "text-blue-600",
              },
              {
                title: "Total Students",
                value: dashboardData?.stats.totalStudents,
                icon: <FaUsers className="w-6 h-6" />,
                bgColor: "bg-green-50",
                textColor: "text-green-600",
              },
              {
                title: "Active Assignments",
                value: dashboardData?.stats.activeAssignments,
                icon: <FaClipboardList className="w-6 h-6" />,
                bgColor: "bg-purple-50",
                textColor: "text-purple-600",
              },
              {
                title: "Pending Submissions",
                value: dashboardData?.stats.pendingSubmissions,
                icon: <FaClock className="w-6 h-6" />,
                bgColor: "bg-orange-50",
                textColor: "text-orange-600",
              },
            ].map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <div className={stat.textColor}>{stat.icon}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex items-center text-sm text-green-600">
                    <FaChartLine className="w-4 h-4 mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              {
                title: "Create New Course",
                icon: <FaPlus className="w-4 h-4" />,
                color: "bg-blue-500",
              },
              {
                title: "Grade Submissions",
                icon: <FaEdit className="w-4 h-4" />,
                color: "bg-green-500",
              },
              {
                title: "Send Announcement",
                icon: <FaBell className="w-4 h-4" />,
                color: "bg-purple-500",
              },
            ].map((action) => (
              <button
                key={action.title}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`${action.color} p-2 rounded-lg text-white`}>
                  {action.icon}
                </div>
                <span className="font-medium text-gray-900">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <ActivitySkeleton key={index} />
                ))
              : dashboardData?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={activity.avatar}
                          alt={activity.student}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                          <div className="text-gray-600">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.student}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            {activity.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.type === "submission" && (
                            <>
                              Submitted{" "}
                              <span className="font-medium">
                                {activity.assignment}
                              </span>{" "}
                              for{" "}
                              <span className="font-medium">
                                {activity.course}
                              </span>
                              {activity.grade && (
                                <span className="ml-2 text-green-600 font-medium">
                                  Grade: {activity.grade}
                                </span>
                              )}
                            </>
                          )}
                          {activity.type === "enrollment" && (
                            <>
                              Enrolled in{" "}
                              <span className="font-medium">
                                {activity.course}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <FaCalendarAlt className="w-3 h-3 mr-1" />
                          {activity.timestamp}
                        </span>
                        {activity.type === "submission" && (
                          <div className="flex space-x-1">
                            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                              <FaDownload className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
