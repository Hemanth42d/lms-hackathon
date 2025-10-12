import { useState, useEffect } from "react";
import {
  FaPlus,
  FaPlay,
  FaEdit,
  FaTrash,
  FaClock,
  FaEye,
  FaFileAlt,
  FaVideo,
} from "react-icons/fa";
// import toast from "react-hot-toast";

const CourseLectures = ({ courseId, course }) => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    videoUrl: "",
    materials: [],
  });

  const sampleLectures = [
    {
      id: 1,
      title: "Introduction to Python",
      description: "Basic concepts and syntax of Python programming language",
      duration: "45 mins",
      videoUrl: "https://example.com/video1",
      materials: ["slides.pdf", "code_examples.py"],
      order: 1,
      isPublished: true,
      views: 35,
      createdAt: "2024-01-20",
    },
    {
      id: 2,
      title: "Variables and Data Types",
      description:
        "Understanding variables, strings, numbers, and basic data types in Python",
      duration: "60 mins",
      videoUrl: "https://example.com/video2",
      materials: ["variables_guide.pdf", "exercises.py"],
      order: 2,
      isPublished: true,
      views: 32,
      createdAt: "2024-01-22",
    },
    {
      id: 3,
      title: "Control Structures",
      description: "If statements, loops, and conditional logic",
      duration: "50 mins",
      videoUrl: "",
      materials: ["control_structures.pdf"],
      order: 3,
      isPublished: false,
      views: 0,
      createdAt: "2024-01-25",
    },
  ];

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const fetchLectures = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLectures(sampleLectures);
    } catch (error) {
      toast.error("Failed to fetch lectures");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLecture = () => {
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      duration: "",
      videoUrl: "",
      materials: [],
    });
    setShowModal(true);
  };

  const handleEditLecture = (lecture) => {
    setModalMode("edit");
    setSelectedLecture(lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description,
      duration: lecture.duration,
      videoUrl: lecture.videoUrl,
      materials: lecture.materials,
    });
    setShowModal(true);
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      setLectures(lectures.filter((lecture) => lecture.id !== lectureId));
      toast.success("Lecture deleted successfully");
    }
  };

  const togglePublish = async (lectureId) => {
    setLectures(
      lectures.map((lecture) =>
        lecture.id === lectureId
          ? { ...lecture, isPublished: !lecture.isPublished }
          : lecture
      )
    );
    toast.success("Lecture status updated");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        const newLecture = {
          id: Date.now(),
          ...formData,
          order: lectures.length + 1,
          isPublished: false,
          views: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setLectures([...lectures, newLecture]);
        toast.success("Lecture created successfully");
      } else {
        setLectures(
          lectures.map((lecture) =>
            lecture.id === selectedLecture.id
              ? { ...lecture, ...formData }
              : lecture
          )
        );
        toast.success("Lecture updated successfully");
      }
      setShowModal(false);
    } catch (error) {
      toast.error(`Failed to ${modalMode} lecture`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse border border-gray-200 rounded-lg p-4"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Course Lectures</h3>
        <button
          onClick={handleCreateLecture}
          className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Lecture</span>
        </button>
      </div>

      <div className="space-y-3">
        {lectures.map((lecture) => (
          <div
            key={lecture.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      {lecture.order}
                    </span>
                    <h4 className="font-medium text-gray-900">
                      {lecture.title}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lecture.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {lecture.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {lecture.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <FaClock className="w-3 h-3" />
                    <span>{lecture.duration}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaEye className="w-3 h-3" />
                    <span>{lecture.views} views</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaFileAlt className="w-3 h-3" />
                    <span>{lecture.materials.length} materials</span>
                  </span>
                  {lecture.videoUrl && (
                    <span className="flex items-center space-x-1">
                      <FaVideo className="w-3 h-3" />
                      <span>Video</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePublish(lecture.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    lecture.isPublished
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {lecture.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleEditLecture(lecture)}
                  className="p-2 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteLecture(lecture.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Lecture Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {modalMode === "create" ? "Add New Lecture" : "Edit Lecture"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lecture Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter lecture title"
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
                  placeholder="Enter lecture description"
                ></textarea>
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
                  placeholder="e.g., 45 minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter video URL"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200"
                >
                  {modalMode === "create" ? "Add Lecture" : "Update Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLectures;
