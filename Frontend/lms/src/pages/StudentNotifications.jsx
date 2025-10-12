import { useState } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaFilter,
  FaCheckDouble,
  FaClock,
  FaExclamationCircle,
  FaInfoCircle,
  FaGraduationCap,
  FaCalendarAlt,
} from "react-icons/fa";

const StudentNotifications = () => {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "assignment",
      title: "New Assignment Posted",
      message:
        "Project 1: Data Analysis has been posted in Introduction to Data Science",
      course: "Introduction to Data Science",
      time: "2 hours ago",
      read: false,
      icon: <FaGraduationCap className="w-5 h-5" />,
      color: "blue",
    },
    {
      id: 2,
      type: "deadline",
      title: "Assignment Due Soon",
      message: "Problem Set 3 is due in 2 days for Advanced Calculus",
      course: "Advanced Calculus",
      time: "5 hours ago",
      read: false,
      icon: <FaClock className="w-5 h-5" />,
      color: "orange",
    },
    {
      id: 3,
      type: "grade",
      title: "Grade Posted",
      message: "Your grade for Campaign Proposal has been posted",
      course: "Digital Marketing Fundamentals",
      time: "1 day ago",
      read: true,
      icon: <FaCheckDouble className="w-5 h-5" />,
      color: "green",
    },
    {
      id: 4,
      type: "announcement",
      title: "Course Announcement",
      message: "New study materials have been uploaded to the course resources",
      course: "Web Development Bootcamp",
      time: "1 day ago",
      read: false,
      icon: <FaInfoCircle className="w-5 h-5" />,
      color: "purple",
    },
    {
      id: 5,
      type: "event",
      title: "Live Session Scheduled",
      message: "Live Q&A session scheduled for tomorrow at 3 PM",
      course: "Machine Learning Fundamentals",
      time: "2 days ago",
      read: true,
      icon: <FaCalendarAlt className="w-5 h-5" />,
      color: "indigo",
    },
    {
      id: 6,
      type: "deadline",
      title: "Submission Reminder",
      message: "Don't forget to submit your final project by Friday",
      course: "Data Science with Python",
      time: "2 days ago",
      read: true,
      icon: <FaExclamationCircle className="w-5 h-5" />,
      color: "red",
    },
    {
      id: 7,
      type: "assignment",
      title: "New Quiz Available",
      message: "Module 5 Quiz is now available",
      course: "Financial Modeling and Analysis",
      time: "3 days ago",
      read: true,
      icon: <FaGraduationCap className="w-5 h-5" />,
      color: "blue",
    },
    {
      id: 8,
      type: "grade",
      title: "Feedback Available",
      message: "Instructor feedback is available for your recent submission",
      course: "Graphic Design Masterclass",
      time: "4 days ago",
      read: true,
      icon: <FaCheckDouble className="w-5 h-5" />,
      color: "green",
    },
  ]);

  const filterCategories = [
    "All",
    "Unread",
    "Assignments",
    "Grades",
    "Announcements",
  ];

  const getFilteredNotifications = () => {
    switch (filter) {
      case "Unread":
        return notifications.filter((n) => !n.read);
      case "Assignments":
        return notifications.filter(
          (n) => n.type === "assignment" || n.type === "deadline"
        );
      case "Grades":
        return notifications.filter((n) => n.type === "grade");
      case "Announcements":
        return notifications.filter(
          (n) => n.type === "announcement" || n.type === "event"
        );
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAllRead = () => {
    setNotifications(notifications.filter((n) => !n.read));
  };

  const getColorClasses = (color, read) => {
    const opacity = read ? "bg-opacity-50" : "bg-opacity-100";
    switch (color) {
      case "blue":
        return `bg-blue-100 ${opacity} text-blue-600`;
      case "orange":
        return `bg-orange-100 ${opacity} text-orange-600`;
      case "green":
        return `bg-green-100 ${opacity} text-green-600`;
      case "purple":
        return `bg-purple-100 ${opacity} text-purple-600`;
      case "indigo":
        return `bg-indigo-100 ${opacity} text-indigo-600`;
      case "red":
        return `bg-red-100 ${opacity} text-red-600`;
      default:
        return `bg-gray-100 ${opacity} text-gray-600`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Notifications
            </h1>
            <p className="text-gray-600">
              Stay updated with your courses and assignments
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <FaCheckDouble className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={clearAllRead}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              <FaTrash className="w-4 h-4" />
              <span>Clear Read</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {notifications.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unread</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {unreadCount}
              </h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaExclamationCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Today</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {notifications.filter((n) => n.time.includes("hour")).length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaClock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <FaFilter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                filter === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
              {category === "Unread" && unreadCount > 0 && (
                <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">
              {filter === "Unread"
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications in this category."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                !notification.read ? "border-l-4 border-blue-600" : ""
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClasses(
                        notification.color,
                        notification.read
                      )}`}
                    >
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3
                          className={`font-semibold ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      <p
                        className={`text-sm mb-2 ${
                          !notification.read ? "text-gray-700" : "text-gray-500"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="font-medium">
                          {notification.course}
                        </span>
                        <span>•</span>
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;
