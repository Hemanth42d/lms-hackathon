import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaBook,
} from "react-icons/fa";

const StudentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);

  // Sample events
  const events = [
    {
      id: 1,
      title: "Data Science - Live Session",
      date: "2024-10-15",
      time: "10:00 AM - 11:30 AM",
      type: "class",
      location: "Online",
      course: "Introduction to Data Science",
      color: "blue",
    },
    {
      id: 2,
      title: "Assignment Due: Problem Set 3",
      date: "2024-10-20",
      time: "11:59 PM",
      type: "assignment",
      course: "Advanced Calculus",
      color: "orange",
    },
    {
      id: 3,
      title: "Project Submission",
      date: "2024-10-25",
      time: "11:59 PM",
      type: "assignment",
      course: "Web Development Bootcamp",
      color: "red",
    },
    {
      id: 4,
      title: "Marketing - Guest Lecture",
      date: "2024-10-18",
      time: "2:00 PM - 3:30 PM",
      type: "event",
      location: "Room 301",
      course: "Digital Marketing Fundamentals",
      color: "green",
    },
    {
      id: 5,
      title: "Mid-term Exam",
      date: "2024-10-22",
      time: "9:00 AM - 11:00 AM",
      type: "exam",
      location: "Online",
      course: "Financial Modeling",
      color: "purple",
    },
  ];

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Check if date has events
  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event) => event.date === dateStr);
  };

  // Check if date is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Get events for selected date
  const selectedDateEvents = getEventsForDate(selectedDate.getDate());

  const getEventIcon = (type) => {
    switch (type) {
      case "class":
        return <FaVideo className="w-4 h-4" />;
      case "assignment":
        return <FaBook className="w-4 h-4" />;
      case "exam":
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaMapMarkerAlt className="w-4 h-4" />;
    }
  };

  const getEventColorClass = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      orange: "bg-orange-100 text-orange-700 border-orange-300",
      red: "bg-red-100 text-red-700 border-red-300",
      green: "bg-green-100 text-green-700 border-green-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Calendar
            </h1>
            <p className="text-gray-600">
              View your schedule and upcoming events
            </p>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {formatMonthYear(currentDate)}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToToday}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayEvents = getEventsForDate(day);
                const isTodayDate = isToday(day);
                const isSelectedDate = isSelected(day);

                return (
                  <button
                    key={day}
                    onClick={() =>
                      setSelectedDate(
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        )
                      )
                    }
                    className={`aspect-square p-2 rounded-lg border-2 transition-all hover:border-blue-300 ${
                      isSelectedDate
                        ? "border-blue-600 bg-blue-50"
                        : isTodayDate
                        ? "border-blue-400 bg-blue-50"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <span
                        className={`text-sm font-semibold mb-1 ${
                          isTodayDate
                            ? "text-blue-600"
                            : isSelectedDate
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                event.color === "blue"
                                  ? "bg-blue-500"
                                  : event.color === "orange"
                                  ? "bg-orange-500"
                                  : event.color === "red"
                                  ? "bg-red-500"
                                  : event.color === "green"
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                              }`}
                            ></div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{dayEvents.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {formatDate(selectedDate)}
            </h3>

            {/* Events List */}
            <div className="space-y-3">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <FaClock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No events scheduled</p>
                </div>
              ) : (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-l-4 ${getEventColorClass(
                      event.color
                    )}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{getEventIcon(event.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs mb-1 opacity-90">
                          {event.course}
                        </p>
                        <div className="flex items-center space-x-2 text-xs opacity-75">
                          <FaClock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-2 text-xs opacity-75 mt-1">
                            <FaMapMarkerAlt className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Upcoming Events */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Upcoming This Week
              </h4>
              <div className="space-y-2">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-2 text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        event.color === "blue"
                          ? "bg-blue-500"
                          : event.color === "orange"
                          ? "bg-orange-500"
                          : event.color === "red"
                          ? "bg-red-500"
                          : event.color === "green"
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}
                    ></div>
                    <span className="flex-1 truncate text-gray-700">
                      {event.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.date.split("-")[2]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Events
              </p>
              <h3 className="text-3xl font-bold text-gray-900">
                {events.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaClock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Classes</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {events.filter((e) => e.type === "class").length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaVideo className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Assignments
              </p>
              <h3 className="text-3xl font-bold text-gray-900">
                {events.filter((e) => e.type === "assignment").length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaBook className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Exams</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {events.filter((e) => e.type === "exam").length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaClock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Simple Modal for Add Event (Optional) */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Event</h3>
            <p className="text-gray-600 mb-6">
              Event creation functionality coming soon!
            </p>
            <button
              onClick={() => setShowEventModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCalendar;
