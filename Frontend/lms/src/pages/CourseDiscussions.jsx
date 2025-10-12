import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaComments,
  FaClock,
  FaUser,
  FaReply,
  FaSearch,
} from "react-icons/fa";
import toast from "react-hot-toast";

const CourseDiscussions = ({ courseId, course }) => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Sample discussions data
  const sampleDiscussions = [
    {
      id: 1,
      title: "How to implement Binary Search Tree?",
      content:
        "I'm having trouble understanding how to implement a binary search tree in Python. Can someone explain the insertion and deletion operations?",
      author: {
        name: "John Smith",
        role: "student",
      },
      createdAt: "2024-03-15T10:30:00Z",
      replies: 8,
    },
    {
      id: 2,
      title: "Best practices for Python coding",
      content:
        "What are some best practices we should follow when writing Python code? I want to make sure I'm developing good habits early on.",
      author: {
        name: "Emma Davis",
        role: "student",
      },
      createdAt: "2024-03-12T14:20:00Z",
      replies: 12,
    },
    {
      id: 3,
      title: "Project collaboration guidelines",
      content:
        "For the upcoming group project, I think we should establish some guidelines for collaboration. What tools should we use?",
      author: {
        name: "Mike Chen",
        role: "student",
      },
      createdAt: "2024-03-10T11:45:00Z",
      replies: 6,
    },
  ];

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/courses/${courseId}/discussions`);
      // const data = await response.json();
      // setDiscussions(data);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDiscussions(sampleDiscussions);
    } catch (error) {
      toast.error("Failed to fetch discussions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/courses/${courseId}/discussions`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const newDiscussion = await response.json();

      const newDiscussion = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        author: {
          name: "Dr. Sarah Johnson",
          role: "teacher",
        },
        createdAt: new Date().toISOString(),
        replies: 0,
      };

      setDiscussions([newDiscussion, ...discussions]);
      setShowModal(false);
      setFormData({ title: "", content: "" });
      toast.success("Discussion created successfully");
    } catch (error) {
      toast.error("Failed to create discussion");
    }
  };

  const filteredDiscussions = discussions.filter(
    (discussion) =>
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Course Discussions
          </h3>
          <p className="text-gray-600 text-sm">
            Engage with students and answer their questions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Start Discussion</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <FaComments className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No discussions found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search"
                : "Be the first to start a discussion"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start First Discussion
              </button>
            )}
          </div>
        ) : (
          filteredDiscussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() =>
                navigate(
                  `/teacher/course/${courseId}/discussion/${discussion.id}`
                )
              }
            >
              <div className="space-y-3">
                {/* Title */}
                <h4 className="font-semibold text-gray-900 text-lg">
                  {discussion.title}
                </h4>

                {/* Content Preview */}
                <p className="text-gray-700 line-clamp-2">
                  {discussion.content}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <FaUser className="w-3 h-3" />
                      <span>{discussion.author.name}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          discussion.author.role === "teacher"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {discussion.author.role}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock className="w-3 h-3" />
                      <span>{formatDate(discussion.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaReply className="w-3 h-3" />
                    <span>{discussion.replies} replies</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Discussion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Start New Discussion
            </h2>

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discussion Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter discussion title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your discussion content here..."
                ></textarea>
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
                  Start Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDiscussions;
