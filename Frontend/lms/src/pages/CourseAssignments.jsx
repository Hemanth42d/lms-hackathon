import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaClipboardCheck,
  FaQuestionCircle,
  FaProjectDiagram,
  FaMinus,
  FaUsers,
  FaEye,
  FaDownload,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaClock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const CourseAssignments = ({ courseId, course }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showQuizSubmissionsModal, setShowQuizSubmissionsModal] =
    useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [quizSubmissions, setQuizSubmissions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "quiz",
    dueDate: "",
    maxMarks: "",
    questions: [
      {
        question: "",
        options: ["", ""],
        correctAnswer: 0,
        marks: 1,
      },
    ],
    requirements: [""],
    submissionFormat: "file",
    allowLateSubmission: false,
    maxFileSize: 10, // MB
    allowedFileTypes: ["pdf", "doc", "docx", "zip"],
  });

  // Sample quiz submissions for development
  const sampleQuizSubmissions = [
    {
      _id: "quiz-sub1",
      studentId: "student1",
      studentName: "John Doe",
      assignmentId: "1",
      answers: [0, 1, 2], // Student's selected answers
      submittedAt: "2024-04-14T10:30:00Z",
      status: "submitted",
      autoGrade: 8, // Auto-calculated grade
      totalMarks: 10,
      isLate: false,
    },
    {
      _id: "quiz-sub2",
      studentId: "student2",
      studentName: "Jane Smith",
      assignmentId: "1",
      answers: [0, 0, 1],
      submittedAt: "2024-04-14T15:45:00Z",
      status: "submitted",
      autoGrade: 6,
      totalMarks: 10,
      isLate: false,
    },
  ];

  const sampleAssignments = [
    {
      _id: "1",
      title: "Python Basics Quiz",
      description: "Test your understanding of Python fundamentals",
      type: "quiz",
      dueDate: "2024-04-15T23:59:59Z",
      maxMarks: 10,
      status: "active",
      questions: [
        {
          question: "What is Python?",
          options: ["Programming Language", "Snake", "Framework", "Database"],
          correctAnswer: 0,
          marks: 2,
        },
      ],
      submissionCount: 0,
      createdAt: "2024-01-20T10:00:00Z",
    },
    {
      _id: "2",
      title: "Web Development Project",
      description: "Build a complete web application using React and Node.js",
      type: "project",
      dueDate: "2024-04-20T23:59:59Z",
      maxMarks: 100,
      status: "active",
      requirements: ["Use React for frontend", "Implement user authentication"],
      submissionFormat: "link",
      allowLateSubmission: true,
      maxFileSize: 50,
      allowedFileTypes: ["zip", "rar"],
      submissionCount: 15,
      createdAt: "2024-01-25T10:00:00Z",
    },
  ];

  // Sample submissions for project assignments
  const sampleSubmissions = [
    {
      _id: "sub1",
      studentId: "student1",
      studentName: "John Doe",
      assignmentId: "2",
      submissionType: "link",
      submissionData: {
        link: "https://github.com/johndoe/web-project",
        description: "My web development project with React and Node.js",
      },
      submittedAt: "2024-04-18T14:30:00Z",
      status: "submitted",
      isLate: false,
      grade: null,
      feedback: "",
    },
    {
      _id: "sub2",
      studentId: "student2",
      studentName: "Jane Smith",
      assignmentId: "2",
      submissionType: "file",
      submissionData: {
        fileName: "web-project.zip",
        fileUrl: "/uploads/assignments/web-project.zip",
        fileSize: "25.4 MB",
      },
      submittedAt: "2024-04-19T16:45:00Z",
      status: "submitted",
      isLate: false,
      grade: 95,
      feedback: "Excellent work! Great UI design and clean code.",
    },
    {
      _id: "sub3",
      studentId: "student3",
      studentName: "Bob Johnson",
      assignmentId: "2",
      submissionType: "link",
      submissionData: {
        link: "https://drive.google.com/file/d/xyz123/view",
        description: "Project files uploaded to Google Drive",
      },
      submittedAt: "2024-04-21T10:15:00Z",
      status: "submitted",
      isLate: true,
      grade: null,
      feedback: "",
    },
  ];

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/teacher/courses/${courseId}/assignments`
      );
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to fetch assignments");
      // Fallback to sample data for development
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/assignments/${assignmentId}/submissions`
      );
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to fetch submissions");
      // Fallback to sample data for development
      const assignmentSubmissions = sampleSubmissions.filter(
        (sub) => sub.assignmentId === assignmentId
      );
      setSubmissions(assignmentSubmissions);
    }
  };

  const fetchQuizSubmissions = async (assignmentId) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/assignments/${assignmentId}/quiz-submissions`
      );
      setQuizSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error("Error fetching quiz submissions:", error);
      toast.error("Failed to fetch quiz submissions");
      // Fallback to sample data for development
      const assignmentSubmissions = sampleQuizSubmissions.filter(
        (sub) => sub.assignmentId === assignmentId
      );
      setQuizSubmissions(assignmentSubmissions);
    }
  };

  const handleViewSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);

    if (assignment.type === "project") {
      await fetchSubmissions(assignment._id);
      setShowSubmissionsModal(true);
    } else if (assignment.type === "quiz") {
      await fetchQuizSubmissions(assignment._id);
      setShowQuizSubmissionsModal(true);
    }
  };

  // Calculate auto-grade for quiz
  const calculateQuizGrade = (studentAnswers, questions) => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((question, index) => {
      maxScore += question.marks;
      if (studentAnswers[index] === question.correctAnswer) {
        totalScore += question.marks;
      }
    });

    return { score: totalScore, maxScore };
  };

  // Get grade color based on percentage
  const getGradeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      await axiosInstance.put(`/teacher/submissions/${submissionId}/grade`, {
        grade: parseInt(grade),
        feedback: feedback || "",
      });

      setSubmissions(
        submissions.map((sub) =>
          sub._id === submissionId
            ? { ...sub, grade: parseInt(grade), feedback }
            : sub
        )
      );
      toast.success("Grade updated successfully");
    } catch (error) {
      console.error("Error updating grade:", error);
      toast.error("Failed to update grade");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "quiz",
      dueDate: "",
      maxMarks: "",
      questions: [
        {
          question: "",
          options: ["", ""],
          correctAnswer: 0,
          marks: 1,
        },
      ],
      requirements: [""],
      submissionFormat: "file",
      allowLateSubmission: false,
      maxFileSize: 10,
      allowedFileTypes: ["pdf", "doc", "docx", "zip"],
    });
    setSelectedAssignment(null);
  };

  const handleCreateAssignment = () => {
    setModalMode("create");
    resetForm();
    setShowModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setModalMode("edit");
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      type: assignment.type,
      dueDate: assignment.dueDate ? assignment.dueDate.split("T")[0] : "", // Convert to YYYY-MM-DD format
      maxMarks: assignment.maxMarks.toString(),
      questions: assignment.questions || [
        {
          question: "",
          options: ["", ""],
          correctAnswer: 0,
          marks: 1,
        },
      ],
      requirements: assignment.requirements || [""],
      submissionFormat: assignment.submissionFormat || "file",
      allowLateSubmission: assignment.allowLateSubmission || false,
      maxFileSize: assignment.maxFileSize || 10,
      allowedFileTypes: assignment.allowedFileTypes || [
        "pdf",
        "doc",
        "docx",
        "zip",
      ],
    });
    setShowModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axiosInstance.delete(`/teacher/assignments/${assignmentId}`);
        setAssignments(
          assignments.filter((assignment) => assignment._id !== assignmentId)
        );
        toast.success("Assignment deleted successfully");
      } catch (error) {
        console.error("Error deleting assignment:", error);
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        dueDate: new Date(formData.dueDate).toISOString(),
        maxMarks: parseInt(formData.maxMarks),
        ...(formData.type === "quiz" && {
          questions: formData.questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            marks: parseInt(q.marks),
          })),
        }),
        ...(formData.type === "project" && {
          requirements: formData.requirements.filter(
            (req) => req.trim() !== ""
          ),
          submissionFormat: formData.submissionFormat,
          allowLateSubmission: formData.allowLateSubmission,
          maxFileSize: parseInt(formData.maxFileSize),
          allowedFileTypes: formData.allowedFileTypes.filter(
            (type) => type.trim() !== ""
          ),
        }),
      };

      if (modalMode === "create") {
        const response = await axiosInstance.post(
          `/teacher/courses/${courseId}/assignments`,
          submitData
        );

        const newAssignment = response.data.assignment;
        setAssignments([...assignments, newAssignment]);
        toast.success("Assignment created successfully");
      } else {
        const response = await axiosInstance.put(
          `/teacher/assignments/${selectedAssignment._id}`,
          submitData
        );

        const updatedAssignment = response.data.assignment;
        setAssignments(
          assignments.map((assignment) =>
            assignment._id === selectedAssignment._id
              ? updatedAssignment
              : assignment
          )
        );
        toast.success("Assignment updated successfully");
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error(
        `Error ${modalMode === "create" ? "creating" : "updating"} assignment:`,
        error
      );

      // Handle specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Failed to ${modalMode} assignment`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Question management functions
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          options: ["", ""],
          correctAnswer: 0,
          marks: 1,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push("");
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  // Requirements management functions
  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ""],
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "quiz":
        return "bg-blue-100 text-blue-800";
      case "project":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "graded":
        return "bg-blue-100 text-blue-800";
      case "late":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
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
            key={assignment._id}
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
                      {formatDate(assignment.dueDate)}
                    </p>
                    <p className="text-xs text-gray-600">Due Date</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <FaClipboardCheck className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900">
                      {assignment.maxMarks}
                    </p>
                    <p className="text-xs text-gray-600">Max Marks</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      {assignment.type === "quiz" ? (
                        <FaQuestionCircle className="w-4 h-4 text-gray-500" />
                      ) : (
                        <FaProjectDiagram className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <p className="font-medium text-gray-900">
                      {assignment.type === "quiz"
                        ? `${assignment.questions?.length || 0} Questions`
                        : `${
                            assignment.requirements?.length || 0
                          } Requirements`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {assignment.type === "quiz"
                        ? "Questions"
                        : "Requirements"}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <FaUsers className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900">
                      {assignment.submissionCount || 0}
                    </p>
                    <p className="text-xs text-gray-600">Submissions</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {assignment.type === "project" && (
                  <button
                    onClick={() => handleViewSubmissions(assignment)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium hover:bg-green-200 transition-colors flex items-center space-x-1"
                  >
                    <FaEye className="w-3 h-3" />
                    <span>View Submissions</span>
                  </button>
                )}
                <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-200 transition-colors">
                  View Details
                </button>
                <button
                  onClick={() => handleEditAssignment(assignment)}
                  className="p-2 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAssignment(assignment._id)}
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
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {modalMode === "create"
                ? "Add New Assignment"
                : "Edit Assignment"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Title *
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
                    Assignment Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="project">Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
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
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.maxMarks}
                    onChange={(e) =>
                      setFormData({ ...formData, maxMarks: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter max marks"
                  />
                </div>
              </div>

              {/* Quiz Questions with Enhanced UI */}
              {formData.type === "quiz" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Questions
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        Total Marks:{" "}
                        {formData.questions.reduce(
                          (sum, q) => sum + parseInt(q.marks || 0),
                          0
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center space-x-1"
                      >
                        <FaPlus className="w-3 h-3" />
                        <span>Add Question</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {formData.questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900">
                            Question {qIndex + 1}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {question.marks} mark
                              {question.marks !== 1 ? "s" : ""}
                            </span>
                            {formData.questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Question Text *
                            </label>
                            <textarea
                              required
                              value={question.question}
                              onChange={(e) =>
                                updateQuestion(
                                  qIndex,
                                  "question",
                                  e.target.value
                                )
                              }
                              rows="2"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              placeholder="Enter your question here..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Answer Options *
                                <span className="text-xs text-gray-500 ml-1">
                                  (Click radio button to mark correct answer)
                                </span>
                              </label>
                              <div className="space-y-2">
                                {question.options.map((option, oIndex) => (
                                  <div
                                    key={oIndex}
                                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 transition-all ${
                                      question.correctAnswer === oIndex
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 bg-white"
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        name={`correct-${qIndex}`}
                                        checked={
                                          question.correctAnswer === oIndex
                                        }
                                        onChange={() =>
                                          updateQuestion(
                                            qIndex,
                                            "correctAnswer",
                                            oIndex
                                          )
                                        }
                                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                                      />
                                      {question.correctAnswer === oIndex && (
                                        <FaCheck className="w-3 h-3 text-green-600 ml-1" />
                                      )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 min-w-[20px]">
                                      {String.fromCharCode(65 + oIndex)}.
                                    </span>
                                    <input
                                      type="text"
                                      required
                                      value={option}
                                      onChange={(e) =>
                                        updateOption(
                                          qIndex,
                                          oIndex,
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-0"
                                      placeholder={`Option ${String.fromCharCode(
                                        65 + oIndex
                                      )}`}
                                    />
                                    {question.options.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeOption(qIndex, oIndex)
                                        }
                                        className="text-red-500 hover:text-red-700 p-1"
                                      >
                                        <FaTimes className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addOption(qIndex)}
                                  className="text-blue-500 text-sm hover:text-blue-700 flex items-center space-x-1"
                                  disabled={question.options.length >= 6}
                                >
                                  <FaPlus className="w-3 h-3" />
                                  <span>Add Option</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question Preview
                              </label>
                              <div className="border border-gray-200 rounded-lg p-3 bg-white">
                                <p className="font-medium text-gray-900 mb-2">
                                  {question.question ||
                                    "Question will appear here..."}
                                </p>
                                <div className="space-y-1">
                                  {question.options.map((option, oIndex) => (
                                    <div
                                      key={oIndex}
                                      className={`flex items-center space-x-2 p-1 rounded ${
                                        question.correctAnswer === oIndex
                                          ? "bg-green-100 text-green-800"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      <span className="font-medium">
                                        {String.fromCharCode(65 + oIndex)}.
                                      </span>
                                      <span>
                                        {option ||
                                          `Option ${String.fromCharCode(
                                            65 + oIndex
                                          )}`}
                                      </span>
                                      {question.correctAnswer === oIndex && (
                                        <FaCheck className="w-3 h-3 text-green-600" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {question.correctAnswer !== null && (
                                  <div className="mt-2 text-xs text-green-600">
                                    ✓ Correct Answer: Option{" "}
                                    {String.fromCharCode(
                                      65 + question.correctAnswer
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Marks for this question *
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              max="10"
                              value={question.marks}
                              onChange={(e) =>
                                updateQuestion(
                                  qIndex,
                                  "marks",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Auto-calculate total marks */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-900">
                        Total Questions: {formData.questions.length}
                      </span>
                      <span className="text-sm font-medium text-blue-900">
                        Auto-calculated Max Marks:{" "}
                        {formData.questions.reduce(
                          (sum, q) => sum + parseInt(q.marks || 0),
                          0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Requirements with Enhanced Options */}
              {formData.type === "project" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Project Requirements
                    </h3>
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                    >
                      Add Requirement
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) =>
                            updateRequirement(index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={`Requirement ${index + 1}`}
                        />
                        {formData.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaMinus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Project Submission Settings */}
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Submission Settings
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Submission Format
                        </label>
                        <select
                          value={formData.submissionFormat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              submissionFormat: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="file">File Upload</option>
                          <option value="link">
                            Link Submission (GitHub, Drive, etc.)
                          </option>
                          <option value="both">File Upload + Link</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max File Size (MB)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={formData.maxFileSize}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxFileSize: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Allowed File Types (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.allowedFileTypes.join(", ")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            allowedFileTypes: e.target.value
                              .split(", ")
                              .map((type) => type.trim()),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="pdf, doc, docx, zip, rar"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowLateSubmission"
                        checked={formData.allowLateSubmission}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            allowLateSubmission: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="allowLateSubmission"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Allow late submissions (with penalty)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {modalMode === "create" ? "Creating..." : "Updating..."}
                    </>
                  ) : modalMode === "create" ? (
                    "Create Assignment"
                  ) : (
                    "Update Assignment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Submissions for "{selectedAssignment.title}"
                </h2>
                <p className="text-gray-600">
                  {submissions.length} submission(s) received
                </p>
              </div>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <FaProjectDiagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No submissions yet
                  </h3>
                  <p className="text-gray-600">
                    Students haven't submitted their projects yet.
                  </p>
                </div>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {submission.studentName}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              submission.status
                            )}`}
                          >
                            {submission.status}
                          </span>
                          {submission.isLate && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Late Submission
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <FaClock className="w-3 h-3" />
                              <span>
                                Submitted:{" "}
                                {formatDateTime(submission.submittedAt)}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Submission Data */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          {submission.submissionType === "file" && (
                            <div className="flex items-center space-x-2">
                              <FaDownload className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">
                                {submission.submissionData.fileName}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({submission.submissionData.fileSize})
                              </span>
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                Download
                              </button>
                            </div>
                          )}

                          {submission.submissionType === "link" && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <FaExternalLinkAlt className="w-4 h-4 text-green-500" />
                                <a
                                  href={submission.submissionData.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {submission.submissionData.link}
                                </a>
                              </div>
                              {submission.submissionData.description && (
                                <p className="text-sm text-gray-600">
                                  {submission.submissionData.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Grading Section */}
                        <div className="flex items-center space-x-4">
                          {submission.grade !== null ? (
                            <div className="flex items-center space-x-2">
                              <FaCheckCircle className="w-4 h-4 text-green-500" />
                              <span className="font-medium text-green-600">
                                Grade: {submission.grade}/
                                {selectedAssignment.maxMarks}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="0"
                                max={selectedAssignment.maxMarks}
                                placeholder="Grade"
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                onBlur={(e) => {
                                  if (e.target.value) {
                                    const feedback = prompt(
                                      "Add feedback (optional):"
                                    );
                                    handleGradeSubmission(
                                      submission._id,
                                      e.target.value,
                                      feedback || ""
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm text-gray-500">
                                /{selectedAssignment.maxMarks}
                              </span>
                            </div>
                          )}

                          {submission.feedback && (
                            <div className="text-sm text-gray-600">
                              <strong>Feedback:</strong> {submission.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Submissions Modal */}
      {showQuizSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Quiz Results for "{selectedAssignment.title}"
                </h2>
                <p className="text-gray-600">
                  {quizSubmissions.length} submission(s) • Auto-graded
                </p>
              </div>
              <button
                onClick={() => setShowQuizSubmissionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {quizSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <FaQuestionCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No submissions yet
                  </h3>
                  <p className="text-gray-600">
                    Students haven't taken the quiz yet.
                  </p>
                </div>
              ) : (
                <>
                  {/* Quiz Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {quizSubmissions.length}
                      </div>
                      <div className="text-sm text-blue-800">
                        Total Submissions
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(
                          quizSubmissions.reduce(
                            (sum, sub) =>
                              sum + (sub.autoGrade / sub.totalMarks) * 100,
                            0
                          ) / quizSubmissions.length
                        )}
                        %
                      </div>
                      <div className="text-sm text-green-800">
                        Average Score
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.max(
                          ...quizSubmissions.map((sub) => sub.autoGrade)
                        )}
                      </div>
                      <div className="text-sm text-purple-800">
                        Highest Score
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.min(
                          ...quizSubmissions.map((sub) => sub.autoGrade)
                        )}
                      </div>
                      <div className="text-sm text-orange-800">
                        Lowest Score
                      </div>
                    </div>
                  </div>

                  {/* Individual Submissions */}
                  {quizSubmissions.map((submission) => {
                    const percentage =
                      (submission.autoGrade / submission.totalMarks) * 100;
                    return (
                      <div
                        key={submission._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {submission.studentName}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  percentage >= 90
                                    ? "bg-green-100 text-green-800"
                                    : percentage >= 75
                                    ? "bg-blue-100 text-blue-800"
                                    : percentage >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {submission.autoGrade}/{submission.totalMarks} (
                                {Math.round(percentage)}%)
                              </span>
                              {submission.isLate && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Late
                                </span>
                              )}
                            </div>

                            <div className="text-sm text-gray-600 mb-3">
                              <span className="flex items-center space-x-1">
                                <FaClock className="w-3 h-3" />
                                <span>
                                  Submitted:{" "}
                                  {formatDateTime(submission.submittedAt)}
                                </span>
                              </span>
                            </div>

                            {/* Answer Review */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-3">
                                Answer Review:
                              </h5>
                              <div className="space-y-3">
                                {selectedAssignment.questions?.map(
                                  (question, qIndex) => {
                                    const studentAnswer =
                                      submission.answers[qIndex];
                                    const isCorrect =
                                      studentAnswer === question.correctAnswer;

                                    return (
                                      <div
                                        key={qIndex}
                                        className="border-l-4 border-gray-200 pl-3"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                              Q{qIndex + 1}: {question.question}
                                            </p>
                                            <div className="text-xs space-y-1">
                                              <div
                                                className={`flex items-center space-x-1 ${
                                                  isCorrect
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                              >
                                                {isCorrect ? (
                                                  <FaCheck className="w-3 h-3" />
                                                ) : (
                                                  <FaTimes className="w-3 h-3" />
                                                )}
                                                <span>
                                                  Student Answer:{" "}
                                                  {question.options[
                                                    studentAnswer
                                                  ] || "Not answered"}
                                                </span>
                                              </div>
                                              {!isCorrect && (
                                                <div className="flex items-center space-x-1 text-green-600">
                                                  <FaCheck className="w-3 h-3" />
                                                  <span>
                                                    Correct Answer:{" "}
                                                    {
                                                      question.options[
                                                        question.correctAnswer
                                                      ]
                                                    }
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <span
                                              className={`text-sm font-medium ${
                                                isCorrect
                                                  ? "text-green-600"
                                                  : "text-red-600"
                                              }`}
                                            >
                                              {isCorrect ? question.marks : 0}/
                                              {question.marks}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ...existing project submissions modal... */}
    </div>
  );
};

export default CourseAssignments;
