import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUsers,
  FaClipboardCheck,
  FaClock,
} from "react-icons/fa";
// import toast from "react-hot-toast";

const CourseAssignments = ({ courseId, course }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxPoints: "",
    type: "assignment",
  });

  const sampleAssignments = [
    {
      id: 1,
      title: "Python Basics Quiz",
      description: "Test your understanding of Python fundamentals",
      dueDate: "2024-04-15",
      maxPoints: 50,
      submissions: 28,
      totalStudents: 42,
      type: "quiz",
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: 2,
      title: "Calculator Project",
      description: "Create a simple calculator using Python functions",
      dueDate: "2024-04-20",
      maxPoints: 100,
      submissions: 15,
      totalStudents: 42,
      type: "project",
      status: "active",
      createdAt: "2024-01-25",
    },
    {
      id: 3,
      title: "Data Structures Implementation",
      description: "Implement basic data structures: lists, stacks, and queues",
      dueDate: "2024-04-25",
      maxPoints: 150,
      submissions: 5,
      totalStudents: 42,
      type: "assignment",
      status: "active",
      createdAt: "2024-02-01",
    },
  ];

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAssignments(sampleAssignments);
    } catch (error) {
      toast.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = () => {
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      maxPoints: "",
      type: "assignment",
    });
    setShowModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setModalMode("edit");
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxPoints: assignment.maxPoints.toString(),
      type: assignment.type,
    });
    setShowModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(
        assignments.filter((assignment) => assignment.id !== assignmentId)
      );
      toast.success("Assignment deleted successfully");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        const newAssignment = {
          id: Date.now(),
          ...formData,
          maxPoints: parseInt(formData.maxPoints),
          submissions: 0,
          totalStudents: course.studentsCount,
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
        };
        setAssignments([...assignments, newAssignment]);
        toast.success("Assignment created successfully");
      } else {
        setAssignments(
          assignments.map((assignment) =>
            assignment.id === selectedAssignment.id
              ? {
                  ...assignment,
                  ...formData,
                  maxPoints: parseInt(formData.maxPoints),
                }
              : assignment
          )
        );
        toast.success("Assignment updated successfully");
      }
      setShowModal(false);
    } catch (error) {
      toast.error(`Failed to ${modalMode} assignment`);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "quiz":
        return "bg-blue-100 text-blue-800";
      case "project":
        return "bg-purple-100 text-purple-800";
      case "assignment":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompletionPercentage = (submissions, total) => {
    return Math.round((submissions / total) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse border border-gray-200 rounded-lg p-6"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Course Assignments
        </h3>
        <button
          onClick={handleCreateAssignment}
          className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Assignment</span>
        </button>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {assignment.title}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      assignment.type
                    )}`}
                  >
                    {assignment.type}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{assignment.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <FaCalendarAlt className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900">
                      {assignment.dueDate}
                    </p>
                    <p className="text-xs text-gray-600">Due Date</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <FaClipboardCheck className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900">
                      {assignment.maxPoints}
                    </p>
                    <p className="text-xs text-gray-600">Max Points</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <FaUsers className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900">
                      {assignment.submissions}/{assignment.totalStudents}
                    </p>
                    <p className="text-xs text-gray-600">Submissions</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <FaClock className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900">
                      {getCompletionPercentage(
                        assignment.submissions,
                        assignment.totalStudents
                      )}
                      %
                    </p>
                    <p className="text-xs text-gray-600">Completion</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Submission Progress</span>
                    <span className="text-gray-900 font-medium">
                      {getCompletionPercentage(
                        assignment.submissions,
                        assignment.totalStudents
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getCompletionPercentage(
                          assignment.submissions,
                          assignment.totalStudents
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-200 transition-colors">
                  View Submissions
                </button>
                <button
                  onClick={() => handleEditAssignment(assignment)}
                  className="p-2 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {modalMode === "create"
                ? "Add New Assignment"
                : "Edit Assignment"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter assignment title"
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
                  placeholder="Enter assignment description"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.maxPoints}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPoints: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Points"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Type
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="project">Project</option>
                </select>
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
                  {modalMode === "create"
                    ? "Add Assignment"
                    : "Update Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAssignments;
