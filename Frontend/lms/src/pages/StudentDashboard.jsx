import { FaBook, FaClipboardList, FaEnvelope, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/StudentDashboard/StatsCard";
import AssignmentsTable from "../components/StudentDashboard/AssignmentsTable";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchMy = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/my-courses", { params: { userId: user?._id } });
        if (!isMounted) return;
        setMyCourses(Array.isArray(data?.courses) ? data.courses : []);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (user?._id) fetchMy();
    const refresh = () => fetchMy();
    window.addEventListener("enrollment-updated", refresh);
    return () => {
      isMounted = false;
      window.removeEventListener("enrollment-updated", refresh);
    };
  }, [user?._id]);

  const stats = useMemo(() => {
    const active = myCourses.filter((c) => c.status === "In Progress").length;
    const completed = myCourses.filter((c) => c.status === "Completed").length;
    const upcoming = 0; // placeholder until calendar/events exist
    const messages = 0; // can be wired to real backend later
    return [
      { title: "Active Courses", value: String(active), icon: <FaBook className="w-6 h-6 text-blue-600" />, bgColor: "bg-blue-100" },
      { title: "Completed", value: String(completed), icon: <FaClipboardList className="w-6 h-6 text-orange-600" />, bgColor: "bg-orange-100" },
      { title: "Messages", value: String(messages), icon: <FaEnvelope className="w-6 h-6 text-green-600" />, bgColor: "bg-green-100" },
      { title: "Upcoming Events", value: String(upcoming), icon: <FaCalendarAlt className="w-6 h-6 text-purple-600" />, bgColor: "bg-purple-100" },
    ];
  }, [myCourses]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your learning overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* My Courses Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          <button
            onClick={() => navigate("/student/my-courses")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] duration-200"
          >
            <span>View All Courses</span>
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {myCourses.slice(0, 3).map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-40">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{course.lessonsCompleted} / {course.totalLessons} lessons</span>
                    <span className="font-semibold text-blue-600">{course.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {myCourses.length === 0 && !loading && (
            <div className="text-gray-600">No enrolled courses yet.</div>
          )}
        </div>
      </div>

      {/* Assignments Section (renders when assignments are available) */}
      {assignments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assignments</h2>
          <AssignmentsTable assignments={assignments} />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
