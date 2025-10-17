import { useState, useEffect } from "react";
import {
  FaPlus,
  FaPlay,
  FaClock,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaFilePowerpoint,
  FaExternalLinkAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

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
    pdfUrl: "",
    pptUrl: "",
  });

  // Removed sample lectures; fetch from backend instead

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/course/${courseId}/lectures`);
      setLectures(Array.isArray(data?.lectures) ? data.lectures : []);
    } catch (error) {
      toast.error("Failed to fetch lectures");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    // TODO: Replace with actual API call
    const postToServer = axiosInstance
      .post(`/teacher/courses/${courseId}/lectures`, {
        title: formData.title || "",
        description: formData.description || "",
        duration: formData.duration || "",
        videoUrl: formData.videoUrl || "",
        pdfUrl: formData.pdfUrl || "",
        pptUrl: formData.pptUrl || "",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    try {
      await fetchLectures();
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        duration: "",
        videoUrl: "",
        pdfUrl: "",
        pptUrl: "",
      });
      toast.success("Lecture created successfully");
    } catch (error) {
      toast.error("Failed to create lecture");
    }
  };

  const handleEditLecture = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/lectures/${selectedLecture.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      await fetchLectures();

      setShowModal(false);
      setSelectedLecture(null);
      toast.success("Lecture updated successfully");
    } catch (error) {
      toast.error("Failed to update lecture");
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/lectures/${lectureId}`, { method: 'DELETE' });

        await fetchLectures();
        toast.success("Lecture deleted successfully");
      } catch (error) {
        toast.error("Failed to delete lecture");
      }
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      duration: "",
      videoUrl: "",
      pdfUrl: "",
      pptUrl: "",
    });
    setShowModal(true);
  };

  const openEditModal = (lecture) => {
    setModalMode("edit");
    setSelectedLecture(lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description,
      duration: lecture.duration,
      videoUrl: lecture.videoUrl,
      pdfUrl: lecture.pdfUrl || "",
      pptUrl: lecture.pptUrl || "",
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse border border-gray-200 rounded-lg p-6"
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Course Lectures
          </h3>
          <p className="text-gray-600 text-sm">
            Manage video lectures and materials
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Lecture</span>
        </button>
      </div>

      {/* Lectures List */}
      <div className="space-y-4">
        {lectures.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <FaPlay className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No lectures yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first lecture
            </p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Lecture
            </button>
          </div>
        ) : (
          lectures.map((lecture, index) => (
            <div
              key={lecture.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                      Lecture {index + 1}
                    </span>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {lecture.title}
                    </h4>
                  </div>

                  <p className="text-gray-700 mb-3">{lecture.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <FaClock className="w-3 h-3" />
                      <span>{lecture.duration}</span>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="flex items-center space-x-4">
                    {lecture.videoUrl && (
                      <a
                        href={lecture.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaPlay className="w-4 h-4" />
                        <span>Watch Video</span>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}

                    {lecture.pdfUrl && (
                      <a
                        href={lecture.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FaFilePdf className="w-4 h-4" />
                        <span>PDF Notes</span>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}

                    {lecture.pptUrl && (
                      <a
                        href={lecture.pptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 transition-colors"
                      >
                        <FaFilePowerpoint className="w-4 h-4" />
                        <span>Slides</span>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(lecture)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit lecture"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLecture(lecture.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete lecture"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Lecture Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {modalMode === "create" ? "Add New Lecture" : "Edit Lecture"}
            </h2>

            <form
              onSubmit={
                modalMode === "create" ? handleCreateLecture : handleEditLecture
              }
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter lecture title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what this lecture covers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 45 minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) =>
                    handleInputChange("videoUrl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Notes URL
                </label>
                <input
                  type="url"
                  value={formData.pdfUrl}
                  onChange={(e) => handleInputChange("pdfUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/notes.pdf (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PowerPoint Slides URL
                </label>
                <input
                  type="url"
                  value={formData.pptUrl}
                  onChange={(e) => handleInputChange("pptUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/slides.pptx (optional)"
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
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
