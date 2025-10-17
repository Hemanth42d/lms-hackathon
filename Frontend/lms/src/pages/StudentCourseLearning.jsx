import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
  FaStar,
  FaClipboardList,
  FaCalendarAlt,
  FaFileAlt,
  FaEye,
  FaTimes,
  FaExclamationTriangle,
  FaVideo,
  FaComments,
  FaDownload,
  FaBookmark,
  FaThumbsUp,
  FaReply,
  FaUser,
  FaFilePdf,
  FaFilePowerpoint,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
  FaSpinner,
  FaRobot,
} from "react-icons/fa";

// Video Summarizer Component
const VideoSummarizer = ({ videoUrl, title }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSummary = async () => {
    if (!videoUrl) {
      toast.error("No video URL available for summarization");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This would be a call to your backend that uses Gemini API
      const response = await axiosInstance.post("/api/video/summarize", {
        videoUrl,
        title,
      });

      setSummary(response.data.summary);
      toast.success("Video summary generated successfully!");
    } catch (error) {
      setError("Failed to generate video summary");
      toast.error("Failed to generate video summary");
      console.error("Summary generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <FaRobot className="w-4 h-4 mr-2 text-blue-600" />
          AI Video Summary
        </h3>
        <button
          onClick={generateSummary}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="w-3 h-3 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FaRobot className="w-3 h-3" />
              <span>Summarize</span>
            </>
          )}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {summary ? (
        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
          {summary}
        </div>
      ) : (
        !loading && (
          <div className="text-sm text-gray-500 text-center py-4">
            Click "Summarize" to generate an AI summary of this video
          </div>
        )
      )}
    </div>
  );
};

