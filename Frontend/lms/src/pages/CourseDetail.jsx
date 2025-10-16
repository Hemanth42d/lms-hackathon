import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaPlay,
  FaClipboardList,
  FaComments,
  FaUsers,
} from "react-icons/fa";
import CourseLectures from "./CourseLectures";
import CourseAssignments from "./CourseAssignments";
import CourseDiscussions from "./CourseDiscussions";
import { useCourses } from "../../context/CourseContext";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCourseById } = useCourses();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lectures");

  useEffect(() => {
    fetchCourseData();

    // Set active tab based on current path
    const pathParts = location.pathname.split("/");
    const currentTab = pathParts[pathParts.length - 1];
    if (["lectures", "assignments", "discussions"].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [courseId, location.pathname]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // Try to get course from context first
      const contextCourse = getCourseById(courseId);
      if (contextCourse) {
        setCourse(contextCourse);
      } else {
        // Fallback to sample data or API call
        const sampleCourse = {
          _id: courseId,
          title: "Introduction to Python Programming",
          description:
            "Learn Python from basics to advanced concepts including data structures, algorithms, and web development.",
          duration: "12 weeks",
          category: "Programming",
          studentsCount: 42,
          lecturesCount: 8,
          assignmentsCount: 5,
          discussionsCount: 12,
          status: "active",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
          instructor: "Dr. Sarah Johnson",
          createdAt: "2024-01-15",
        };
        setCourse(sampleCourse);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "lectures",
      label: "Lectures",
      icon: <FaPlay className="w-4 h-4" />,
      count: course?.lecturesCount || course?.lectures?.length || 0,
      path: "lectures",
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: <FaClipboardList className="w-4 h-4" />,
      count: course?.assignmentsCount || course?.assignments?.length || 0,
      path: "assignments",
    },
    {
      id: "discussions",
      label: "Discussions",
      icon: <FaComments className="w-4 h-4" />,
      count: course?.discussionsCount || course?.discussions?.length || 0,
      path: "discussions",
    },
  ];

  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId);
    navigate(`/teacher/course/${courseId}/${path}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Course not found
        </h3>
        <p className="text-gray-600 mb-4">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/teacher/courses")}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/teacher/courses")}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-1">
            Manage course content and student interactions
          </p>
        </div>
      </div>

      {/* Course Overview */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <img
          src={course.thumbnailUrl || course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop";
          }}
        />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {course.studentsCount || course.enrolledStudents?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Students</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <FaPlay className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {course.lecturesCount || course.lectures?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Lectures</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <FaClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {course.assignmentsCount || course.assignments?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Assignments</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                <FaComments className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {course.discussionsCount || course.discussions?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Discussions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id, tab.path)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <Routes>
            <Route index element={<Navigate to="lectures" replace />} />
            <Route
              path="lectures"
              element={<CourseLectures courseId={courseId} course={course} />}
            />
            <Route
              path="assignments"
              element={
                <CourseAssignments courseId={courseId} course={course} />
              }
            />
            <Route
              path="discussions"
              element={
                <CourseDiscussions courseId={courseId} course={course} />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
