import { useState, useEffect } from "react";
import {
  FaSearch,
  FaPaperPlane,
  FaUser,
  FaClock,
  FaCircle,
  FaEllipsisV,
  FaTrash,
  FaArchive,
} from "react-icons/fa";
import toast from "react-hot-toast";

const TeacherMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Sample conversations data
  const sampleConversations = [
    {
      id: 1,
      participant: {
        name: "John Smith",
        avatar:
          "https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff",
        role: "student",
      },
      lastMessage: {
        text: "Thank you for the explanation about recursion!",
        timestamp: "2024-03-15T14:30:00Z",
        isRead: true,
      },
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 2,
      participant: {
        name: "Emma Davis",
        avatar:
          "https://ui-avatars.com/api/?name=Emma+Davis&background=f59e0b&color=fff",
        role: "student",
      },
      lastMessage: {
        text: "Can we schedule a meeting to discuss my project?",
        timestamp: "2024-03-15T12:15:00Z",
        isRead: false,
      },
      unreadCount: 2,
      isOnline: false,
    },
    {
      id: 3,
      participant: {
        name: "Mike Chen",
        avatar:
          "https://ui-avatars.com/api/?name=Mike+Chen&background=ef4444&color=fff",
        role: "student",
      },
      lastMessage: {
        text: "I'm having trouble with the assignment deadline",
        timestamp: "2024-03-14T16:45:00Z",
        isRead: false,
      },
      unreadCount: 1,
      isOnline: true,
    },
  ];

  const sampleMessages = [
    {
      id: 1,
      conversationId: 1,
      sender: "student",
      text: "Hello Professor, I have a question about today's lecture on binary trees.",
      timestamp: "2024-03-15T10:00:00Z",
    },
    {
      id: 2,
      conversationId: 1,
      sender: "teacher",
      text: "Hi John! I'd be happy to help. What specific aspect of binary trees would you like me to clarify?",
      timestamp: "2024-03-15T10:15:00Z",
    },
    {
      id: 3,
      conversationId: 1,
      sender: "student",
      text: "I'm confused about the insertion process. How do we maintain the BST property?",
      timestamp: "2024-03-15T10:30:00Z",
    },
    {
      id: 4,
      conversationId: 1,
      sender: "teacher",
      text: "Great question! The BST property states that for any node, all values in the left subtree are smaller, and all values in the right subtree are larger. During insertion, we compare the new value with the current node and decide whether to go left or right.",
      timestamp: "2024-03-15T10:45:00Z",
    },
    {
      id: 5,
      conversationId: 1,
      sender: "student",
      text: "Thank you for the explanation about recursion!",
      timestamp: "2024-03-15T14:30:00Z",
    },
  ];

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setConversations(sampleConversations);
      if (sampleConversations.length > 0) {
        setSelectedConversation(sampleConversations[0]);
        setMessages(
          sampleMessages.filter(
            (msg) => msg.conversationId === sampleConversations[0].id
          )
        );
      }
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const newMessage = {
        id: Date.now(),
        conversationId: selectedConversation.id,
        sender: "teacher",
        text: messageText,
        timestamp: new Date().toISOString(),
      };

      setMessages([...messages, newMessage]);
      setMessageText("");

      // Update last message in conversation
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: {
                  text: messageText,
                  timestamp: new Date().toISOString(),
                  isRead: true,
                },
              }
            : conv
        )
      );

      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    const conversationMessages = sampleMessages.filter(
      (msg) => msg.conversationId === conversation.id
    );
    setMessages(conversationMessages);

    // Mark as read
    setConversations(
      conversations.map((conv) =>
        conv.id === conversation.id
          ? {
              ...conv,
              unreadCount: 0,
              lastMessage: { ...conv.lastMessage, isRead: true },
            }
          : conv
      )
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-white rounded-lg border overflow-hidden">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Messages
            </h2>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center space-x-3 p-3"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-indigo-50 border-r-2 border-indigo-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {conversation.participant.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate ${
                            conversation.lastMessage.isRead
                              ? "text-gray-600"
                              : "text-gray-900 font-medium"
                          }`}
                        >
                          {conversation.lastMessage.text}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedConversation.participant.avatar}
                    alt={selectedConversation.participant.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedConversation.participant.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                  <FaEllipsisV className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "teacher"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "teacher"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "teacher"
                            ? "text-indigo-200"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FaPaperPlane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages;