// Universal Video Player Component
const VideoPlayer = ({ lecture, onLectureComplete, onMarkComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoType, setVideoType] = useState("unknown");
  const [embedUrl, setEmbedUrl] = useState("");

  const videoRef = useRef(null);

  // Function to detect and convert video URLs
  const processVideoUrl = (url) => {
    if (!url) return { type: "none", embedUrl: "" };

    // YouTube URL patterns
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`,
      };
    }

    // Google Drive URL patterns
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const driveMatch = url.match(driveRegex);

    if (driveMatch) {
      const fileId = driveMatch[1];
      return {
        type: "drive",
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      };
    }

    // Check if it's a direct video URL
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    const isDirectVideo = videoExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    if (isDirectVideo || url.startsWith("blob:") || url.startsWith("data:")) {
      return {
        type: "direct",
        embedUrl: url,
      };
    }

    // Default to iframe for other URLs
    return {
      type: "iframe",
      embedUrl: url,
    };
  };

  useEffect(() => {
    const { type, embedUrl: processedUrl } = processVideoUrl(lecture.videoUrl);
    setVideoType(type);
    setEmbedUrl(processedUrl);
  }, [lecture.videoUrl]);

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      onMarkComplete(lecture._id || lecture.id);
      toast.success("Lecture marked as complete! 🎉");
    }
  };

  const togglePlay = () => {
    if (videoRef.current && videoType === "direct") {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoType === "direct") {
      setCurrentTime(videoRef.current.currentTime);

      // Check if video is completed (95% watched)
      const watchedPercentage =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      if (watchedPercentage >= 95 && onLectureComplete) {
        onLectureComplete(lecture._id || lecture.id);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoType === "direct") {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    if (videoRef.current && videoType === "direct") {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current && videoType === "direct") {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current && videoType === "direct") {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleFullscreen = () => {
    const element =
      videoRef.current || document.querySelector(".video-container");
    if (!document.fullscreenElement && element) {
      element.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderVideoPlayer = () => {
    switch (videoType) {
      case "youtube":
        return (
          <div className="video-container relative w-full aspect-video">
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lecture.title}
            />
          </div>
        );

      case "drive":
        return (
          <div className="video-container relative w-full aspect-video">
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
              title={lecture.title}
            />
          </div>
        );

      case "direct":
        return (
          <div className="bg-black rounded-lg overflow-hidden video-container">
            <div className="relative group">
              <video
                ref={videoRef}
                src={embedUrl}
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false}
              />

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={togglePlay}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <FaPause className="w-8 h-8 text-gray-900" />
                    ) : (
                      <FaPlay className="w-8 h-8 text-gray-900 ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div
                    className="w-full h-2 bg-gray-600 rounded-full cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-blue-400"
                    >
                      {isPlaying ? (
                        <FaPause className="w-4 h-4" />
                      ) : (
                        <FaPlay className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-blue-400"
                      >
                        {isMuted ? (
                          <FaVolumeMute className="w-4 h-4" />
                        ) : (
                          <FaVolumeUp className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-gray-600 rounded-full"
                      />
                    </div>

                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-blue-400"
                  >
                    {isFullscreen ? (
                      <FaCompress className="w-4 h-4" />
                    ) : (
                      <FaExpand className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "iframe":
        return (
          <div className="video-container relative w-full aspect-video">
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={lecture.title}
            />
          </div>
        );

      default:
        return (
          <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Video not available</p>
              <p className="text-sm text-gray-500">
                Please check the video URL
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderVideoPlayer()}

      {/* Mark as Complete Button */}
      <div className="flex justify-center">
        <button
          onClick={handleMarkComplete}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-semibold"
        >
          <FaCheckCircle className="w-5 h-5" />
          <span>Mark as Complete</span>
        </button>
      </div>
    </div>
  );
};

// Lecture Viewer Component - Full Screen
const LectureViewer = ({ lecture, lectures, onClose, onLectureComplete }) => {
  const [currentLecture, setCurrentLecture] = useState(lecture);
  const [completedLectures, setCompletedLectures] = useState(new Set());

  const handleLectureComplete = (lectureId) => {
    setCompletedLectures((prev) => new Set([...prev, lectureId]));
    if (onLectureComplete) {
      onLectureComplete(lectureId);
    }
    toast.success("Lecture completed! 🎉");
  };

  const handleLectureSelect = (selectedLecture) => {
    setCurrentLecture(selectedLecture);
  };

  const downloadFile = (url, filename) => {
    if (!url) {
      toast.error(`${filename} not available for download`);
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${filename}...`);
  };

  const progressPercentage = (completedLectures.size / lectures.length) * 100;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 overflow-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">{currentLecture.title}</h1>
                <p className="text-gray-300 text-sm">Course Lecture</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300 mb-1">
                Progress: {completedLectures.size} / {lectures.length} lectures
              </div>
              <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Main Video Section - 75% */}
          <div className="flex-1 p-6 bg-gray-900">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Video Player */}
              <VideoPlayer
                lecture={currentLecture}
                onLectureComplete={handleLectureComplete}
              />

              {/* Lecture Info */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentLecture.title}
                </h2>
                <p className="text-gray-300 mb-4">
                  {currentLecture.description}
                </p>

                {/* Download Links */}
                <div className="flex items-center space-x-4">
                  <h3 className="text-white font-semibold">Resources:</h3>
                  <button
                    onClick={() =>
                      downloadFile(
                        currentLecture.pdfUrl,
                        `${currentLecture.title}.pdf`
                      )
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaFilePdf className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() =>
                      downloadFile(
                        currentLecture.pptUrl,
                        `${currentLecture.title}.pptx`
                      )
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <FaFilePowerpoint className="w-4 h-4" />
                    <span>Download PPT</span>
                  </button>
                </div>
              </div>

              {/* Video Summarizer */}
              <div className="bg-gray-800 rounded-lg p-6">
                <VideoSummarizer
                  videoUrl={currentLecture.videoUrl}
                  title={currentLecture.title}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Next Lectures - 25% */}
          <div className="w-1/4 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-4">
                Course Lectures
              </h3>
              <div className="space-y-3">
                {lectures.map((lec, index) => (
                  <div
                    key={lec._id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      currentLecture._id === lec._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => handleLectureSelect(lec)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {completedLectures.has(lec._id) ? (
                          <FaCheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              currentLecture._id === lec._id
                                ? "border-white"
                                : "border-gray-500"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-semibold">
                            Lecture {index + 1}
                          </span>
                          {currentLecture._id === lec._id && (
                            <FaPlay className="w-3 h-3" />
                          )}
                        </div>
                        <h4 className="font-medium text-sm truncate">
                          {lec.title}
                        </h4>
                        <p className="text-xs opacity-80 mt-1 line-clamp-2">
                          {lec.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2 text-xs opacity-70">
                          <FaClock className="w-3 h-3" />
                          <span>{lec.duration || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Submission Results Component - Full Screen
const SubmissionResults = ({ submission, assignment, onClose }) => {
  const { detailedResults, submission: submissionData } = submission;
  const { score, maxScore, percentage } = submissionData;

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
      <div className="min-h-screen">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Assignment Results
                </h1>
                <p className="text-gray-600">{assignment.title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="mb-6">
              <div
                className={`text-6xl font-bold mb-2 ${getGradeColor(
                  percentage
                )}`}
              >
                {getGradeLetter(percentage)}
              </div>
              <div className="text-3xl font-semibold text-gray-900 mb-2">
                {score} / {maxScore}
              </div>
              <div
                className={`text-xl font-medium ${getGradeColor(percentage)}`}
              >
                {percentage}%
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Back to Course</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Detailed Results
            </h2>
            {detailedResults?.map((result, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Question {index + 1}
                      <span className="text-sm text-gray-600 ml-2">
                        ({result.maxMarks} point
                        {result.maxMarks !== 1 ? "s" : ""})
                      </span>
                    </h3>
                    <p className="text-gray-700 mb-4">{result.question}</p>
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      result.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.isCorrect ? (
                      <>
                        <FaCheckCircle className="w-4 h-4" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <FaTimes className="w-4 h-4" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {assignment.questions[index]?.options?.map(
                    (option, optionIndex) => {
                      const isStudentAnswer =
                        result.studentAnswer === optionIndex;
                      const isCorrectAnswer =
                        result.correctAnswer === optionIndex;

                      let optionClass = "p-3 rounded-lg border-2 ";
                      if (isCorrectAnswer && isStudentAnswer) {
                        optionClass +=
                          "border-green-500 bg-green-50 text-green-800";
                      } else if (isCorrectAnswer) {
                        optionClass +=
                          "border-green-500 bg-green-50 text-green-800";
                      } else if (isStudentAnswer) {
                        optionClass += "border-red-500 bg-red-50 text-red-800";
                      } else {
                        optionClass += "border-gray-200 bg-gray-50";
                      }

                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center justify-between">
                            <span>
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                            <div className="flex items-center space-x-2">
                              {isStudentAnswer && (
                                <span className="text-xs font-medium">
                                  Your Answer
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <span className="text-xs font-medium text-green-600">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Points earned:</span>
                    <span
                      className={`font-medium ${
                        result.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.marksAwarded} / {result.maxMarks}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Assignment Write Component - Full Screen
const AssignmentWrite = ({ assignment, onSubmit, onCancel }) => {
  const [answers, setAnswers] = useState(
    assignment?.questions?.map(() => null) || []
  );
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (assignment?.timeLimit) {
      const minutes = parseInt(assignment.timeLimit);
      if (minutes > 0) {
        setTimeLeft(minutes * 60);
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              handleSubmit();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [assignment]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOptionChange = (qIdx, optIdx) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIdx] = optIdx;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const unanswered = answers.some((answer) => answer === null);
    if (
      unanswered &&
      !window.confirm("Some questions are unanswered. Submit anyway?")
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post(
        `/course/${assignment.courseId}/assignments/${assignment._id}/submit`,
        { answers }
      );
      toast.success(
        `Assignment submitted! Score: ${data.submission.score} / ${data.submission.maxScore}`
      );
      if (onSubmit) onSubmit(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!assignment) return <div>Loading assignment...</div>;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
      <div className="min-h-screen">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {assignment.title}
                </h1>
                <p className="text-gray-600 mb-2">{assignment.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <FaStar className="w-4 h-4" />
                    <span>Max Marks: {assignment.maxMarks}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaFileAlt className="w-4 h-4" />
                    <span>Questions: {assignment.questions?.length || 0}</span>
                  </span>
                  {timeLeft !== null && (
                    <span
                      className={`flex items-center space-x-1 font-medium px-3 py-1 rounded-full ${
                        timeLeft < 300
                          ? "bg-red-100 text-red-700"
                          : timeLeft < 600
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <FaClock className="w-4 h-4" />
                      <span>Time Left: {formatTime(timeLeft)}</span>
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {assignment.questions?.map((q, qIdx) => (
              <div
                key={qIdx}
                className="bg-white rounded-xl border shadow-sm p-8"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Question {qIdx + 1}
                    <span className="text-base font-normal text-gray-600 ml-3">
                      ({q.marks} mark{q.marks !== 1 ? "s" : ""})
                    </span>
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {q.options?.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                        answers[qIdx] === optIdx
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${qIdx}`}
                        value={optIdx}
                        checked={answers[qIdx] === optIdx}
                        onChange={() => handleOptionChange(qIdx, optIdx)}
                        className="h-5 w-5 text-blue-600 mr-4 focus:ring-blue-500"
                      />
                      <span className="text-lg text-gray-700 flex-1">
                        <span className="font-medium mr-3">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="sticky bottom-0 bg-white border-t p-6 mt-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Questions answered:{" "}
                    {answers.filter((a) => a !== null).length} /{" "}
                    {assignment.questions?.length || 0}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={onCancel}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {submitting ? "Submitting..." : "Submit Assignment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [lecturesData, setLecturesData] = useState([]);
  const [discussionsData, setDiscussionsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [writingAssignment, setWritingAssignment] = useState(null);
  const [submissionResults, setSubmissionResults] = useState(null);
  const [lectureProgress, setLectureProgress] = useState(new Set());
  const [currentWatchingLecture, setCurrentWatchingLecture] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/course/${courseId}/assignments`
        );
        const processedAssignments = (data?.assignments || []).map(
          (assignment) => ({
            ...assignment,
            dueDate: assignment.dueDate
              ? new Date(assignment.dueDate).toLocaleDateString()
              : "No due date",
            timeLimit: assignment.timeLimit || "No time limit",
            totalQuestions: assignment.questions?.length || 0,
          })
        );
        setAssignmentsData(processedAssignments);
      } catch (error) {
        setError("Failed to load assignments");
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    const fetchLectures = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/course/${courseId}/lectures`
        );
        setLecturesData(data.lectures || []);
      } catch (error) {
        console.error("Failed to load lectures:", error);
      }
    };

    const fetchDiscussions = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/course/${courseId}/discussions`
        );
        setDiscussionsData(data.discussions || []);
      } catch (error) {
        console.error("Failed to load discussions:", error);
      }
    };

    const fetchLectureProgress = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/course/${courseId}/lecture-progress`
        );
        if (data.success && data.completedLectures) {
          setLectureProgress(new Set(data.completedLectures));
        }
      } catch (error) {
        console.error("Failed to load lecture progress:", error);
      }
    };

    fetchAssignments();
    fetchLectures();
    fetchDiscussions();
    fetchLectureProgress();
  }, [courseId]);

  // Handle lecture viewing
  const handleLectureSelect = (lecture) => {
    setCurrentWatchingLecture(lecture);
    // Scroll to the video player area
    setTimeout(() => {
      const videoSection = document.getElementById("video-player-section");
      if (videoSection) {
        videoSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleCloseLectureViewer = () => {
    setCurrentWatchingLecture(null);
  };

  const handleLectureComplete = async (lectureId) => {
    // Update progress immediately in UI
    setLectureProgress((prev) => {
      const newProgress = new Set([...prev, lectureId]);
      return newProgress;
    });

    // Save progress to backend
    try {
      await axiosInstance.post(
        `/course/${courseId}/lecture/${lectureId}/complete`
      );
      toast.success("Lecture completed! 🎉");
      console.log("Lecture completed and saved:", lectureId);
    } catch (error) {
      console.error("Error saving lecture progress:", error);
      toast.error("Failed to save lecture progress");
    }
  };

  const downloadFile = (url, filename) => {
    if (!url) {
      toast.error(`${filename} not available for download`);
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${filename}...`);
  };

  const handleStartAssignment = async (assignment) => {
    try {
      if (assignment.status === "overdue") {
        toast.error(
          "This assignment is overdue and can no longer be submitted"
        );
        return;
      }

      if (assignment.status === "completed") {
        toast.error("You have already submitted this assignment");
        return;
      }

      if (assignment.type === "quiz") {
        const { data } = await axiosInstance.get(
          `/teacher/assignments/${assignment._id}`
        );
        setWritingAssignment({
          ...data.assignment,
          courseId: courseId,
        });
      } else {
        toast.info("Project submission functionality coming soon!");
      }
    } catch (error) {
      toast.error("Failed to start assignment");
    }
  };

  const handleAssignmentSubmit = (result) => {
    setWritingAssignment(null);
    setSubmissionResults({
      submission: result,
      assignment: writingAssignment,
    });

    // Update assignment status in the list
    setAssignmentsData((prev) =>
      prev.map((assignment) =>
        assignment._id === result.submission.assignmentId
          ? {
              ...assignment,
              status: "completed",
              score: `${result.submission.score}/${result.submission.maxScore}`,
              submission: {
                score: result.submission.score,
                maxScore: result.submission.maxScore,
                percentage: result.submission.percentage,
                submittedAt: result.submission.submittedAt,
                detailedResults: result.detailedResults,
              },
            }
          : assignment
      )
    );
  };

  const handleViewResults = async (assignment) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/course/${courseId}/assignments/${assignment._id}/submission`
      );
      setSubmissionResults({
        submission: data.submission,
        assignment: data.assignment,
      });
    } catch (error) {
      toast.error("Failed to load submission results");
    } finally {
      setLoading(false);
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
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Course
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
                  Course Learning
                </h1>
                <p className="text-sm text-gray-600">
                  Access lectures, assignments, and discussions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("lectures")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "lectures"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaVideo className="w-4 h-4" />
                  <span>Lectures</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "assignments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaClipboardList className="w-4 h-4" />
                  <span>Assignments</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("discussions")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "discussions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaComments className="w-4 h-4" />
                  <span>Discussions</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "lectures" && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Course Lectures
                  </h2>
                  <p className="text-gray-600">
                    Watch video lectures and access learning materials
                  </p>
                </div>
                {lecturesData.length > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      Progress: {lectureProgress.size} / {lecturesData.length}{" "}
                      lectures
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: `${
                            (lectureProgress.size / lecturesData.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {lecturesData.length === 0 ? (
              <div className="bg-white rounded-lg p-12 shadow-sm text-center">
                <FaVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No lectures available
                </h3>
                <p className="text-gray-600">
                  Your instructor hasn't uploaded any lectures yet.
                </p>
              </div>
            ) : (
              <>
                {/* Video Player Section */}
                {currentWatchingLecture && (
                  <div
                    id="video-player-section"
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="flex">
                      {/* Main Video Area - 75% */}
                      <div className="flex-1 p-6">
                        <div className="space-y-4">
                          {/* Video Player */}
                          <VideoPlayer
                            lecture={currentWatchingLecture}
                            onLectureComplete={handleLectureComplete}
                            onMarkComplete={handleLectureComplete}
                          />

                          {/* Lecture Info */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {currentWatchingLecture.title}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {currentWatchingLecture.description}
                              </p>
                            </div>

                            {/* Resource Downloads */}
                            <div className="flex items-center space-x-4">
                              <h4 className="font-semibold text-gray-900">
                                Resources:
                              </h4>
                              <button
                                onClick={() =>
                                  downloadFile(
                                    currentWatchingLecture.pdfUrl,
                                    `${currentWatchingLecture.title}.pdf`
                                  )
                                }
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <FaFilePdf className="w-4 h-4" />
                                <span>Download PDF</span>
                              </button>
                              <button
                                onClick={() =>
                                  downloadFile(
                                    currentWatchingLecture.pptUrl,
                                    `${currentWatchingLecture.title}.pptx`
                                  )
                                }
                                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                              >
                                <FaFilePowerpoint className="w-4 h-4" />
                                <span>Download PPT</span>
                              </button>
                            </div>

                            {/* AI Video Summarizer */}
                            <VideoSummarizer
                              videoUrl={currentWatchingLecture.videoUrl}
                              title={currentWatchingLecture.title}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Playlist Sidebar - 25% */}
                      <div className="w-1/4 bg-gray-50 border-l border-gray-200 lecture-sidebar overflow-y-auto max-h-screen">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900">
                              Course Lectures
                            </h4>
                            <button
                              onClick={handleCloseLectureViewer}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            {lecturesData.map((lecture, index) => (
                              <div
                                key={lecture._id || lecture.id || index}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${
                                  currentWatchingLecture._id === lecture._id ||
                                  currentWatchingLecture.id === lecture.id
                                    ? "bg-blue-100 border-blue-300 border-2"
                                    : "bg-white hover:bg-gray-100 border border-gray-200"
                                }`}
                                onClick={() => handleLectureSelect(lecture)}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {lectureProgress.has(
                                      lecture._id || lecture.id
                                    ) ? (
                                      <FaCheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <div
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                          currentWatchingLecture._id ===
                                            lecture._id ||
                                          currentWatchingLecture.id ===
                                            lecture.id
                                            ? "border-blue-500 bg-blue-500 text-white"
                                            : "border-gray-400"
                                        }`}
                                      >
                                        <span className="text-xs font-semibold">
                                          {index + 1}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-xs font-semibold text-gray-600">
                                        Lecture {index + 1}
                                      </span>
                                      {(currentWatchingLecture._id ===
                                        lecture._id ||
                                        currentWatchingLecture.id ===
                                          lecture.id) && (
                                        <FaPlay className="w-3 h-3 text-blue-600" />
                                      )}
                                    </div>
                                    <h5 className="font-medium text-sm text-gray-900 truncate mb-1">
                                      {lecture.title}
                                    </h5>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {lecture.description}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                                      <FaClock className="w-3 h-3" />
                                      <span>{lecture.duration || "N/A"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lecture List */}
                <div className="grid gap-4">
                  {lecturesData.map((lecture, idx) => (
                    <div
                      key={lecture.id || lecture._id || idx}
                      className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            {lectureProgress.has(lecture._id || lecture.id) ? (
                              <FaCheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-600">
                                  {idx + 1}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {lecture.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {lecture.description}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <FaClock className="w-4 h-4" />
                                <span>
                                  {lecture.duration || "Duration not specified"}
                                </span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <FaCalendarAlt className="w-4 h-4" />
                                <span>
                                  {lecture.createdAt
                                    ? new Date(
                                        lecture.createdAt
                                      ).toLocaleDateString()
                                    : "Date not available"}
                                </span>
                              </span>
                              {lecture.pdfUrl && (
                                <span className="flex items-center space-x-1 text-red-600">
                                  <FaFilePdf className="w-4 h-4" />
                                  <span>PDF Available</span>
                                </span>
                              )}
                              {lecture.pptUrl && (
                                <span className="flex items-center space-x-1 text-orange-600">
                                  <FaFilePowerpoint className="w-4 h-4" />
                                  <span>PPT Available</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <button
                            onClick={() => handleLectureSelect(lecture)}
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            disabled={!lecture.videoUrl}
                          >
                            <FaPlay className="w-4 h-4" />
                            <span>Watch Lecture</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Course Assignments
              </h2>
              <p className="text-gray-600">
                Complete assignments to test your understanding and earn grades
              </p>
            </div>

            {assignmentsData.length === 0 ? (
              <div className="bg-white rounded-lg p-12 shadow-sm text-center">
                <FaClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No assignments yet
                </h3>
                <p className="text-gray-600">
                  Your instructor hasn't created any assignments for this course
                  yet.
                </p>
              </div>
            ) : (
              assignmentsData.map((assignment, aidx) => (
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
                          {assignment.status.replace("_", " ").toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assignment.type === "quiz"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {assignment.type
                            ? assignment.type.toUpperCase()
                            : "QUIZ"}
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
                          <FaStar className="w-4 h-4" />
                          <span>{assignment.maxMarks} Points</span>
                        </div>
                      </div>

                      {assignment.status === "completed" &&
                        assignment.score && (
                          <div className="flex items-center space-x-2 text-sm text-green-600 mb-4">
                            <FaCheckCircle className="w-4 h-4" />
                            <span>Score: {assignment.score}</span>
                          </div>
                        )}
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {assignment.status === "completed" ? (
                        <button
                          onClick={() => handleViewResults(assignment)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <FaEye className="w-4 h-4" />
                          <span>View Results</span>
                        </button>
                      ) : assignment.status === "overdue" ? (
                        <button
                          disabled
                          className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg cursor-not-allowed"
                        >
                          <FaExclamationTriangle className="w-4 h-4" />
                          <span>Overdue</span>
                        </button>
                      ) : (
                        <button
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={() => handleStartAssignment(assignment)}
                        >
                          <FaPlay className="w-4 h-4" />
                          <span>Start Assignment</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Course Discussions
              </h2>
              <p className="text-gray-600">
                Participate in course discussions and ask questions
              </p>
            </div>

            {discussionsData.length === 0 ? (
              <div className="bg-white rounded-lg p-12 shadow-sm text-center">
                <FaComments className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No discussions yet
                </h3>
                <p className="text-gray-600">
                  Be the first to start a discussion in this course.
                </p>
              </div>
            ) : (
              discussionsData.map((discussion, idx) => (
                <div
                  key={discussion.id || discussion._id || idx}
                  className="bg-white rounded-lg p-6 shadow-sm border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {discussion.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{discussion.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <FaUser className="w-4 h-4" />
                          <span>{discussion.author || "Anonymous"}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FaCalendarAlt className="w-4 h-4" />
                          <span>
                            {discussion.createdAt
                              ? new Date(
                                  discussion.createdAt
                                ).toLocaleDateString()
                              : "Date not available"}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FaThumbsUp className="w-4 h-4" />
                          <span>{discussion.likes || 0} likes</span>
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() =>
                          toast.info("Discussion details coming soon")
                        }
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <FaReply className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {writingAssignment && (
        <AssignmentWrite
          assignment={writingAssignment}
          onSubmit={handleAssignmentSubmit}
          onCancel={() => setWritingAssignment(null)}
        />
      )}

      {submissionResults && (
        <SubmissionResults
          submission={submissionResults.submission}
          assignment={submissionResults.assignment}
          onClose={() => setSubmissionResults(null)}
        />
      )}
    </div>
  );
};

export default StudentCourseLearning;
