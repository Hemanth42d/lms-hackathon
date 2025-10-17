import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaArrowLeft,
  FaList,
  FaStar,
  FaBookmark,
  FaCheck,
  FaVideo,
  FaComments,
  FaClipboardList,
  FaPaperPlane,
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaEye,
  FaReply,
  FaThumbsUp,
} from "react-icons/fa";

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("video");
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [bookmarkedLessons, setBookmarkedLessons] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [courseData, setCourseData] = useState({ id: courseId, title: "", instructor: "", description: "", lessons: [], rating: 0, studentsEnrolled: 0, progress: 0 });
  const [discussionData, setDiscussionData] = useState([]);
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const [lectRes, assnRes, discRes, allCourses] = await Promise.all([
          axiosInstance.get(`/course/${courseId}/lectures`),
          axiosInstance.get(`/course/${courseId}/assignments`),
          axiosInstance.get(`/course/${courseId}/discussions`),
          axiosInstance.get(`/get-all-courses`),
        ]);
        if (!isMounted) return;
        const course = (allCourses.data?.courses || []).find((c) => (c._id || c.id) === courseId);
        const lessons = (lectRes.data?.lectures || []).map((l, idx) => ({
          id: l._id || idx,
          title: l.title,
          duration: l.duration || "",
          videoUrl: l.videoUrl,
          completed: false,
          description: l.description || "",
          resources: [
            ...(l.pdfUrl ? [{ name: "PDF", type: "pdf", url: l.pdfUrl }] : []),
            ...(l.pptUrl ? [{ name: "PPT", type: "pptx", url: l.pptUrl }] : []),
          ],
        }));
        setCourseData({
          id: courseId,
          title: course?.title || "",
          instructor: (typeof course?.instructor === "object" ? course?.instructor?.userName : course?.instructor) || "",
          description: course?.description || "",
          lessons,
          rating: course?.rating || 0,
          studentsEnrolled: course?.studentsCount || 0,
          progress: 0,
        });
        setAssignmentsData(Array.isArray(assnRes.data?.assignments) ? assnRes.data.assignments : []);
        setDiscussionData(Array.isArray(discRes.data?.discussions) ? discRes.data.discussions.map((d) => ({
          id: d._id,
          user: d.author?.userName || "",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.author?.userName || "U")}`,
          message: d.content,
          timestamp: new Date(d.createdAt).toLocaleString(),
          likes: 0,
          replies: (d.replies || []).map((r, i) => ({
            id: i,
            user: r.author?.userName || "",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author?.userName || "U")}`,
            message: r.content,
            timestamp: new Date(r.createdAt).toLocaleString(),
            likes: 0,
          })),
        })) : []);
        setCurrentVideoIndex(0);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.response?.data?.message || e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();
    return () => { isMounted = false; };
  }, [courseId]);

  // Ensure currentVideoIndex stays within bounds when lessons change
  useEffect(() => {
    const len = Array.isArray(courseData.lessons) ? courseData.lessons.length : 0;
    if (len === 0) {
      if (currentVideoIndex !== 0) setCurrentVideoIndex(0);
      return;
    }
    if (currentVideoIndex < 0 || currentVideoIndex >= len) {
      setCurrentVideoIndex(0);
    }
  }, [courseData.lessons, currentVideoIndex]);

  // Helper to safely derive a lesson id
  const getLessonId = (lesson, fallbackIndex) =>
    (lesson && (lesson.id || lesson._id)) ?? String(fallbackIndex);

  const lessonsLength = Array.isArray(courseData.lessons)
    ? courseData.lessons.length
    : 0;
  const currentLesson =
    lessonsLength > 0 && currentVideoIndex >= 0 && currentVideoIndex < lessonsLength
      ? courseData.lessons[currentVideoIndex]
      : null;
  const completedCount = (courseData.lessons || []).filter(
    (lesson) => lesson && lesson.completed
  ).length;
  const progressPercentage = lessonsLength
    ? (completedCount / lessonsLength) * 100
    : 0;

  const handleGenerateSummary = async () => {
    try {
      setSummaryLoading(true);
      setSummaryText("");
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setSummaryText("Gemini API key not configured. Set VITE_GEMINI_API_KEY.");
        return;
      }
      const prompt = `Summarize this lesson clearly in bullet points. Title: ${currentLesson?.title || ""}. Description: ${currentLesson?.description || ""}.`;
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
      setSummaryText(text);
    } catch (e) {
      setSummaryText(e.message || "Failed to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    const completed = (courseData.lessons || [])
      .filter((lesson) => lesson && lesson.completed)
      .map((lesson, idx) => getLessonId(lesson, idx));
    setCompletedLessons(completed);
  }, []);

  const handleLessonSelect = (index) => {
    if (index >= 0 && index < lessonsLength) {
      setCurrentVideoIndex(index);
      setActiveTab("video");
    }
  };

  const handleMarkComplete = () => {
    if (!currentLesson) return;
    const lessonId = currentLesson.id ?? currentLesson._id ?? String(currentVideoIndex);
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const handleNextLesson = () => {
    if (currentVideoIndex < courseData.lessons.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const toggleBookmark = (lessonId) => {
    if (bookmarkedLessons.includes(lessonId)) {
      setBookmarkedLessons(bookmarkedLessons.filter((id) => id !== lessonId));
    } else {
      setBookmarkedLessons([...bookmarkedLessons, lessonId]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log("Sending message:", newMessage);
      setNewMessage("");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "not_started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "video", name: "Video", icon: <FaVideo className="w-4 h-4" /> },
    {
      id: "discussion",
      name: "Discussion",
      icon: <FaComments className="w-4 h-4" />,
    },
    {
      id: "assignments",
      name: "Assignments",
      icon: <FaClipboardList className="w-4 h-4" />,
    },
  ];

  

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
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Tab Navigation */}
          <div className="bg-white border-b">
            <div className="px-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Video Tab */}
            {activeTab === "video" && (
              <div className="space-y-6">
                {/* Video + Summarizer */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Video Player */}
                <div className="flex-1 bg-black rounded-lg overflow-hidden">
                    <div className="relative aspect-video">
                      {/* TEMP YouTube embed. TODO: Replace with real videoUrl from backend once available */}
                      {currentLesson ? (
                        <iframe
                          className="w-full h-full"
                          src={
                            currentLesson?.videoUrl && currentLesson.videoUrl.includes("youtube")
                              ? currentLesson.videoUrl
                              : "https://www.youtube.com/embed/dQw4w9WgXcQ"
                          }
                          title="Course video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/80">
                          No lecture available.
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Summarizer Panel (Gemini) */}
                  <div className="lg:w-80 bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Video Summarizer</h3>
                    <p className="text-xs text-gray-500 mb-3">Powered by Gemini. Summarizes the current lesson title/description in real-time.</p>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={summaryLoading}
                      className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {summaryLoading ? "Summarizing..." : "Summarize Lesson"}
                    </button>
                    <div className="h-64 overflow-auto border rounded-lg p-3 bg-gray-50 text-sm whitespace-pre-wrap">
                      {summaryText || "Click Summarize to generate."}
                    </div>
                  </div>
                </div>

                {/* Lesson Details */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentLesson?.title || ""}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {currentLesson?.description || ""}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <FaClock className="w-4 h-4" />
                          <span>{currentLesson?.duration || ""}</span>
                        </span>
                        <span>
                          {lessonsLength > 0 && (
                            <>
                              Lesson {currentVideoIndex + 1} of {lessonsLength}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          if (!currentLesson) return;
                          const lid = getLessonId(currentLesson, currentVideoIndex);
                          toggleBookmark(lid);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          (() => {
                            if (!currentLesson) return false;
                            const lid = getLessonId(currentLesson, currentVideoIndex);
                            return bookmarkedLessons.includes(lid);
                          })()
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <FaBookmark className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleMarkComplete}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          (() => {
                            if (!currentLesson) return false;
                            const lid = getLessonId(currentLesson, currentVideoIndex);
                            return completedLessons.includes(lid);
                          })()
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <FaCheck className="w-4 h-4" />
                        <span>
                          {(() => {
                            if (!currentLesson) return false;
                            const lid = getLessonId(currentLesson, currentVideoIndex);
                            return completedLessons.includes(lid);
                          })()
                            ? "Completed"
                            : "Mark Complete"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Resources */}
                  {currentLesson && currentLesson.resources &&
                    currentLesson.resources.length > 0 && (
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
                      disabled={
                        lessonsLength === 0 || currentVideoIndex === lessonsLength - 1
                      }
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next Lesson</span>
                      <FaArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Discussion Tab */}
            {activeTab === "discussion" && (
              <div className="space-y-6">
                {/* Discussion Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Course Discussion
                  </h2>
                  <p className="text-gray-600">
                    Ask questions, share insights, and connect with fellow
                    students
                  </p>
                </div>

                {/* New Message */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Start a new discussion
                  </h3>
                  <div className="space-y-4">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share your thoughts, ask a question, or help a fellow student..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSendMessage}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaPaperPlane className="w-4 h-4" />
                        <span>Post Message</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Discussion Messages */}
                <div className="space-y-4">
              {(discussionData || []).map((message, idx) => (
                    <div
                  key={message.id || message._id || idx}
                      className="bg-white rounded-lg p-6 shadow-sm"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={message.avatar}
                          alt={message.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {message.user}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {message.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">
                            {message.message}
                          </p>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600">
                              <FaThumbsUp className="w-4 h-4" />
                              <span>{message.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600">
                              <FaReply className="w-4 h-4" />
                              <span>Reply</span>
                            </button>
                          </div>

                          {/* Replies */}
                          {(message.replies || []).length > 0 && (
                            <div className="mt-4 ml-4 space-y-3">
                              {message.replies.map((reply, ridx) => (
                                <div
                                  key={reply.id || reply._id || ridx}
                                  className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg"
                                >
                                  <img
                                    src={reply.avatar}
                                    alt={reply.user}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h5 className="font-medium text-gray-900 text-sm">
                                        {reply.user}
                                      </h5>
                                      <span className="text-xs text-gray-500">
                                        {reply.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                      {reply.message}
                                    </p>
                                    <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600">
                                      <FaThumbsUp className="w-3 h-3" />
                                      <span>{reply.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <div className="space-y-6">
                {/* Assignments Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Course Assignments
                  </h2>
                  <p className="text-gray-600">
                    Complete assignments to test your understanding and earn
                    grades
                  </p>
                </div>

                {/* Assignments List */}
                <div className="space-y-4">
              {(assignmentsData || []).map((assignment, aidx) => (
                    <div
                  key={assignment.id || assignment._id || aidx}
                      className="bg-white rounded-lg p-6 shadow-sm border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {assignment.title}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                assignment.status
                              )}`}
                            >
                              {assignment.status
                                .replace("_", " ")
                                .toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {assignment.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <FaCalendarAlt className="w-4 h-4" />
                              <span>Due: {assignment.dueDate}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <FaClock className="w-4 h-4" />
                              <span>{assignment.timeLimit}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <FaFileAlt className="w-4 h-4" />
                              <span>{assignment.totalQuestions} Questions</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <FaUser className="w-4 h-4" />
                              <span>
                                {assignment.attempts}/{assignment.maxAttempts}{" "}
                                Attempts
                              </span>
                            </div>
                          </div>

                          {assignment.status === "completed" && (
                            <div className="flex items-center space-x-2 text-sm text-green-600 mb-4">
                              <FaCheckCircle className="w-4 h-4" />
                              <span>Score: {assignment.score}</span>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          {assignment.status === "completed" ? (
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                              <FaEye className="w-4 h-4" />
                              <span>View Results</span>
                            </button>
                          ) : assignment.status === "pending" ? (
                            <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                              <FaPlay className="w-4 h-4" />
                              <span>Continue</span>
                            </button>
                          ) : (
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                              <FaPlay className="w-4 h-4" />
                              <span>Start Assignment</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Course Content (Only visible on Video tab) */}
        {activeTab === "video" && (
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
              {(courseData.lessons || []).map((lesson, index) => (
                  <div
                  key={(lesson && (lesson.id || lesson._id)) || index}
                    onClick={() => handleLessonSelect(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      index === currentVideoIndex
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                      {completedLessons.includes(getLessonId(lesson, index)) ? (
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
                        {bookmarkedLessons.includes(getLessonId(lesson, index)) && (
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
                  {courseData.studentsEnrolled} students • {courseData.rating}{" "}
                  ⭐
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourseLearning;
