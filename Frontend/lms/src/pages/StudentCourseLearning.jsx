import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaPlay,
  FaPause,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaArrowLeft,
  FaList,
  FaStar,
  FaBookmark,
  FaCheck,
} from "react-icons/fa";

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [bookmarkedLessons, setBookmarkedLessons] = useState([]);

  // Sample course data (in real app, fetch from API)
  const courseData = {
    id: courseId,
    title: "Introduction to Python Programming",
    instructor: "Alex Turner",
    description: "Master Python programming from basics to advanced concepts",
    totalDuration: "4 hours 30 minutes",
    studentsEnrolled: "12,543",
    rating: 4.8,
    progress: 65,
    lessons: [
      {
        id: 1,
        title: "Introduction to Python",
        duration: "15:30",
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        completed: true,
        description:
          "Overview of Python programming language and its applications",
        resources: [
          { name: "Python Installation Guide", type: "pdf" },
          { name: "Course Slides", type: "pptx" },
        ],
      },
      {
        id: 2,
        title: "Python Basics and Syntax",
        duration: "22:45",
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        completed: true,
        description: "Learn basic Python syntax, variables, and data types",
        resources: [
          { name: "Code Examples", type: "zip" },
          { name: "Practice Exercises", type: "pdf" },
        ],
      },
      {
        id: 3,
        title: "Variables and Data Types",
        duration: "18:20",
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        completed: true,
        description: "Understanding different data types in Python",
        resources: [{ name: "Data Types Cheatsheet", type: "pdf" }],
      },
      {
        id: 4,
        title: "Control Structures",
        duration: "25:15",
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        completed: false,
        description: "If statements, loops, and conditional logic",
        resources: [
          { name: "Control Flow Examples", type: "py" },
          { name: "Exercise Solutions", type: "zip" },
        ],
      },
      {
        id: 5,
        title: "Functions and Methods",
        duration: "30:45",
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        completed: false,
        description: "Creating and using functions in Python",
        resources: [
          { name: "Function Templates", type: "py" },
          { name: "Best Practices Guide", type: "pdf" },
        ],
      },
      {
        id: 6,
        title: "Lists and Dictionaries",
        duration: "28:30",
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        completed: false,
        description: "Working with Python data structures",
        resources: [{ name: "Data Structure Examples", type: "py" }],
      },
      {
        id: 7,
        title: "Object-Oriented Programming",
        duration: "35:20",
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        completed: false,
        description: "Classes, objects, and OOP principles",
        resources: [
          { name: "OOP Examples", type: "zip" },
          { name: "Class Design Patterns", type: "pdf" },
        ],
      },
      {
        id: 8,
        title: "File Handling and I/O",
        duration: "20:15",
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        completed: false,
        description: "Reading and writing files in Python",
        resources: [
          { name: "File Operations Guide", type: "pdf" },
          { name: "Sample Data Files", type: "zip" },
        ],
      },
    ],
  };

  const currentLesson = courseData.lessons[currentVideoIndex];
  const completedCount = courseData.lessons.filter(
    (lesson) => lesson.completed
  ).length;
  const progressPercentage = (completedCount / courseData.lessons.length) * 100;

  useEffect(() => {
    // Set completed lessons from course data
    const completed = courseData.lessons
      .filter((lesson) => lesson.completed)
      .map((lesson) => lesson.id);
    setCompletedLessons(completed);
  }, []);

  const handleLessonSelect = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
  };

  const handleMarkComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
  };

  const handleNextLesson = () => {
    if (currentVideoIndex < courseData.lessons.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsPlaying(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsPlaying(false);
    }
  };

  const toggleBookmark = (lessonId) => {
    if (bookmarkedLessons.includes(lessonId)) {
      setBookmarkedLessons(bookmarkedLessons.filter((id) => id !== lessonId));
    } else {
      setBookmarkedLessons([...bookmarkedLessons, lessonId]);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "zip":
        return "📦";
      case "py":
        return "🐍";
      case "pptx":
        return "📊";
      default:
        return "📁";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/student/my-courses")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Back to My Courses</span>
              </button>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {courseData.title}
                </h1>
                <p className="text-sm text-gray-600">
                  by {courseData.instructor}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>
                  {completedCount} of {courseData.lessons.length} completed
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Video Player Section */}
        <div className="flex-1">
          <div className="bg-black">
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <video
                className="w-full h-full"
                controls
                poster="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop"
              >
                <source src={currentLesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={currentVideoIndex === 0}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-lg disabled:opacity-50"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    onClick={handleNextLesson}
                    disabled={
                      currentVideoIndex === courseData.lessons.length - 1
                    }
                    className="bg-black bg-opacity-50 text-white p-2 rounded-lg disabled:opacity-50"
                  >
                    ⏭
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Details */}
          <div className="bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentLesson.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {currentLesson.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <FaClock className="w-4 h-4" />
                    <span>{currentLesson.duration}</span>
                  </span>
                  <span>
                    Lesson {currentVideoIndex + 1} of{" "}
                    {courseData.lessons.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleBookmark(currentLesson.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarkedLessons.includes(currentLesson.id)
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaBookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handleMarkComplete}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    completedLessons.includes(currentLesson.id)
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <FaCheck className="w-4 h-4" />
                  <span>
                    {completedLessons.includes(currentLesson.id)
                      ? "Completed"
                      : "Mark Complete"}
                  </span>
                </button>
              </div>
            </div>

            {/* Resources */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FaDownload className="w-4 h-4" />
                  <span>Lesson Resources</span>
                </h3>
                <div className="space-y-2">
                  {currentLesson.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {getFileIcon(resource.type)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {resource.name}
                          </p>
                          <p className="text-sm text-gray-500 uppercase">
                            {resource.type}
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <button
                onClick={handlePreviousLesson}
                disabled={currentVideoIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>
              <button
                onClick={handleNextLesson}
                disabled={currentVideoIndex === courseData.lessons.length - 1}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next Lesson</span>
                <FaArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div
          className={`${
            showSidebar ? "w-96" : "w-0"
          } transition-all duration-300 overflow-hidden bg-white border-l`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Course Content</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Progress Summary */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Progress
                </span>
                <span className="text-sm font-bold text-blue-900">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                {completedCount} of {courseData.lessons.length} lessons
                completed
              </p>
            </div>

            {/* Lessons List */}
            <div className="space-y-2">
              {courseData.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonSelect(index)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    index === currentVideoIndex
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {completedLessons.includes(lesson.id) ? (
                        <FaCheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full border-2 ${
                            index === currentVideoIndex
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {index === currentVideoIndex && (
                            <div className="w-full h-full bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-medium truncate ${
                            index === currentVideoIndex
                              ? "text-blue-900"
                              : "text-gray-900"
                          }`}
                        >
                          {lesson.title}
                        </h4>
                        {bookmarkedLessons.includes(lesson.id) && (
                          <FaBookmark className="w-3 h-3 text-yellow-500 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {lesson.duration}
                        </span>
                        {lesson.resources && lesson.resources.length > 0 && (
                          <span className="text-xs text-gray-500">
                            • {lesson.resources.length} resources
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Course Rating */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Rate this course
              </h4>
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className="w-5 h-5 text-yellow-400 cursor-pointer hover:text-yellow-500"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                {courseData.studentsEnrolled} students • {courseData.rating} ⭐
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseLearning;
