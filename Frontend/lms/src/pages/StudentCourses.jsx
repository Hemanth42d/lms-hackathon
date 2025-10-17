import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { FaSearch } from "react-icons/fa";
import CourseCardEnrollment from "../components/StudentDashboard/CourseCardEnrollment";
import CourseFilter from "../components/StudentDashboard/CourseFilter";
import Pagination from "../components/StudentDashboard/Pagination";
import { useCourses } from "../../context/CourseContext";

const StudentCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const coursesPerPage = 8;

  // Get courses data from context
  const {
    courses,
    loading: contextLoading,
    error,
    fetchCourses,
    getUser,
  } = useCourses();
  const { user } = useAuth();
  const [enrolledIds, setEnrolledIds] = useState(new Set());

  // Extract unique categories from real course data
  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category).filter(Boolean)),
  ];

  // Filter courses based on search and category
  useEffect(() => {
    let filtered = courses;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, courses]);

  // Load user's enrolled courses to mark cards
  useEffect(() => {
    let isMounted = true;
    const loadEnrolled = async () => {
      try {
        const userId =
          user?._id || JSON.parse(localStorage.getItem("user") || "null")?._id;
        if (!userId) return;
        const { data } = await axiosInstance.get(`/my-courses`, { params: { userId } });
        if (!isMounted) return;
        const ids = new Set((data?.courses || []).map((c) => c.courseId || c.id));
        setEnrolledIds(ids);
      } catch (_) {}
    };
    loadEnrolled();
    const refresh = () => loadEnrolled();
    window.addEventListener("enrollment-updated", refresh);
    return () => {
      isMounted = false;
      window.removeEventListener("enrollment-updated", refresh);
    };
  }, [user?._id]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEnroll = async (course) => {
    try {
      const userId =
        user?._id || JSON.parse(localStorage.getItem("user") || "null")?._id;
      await axiosInstance.post("/enroll", { userId, courseId: course.id });
      // Refresh enrolled courses in context
      if (typeof getUser === "function") {
        await getUser();
      }
      window.dispatchEvent(new CustomEvent("enrollment-updated"));
      try {
        localStorage.setItem("enrollment-updated-ts", String(Date.now()));
      } catch (_) {}
      // Optimistically mark this course as enrolled in local set
      setEnrolledIds((prev) => new Set([...Array.from(prev), course.id]));
    } catch (e) {
      console.error("Enroll failed", e);
      alert(e?.response?.data?.message || e.message);
    }
  };

  // Show loading state
  if (contextLoading) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Courses
          </h1>
          <p className="text-gray-600">
            Explore and enroll in courses to enhance your skills
          </p>
        </div>

        {/* Loading Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !contextLoading) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Courses
          </h1>
          <p className="text-gray-600">
            Explore and enroll in courses to enhance your skills
          </p>
        </div>

        {/* Error State */}
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-red-400 mb-4">
            <FaSearch className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load courses
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchCourses}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Courses
        </h1>
        <p className="text-gray-600">
          Explore and enroll in courses to enhance your skills
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <CourseFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredCourses.length > 0 ? indexOfFirstCourse + 1 : 0}-
          {Math.min(indexOfLastCourse, filteredCourses.length)} of{" "}
          {filteredCourses.length} courses
        </p>
        <div className="text-sm text-gray-600">
          {selectedCategory !== "All" && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {selectedCategory}
            </span>
          )}
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Free Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  courses.filter(
                    (course) => !course.price || course.price === 0
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length - 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Available Courses
        </h2>

        {/* No Results State */}
        {filteredCourses.length === 0 && !contextLoading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {courses.length === 0
                ? "No courses available"
                : "No courses found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {courses.length === 0
                ? "Check back later for new courses."
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
            {courses.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Course Grid */}
        {currentCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCourses.map((course) => (
              <CourseCardEnrollment
                key={course._id || course.id}
                course={{
                  id: course._id || course.id,
                  title: course.title,
                  duration: course.duration,
                  instructor:
                    (typeof course.instructor === "object" && course.instructor
                      ? course.instructor.userName
                      : typeof course.instructor === "string"
                      ? course.instructor
                      : course.createdBy?.name) || "Unknown Instructor",
                  instructorId:
                    typeof course.instructor === "object"
                      ? course.instructor?._id
                      : null,
                  category: course.category,
                  image:
                    course.thumbnailUrl ||
                    course.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
                  price: course.price || 0,
                  rating: course.rating || 4.5,
                  reviews: course.reviewsCount || course.reviews?.length || 0,
                  enrolled:
                    course.studentsCount ||
                    course.enrolledStudents?.length ||
                    0,
                  description: course.description,
                  status: course.status,
                  isEnrolled: enrolledIds.has(course._id || course.id),
                }}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCourses.length > coursesPerPage && (
        <div className="mt-8 flex flex-col items-center space-y-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Load More Button */}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
