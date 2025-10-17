
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaClock,
  FaChartLine,
  FaPlus,
  FaPlay,
  FaCheckCircle,
  FaTrophy,
  FaFire,
} from "react-icons/fa";
import CourseCardDetailed from "../../components/StudentDashboard/CourseCardDetailed";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

const StudentMyCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with real authenticated user id from auth context/cookie
        const userId = user?._id;
        const { data } = await axiosInstance.get(`/my-courses`, {
          params: { userId },
        });
        if (!isMounted) return;
        const list = Array.isArray(data?.courses) ? data.courses : [];
        setEnrolledCourses(list);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.response?.data?.message || e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMyCourses();
    const refresh = () => fetchMyCourses();
    window.addEventListener("enrollment-updated", refresh);
    return () => {
      isMounted = false;
      window.removeEventListener("enrollment-updated", refresh);
    };
  }, [user?._id]);

  const filteredCourses = useMemo(() => enrolledCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "All" || course.status === filterStatus;

    return matchesSearch && matchesFilter;
  }), [enrolledCourses, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter((c) => c.status === "In Progress").length,
    completed: enrolledCourses.filter((c) => c.status === "Completed").length,
    totalHours: enrolledCourses.reduce((acc, course) => acc + parseInt(course.duration || 0), 0),
  }), [enrolledCourses]);

  const continueLearningCourses = useMemo(() => {
    return enrolledCourses
      .filter((c) => c.status === "In Progress")
      .sort((a, b) => {
        const dateA = new Date(a.lastAccessed);
        const dateB = new Date(b.lastAccessed);
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [enrolledCourses]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              My Courses
            </h1>
            <p className="text-gray-600">
              Track your learning progress and continue where you left off
            </p>
          </div>
          <button
            onClick={() => navigate("/student/courses")}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] duration-200"
          >
            <FaPlus className="w-4 h-4" />
            <span>Enroll in New Course</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100 mb-1">
                Total Courses
              </p>
              <h3 className="text-3xl font-bold">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FaChartLine className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-100 mb-1">
                In Progress
              </p>
              <h3 className="text-3xl font-bold">{stats.inProgress}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FaFire className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100 mb-1">
                Completed
              </p>
              <h3 className="text-3xl font-bold">{stats.completed}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FaTrophy className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100 mb-1">
                Total Hours
              </p>
              <h3 className="text-3xl font-bold">{stats.totalHours}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FaClock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      {continueLearningCourses.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Continue Learning
            </h2>
            <FaPlay className="w-5 h-5 text-blue-600" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {continueLearningCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white">
                      <p className="text-xs font-medium mb-1">Continue from</p>
                      <p className="text-sm font-semibold truncate">
                        {course.nextLesson}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>
                        {course.lessonsCompleted} of {course.totalLessons}{" "}
                        lessons
                      </span>
                      <span className="font-semibold text-blue-600">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/student/course/${course.id}/learn`)
                    }
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center space-x-2"
                  >
                    <FaPlay className="w-3 h-3" />
                    <span>Continue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search my courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("All")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterStatus === "All"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({enrolledCourses.length})
            </button>
            <button
              onClick={() => setFilterStatus("In Progress")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterStatus === "In Progress"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              onClick={() => setFilterStatus("Completed")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterStatus === "Completed"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>
      </div>

      {/* All Courses Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          All Enrolled Courses
        </h2>
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => navigate("/student/courses")}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaPlus className="w-4 h-4" />
              <span>Browse Courses</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="relative group">
                <CourseCardDetailed course={course} />
                {course.status === "Completed" && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                      <FaCheckCircle className="w-3 h-3" />
                      <span>Completed</span>
                    </div>
                  </div>
                )}
                {course.certificateEarned && (
                  <div className="absolute top-12 right-3 z-10">
                    <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                      <FaTrophy className="w-3 h-3" />
                      <span>Certificate</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State for No Enrolled Courses */}
      {enrolledCourses.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-12 text-center">
          <div className="text-blue-400 mb-4">
            <FaChartLine className="w-20 h-20 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Start Your Learning Journey
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't enrolled in any courses yet. Browse our course catalog
            and start learning today!
          </p>
          <button
            onClick={() => navigate("/student/courses")}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] duration-200"
          >
            <FaPlus className="w-5 h-5" />
            <span>Browse Courses</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentMyCourses;
