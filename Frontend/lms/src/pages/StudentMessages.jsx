import { useState } from "react";
import {
  FaSearch,
  FaPaperPlane,
  FaPaperclip,
  FaEllipsisV,
  FaStar,
  FaRegStar,
  FaUser,
  FaReply,
} from "react-icons/fa";

const StudentMessages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Dr. Evelyn Reed",
      role: "Instructor",
      course: "Introduction to Data Science",
      avatar:
        "https://ui-avatars.com/api/?name=Evelyn+Reed&background=3b82f6&color=fff",
      lastMessage: "Great work on your recent assignment!",
      time: "2 hours ago",
      unread: 2,
      online: true,
      starred: true,
      messages: [
        {
          id: 1,
          sender: "Dr. Evelyn Reed",
          text: "Hi! I reviewed your data analysis project.",
          time: "10:30 AM",
          isOwn: false,
        },
        {
          id: 2,
          sender: "You",
          text: "Thank you! I'd love to hear your feedback.",
          time: "10:35 AM",
          isOwn: true,
        },
        {
          id: 3,
          sender: "Dr. Evelyn Reed",
          text: "Your approach to data cleaning was excellent. However, consider using more advanced visualization techniques.",
          time: "10:40 AM",
          isOwn: false,
        },
        {
          id: 4,
          sender: "Dr. Evelyn Reed",
          text: "Great work on your recent assignment!",
          time: "11:00 AM",
          isOwn: false,
        },
      ],
    },
    {
      id: 2,
      name: "Prof. Charles Bennett",
      role: "Instructor",
      course: "Advanced Calculus",
      avatar:
        "https://ui-avatars.com/api/?name=Charles+Bennett&background=10b981&color=fff",
      lastMessage: "The problem set deadline has been extended.",
      time: "5 hours ago",
      unread: 0,
      online: false,
      starred: false,
      messages: [
        {
          id: 1,
          sender: "Prof. Charles Bennett",
          text: "Hello class, I've decided to extend the deadline for Problem Set 3.",
          time: "Yesterday, 3:00 PM",
          isOwn: false,
        },
        {
          id: 2,
          sender: "You",
          text: "Thank you, Professor! That's very helpful.",
          time: "Yesterday, 3:15 PM",
          isOwn: true,
        },
        {
          id: 3,
          sender: "Prof. Charles Bennett",
          text: "The problem set deadline has been extended.",
          time: "Today, 9:00 AM",
          isOwn: false,
        },
      ],
    },
    {
      id: 3,
      name: "Ms. Olivia Carter",
      role: "Instructor",
      course: "Digital Marketing Fundamentals",
      avatar:
        "https://ui-avatars.com/api/?name=Olivia+Carter&background=f59e0b&color=fff",
      lastMessage: "Your campaign proposal looks promising!",
      time: "1 day ago",
      unread: 1,
      online: true,
      starred: true,
      messages: [
        {
          id: 1,
          sender: "Ms. Olivia Carter",
          text: "I've reviewed your campaign proposal.",
          time: "Yesterday, 2:00 PM",
          isOwn: false,
        },
        {
          id: 2,
          sender: "You",
          text: "Thank you! What are your thoughts?",
          time: "Yesterday, 2:30 PM",
          isOwn: true,
        },
        {
          id: 3,
          sender: "Ms. Olivia Carter",
          text: "Your campaign proposal looks promising! Let's discuss the budget allocation in our next session.",
          time: "Yesterday, 4:00 PM",
          isOwn: false,
        },
      ],
    },
    {
      id: 4,
      name: "Study Group - Python",
      role: "Group Chat",
      course: "Introduction to Python",
      avatar:
        "https://ui-avatars.com/api/?name=Python+Group&background=8b5cf6&color=fff",
      lastMessage: "John: Anyone up for a study session?",
      time: "2 days ago",
      unread: 5,
      online: false,
      starred: false,
      messages: [
        {
          id: 1,
          sender: "Sarah",
          text: "Hey everyone! Did you finish the assignment?",
          time: "2 days ago, 10:00 AM",
          isOwn: false,
        },
        {
          id: 2,
          sender: "You",
          text: "Almost done! Just working on the last function.",
          time: "2 days ago, 10:15 AM",
          isOwn: true,
        },
        {
          id: 3,
          sender: "John",
          text: "Anyone up for a study session?",
          time: "2 days ago, 11:00 AM",
          isOwn: false,
        },
      ],
    },
    {
      id: 5,
      name: "David Lee",
      role: "Instructor",
      course: "Financial Modeling",
      avatar:
        "https://ui-avatars.com/api/?name=David+Lee&background=ef4444&color=fff",
      lastMessage: "Let's schedule a one-on-one session.",
      time: "3 days ago",
      unread: 0,
      online: false,
      starred: false,
      messages: [
        {
          id: 1,
          sender: "David Lee",
          text: "Your financial model needs some improvements.",
          time: "3 days ago, 2:00 PM",
          isOwn: false,
        },
        {
          id: 2,
          sender: "You",
          text: "I'd appreciate your guidance on this.",
          time: "3 days ago, 2:30 PM",
          isOwn: true,
        },
        {
          id: 3,
          sender: "David Lee",
          text: "Let's schedule a one-on-one session.",
          time: "3 days ago, 3:00 PM",
          isOwn: false,
        },
      ],
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      // Add message logic here
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const toggleStar = (id) => {
    // Toggle star logic here
    console.log("Toggle star for:", id);
  };

  const totalUnread = conversations.reduce((acc, conv) => acc + conv.unread, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Messages
        </h1>
        <p className="text-gray-600">Connect with instructors and classmates</p>
      </div>

      {/* Messages Container */}
      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ height: "calc(100vh - 250px)" }}
      >
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat?.id === conv.id
                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conv.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {conv.starred && (
                              <FaStar className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="text-xs text-gray-500">
                              {conv.time}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {conv.course}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate flex-1">
                            {conv.lastMessage}
                          </p>
                          {conv.unread > 0 && (
                            <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {conv.unread}
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

          {/* Chat Area */}
          <div className="flex-1 flex flex-col hidden md:flex">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedChat.avatar}
                          alt={selectedChat.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {selectedChat.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedChat.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {selectedChat.course}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStar(selectedChat.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {selectedChat.starred ? (
                          <FaStar className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <FaRegStar className="w-5 h-5" />
                        )}
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <FaEllipsisV className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-md ${
                          message.isOwn ? "order-2" : "order-1"
                        }`}
                      >
                        {!message.isOwn && (
                          <p className="text-xs text-gray-500 mb-1 ml-2">
                            {message.sender}
                          </p>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.isOwn
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-900 shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-2">
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <FaPaperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPaperPlane className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <FaUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Conversations
              </p>
              <h3 className="text-3xl font-bold text-gray-900">
                {conversations.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUser className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Unread Messages
              </p>
              <h3 className="text-3xl font-bold text-gray-900">
                {totalUnread}
              </h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaPaperPlane className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Starred</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {conversations.filter((c) => c.starred).length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaStar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;
