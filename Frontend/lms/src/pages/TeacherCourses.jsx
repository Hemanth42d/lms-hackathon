import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaClipboardList,
  FaSearch,
  FaEye,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { useCourses } from "../../context/CourseContext";
import toast from "react-hot-toast";

const TeacherCourses = () => {
  // Get courses data from context
  const {
    courses,
    loading: contextLoading,
    error,
    fetchCourses,
  } = useCourses();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    thumbnail: "",
  });

  const navigate = useNavigate();

  // No fetchCourses on mount/useEffect. CourseContext handles initial fetch.

  useEffect(() => {
    const onEnrollmentUpdated = () => {
      fetchCourses();
    };
    window.addEventListener("enrollment-updated", onEnrollmentUpdated);
    const onStorage = (e) => {
      if (e.key === "enrollment-updated-ts") {
        fetchCourses();
      }
    };
    window.addEventListener("storage", onStorage);
    // Removed periodic polling to avoid blinking
    return () => {
      window.removeEventListener("enrollment-updated", onEnrollmentUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchCourses]);

  const handleCreateCourse = () => {
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      duration: "",
      category: "",
      thumbnail: "",
    });
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setModalMode("edit");
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      category: course.category,
      thumbnail: course.thumbnailUrl || course.thumbnail || "",
    });
    setShowModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This cannot be undone."
      )
    )
      return;
    try {
      await axiosInstance.delete(`/teacher/courses/${courseId}`);
      toast.success("Course deleted successfully");
      await fetchCourses();
    } catch (error) {
      console.error("Delete course error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete course");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (modalMode === "create") {
        await postCourseToServer();
      } else {
        await updateCourseToServer();
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenCourse = (courseId) => {
    navigate(`/teacher/course/${courseId}`);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading skeleton
  const CourseCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border animate-pulse">
      <div className="h-48 bg-gray-200 rounded-t-xl"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // API for creating the course
  const postCourseToServer = async () => {
    try {
      const response = await axiosInstance.post(
        "/teacher/courses/add-new-course",
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          thumbnailUrl: formData.thumbnail,
          duration: formData.duration,
        }
      );

      setShowModal(false);
      toast.success("Course created successfully");
      // Refresh courses data
      fetchCourses();
      console.log("Course created:", response.data);
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Create course error:", error);
    }
  };

  // API for updating the course
  const updateCourseToServer = async () => {
    try {
      const response = await axiosInstance.put(
        `/teacher/courses/${selectedCourse._id}`,
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          thumbnailUrl: formData.thumbnail,
          duration: formData.duration,
        }
      );

      setShowModal(false);
      toast.success("Course updated successfully");
      // Refresh courses data
      fetchCourses();
      console.log("Course updated:", response.data);
    } catch (error) {
      toast.error("Failed to update course");
      console.error("Update course error:", error);
    }
  };

  // Show error state if there's an error
  if (error && !contextLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="w-64 h-64 mx-auto mb-8 bg-red-50 rounded-lg flex items-center justify-center">
            <FaClipboardList className="w-24 h-24 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load courses
          </h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchCourses}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage and organize your courses</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length}
              </p>
            </div>
            <FaClipboardList className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length}
              </p>
            </div>
            <FaEye className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce(
                  (sum, course) =>
                    sum +
                    (course.studentsCount ||
                      course.enrolledStudents?.length ||
                      0),
                  0
                )}
              </p>
            </div>
            <FaUsers className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        {/* Draft Courses removed */}
      </div>

      {/* Courses Grid */}
      {contextLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-64 h-64 mx-auto mb-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <FaClipboardList className="w-24 h-24 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? "No courses found" : "No courses yet"}
          </h3>
          <p className="text-gray-600 mb-8">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Get started by creating your first course"}
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreateCourse}
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <FaPlus className="w-4 h-4" />
              <span>Create Your First Course</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id || course.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Course Thumbnail */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={
                    course.thumbnailUrl ||
                    course.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop";
                  }}
                />
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {course.status || "active"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <FaUsers className="w-3 h-3" />
                    <span>
                      {course.studentsCount ||
                        course.enrolledStudents?.length ||
                        0}{" "}
                      Students
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaClipboardList className="w-3 h-3" />
                    <span>
                      {course.lecturesCount || course.lectures?.length || 0}{" "}
                      Lectures
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaEdit className="w-3 h-3" />
                    <span>
                      {course.assignmentsCount ||
                        course.assignments?.length ||
                        0}{" "}
                      Assignments
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaClock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenCourse(course._id || course.id)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <span>Manage Course</span>
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id || course.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={handleCreateCourse}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white p-4 rounded-full shadow-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 hover:scale-110 z-10"
      >
        <FaPlus className="w-6 h-6" />
      </button>

      {/* Create/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {modalMode === "create" ? "Create New Course" : "Edit Course"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter course description"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 8 weeks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50"
                >
                  {submitting
                    ? "Processing..."
                    : modalMode === "create"
                    ? "Create Course"
                    : "Update Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
