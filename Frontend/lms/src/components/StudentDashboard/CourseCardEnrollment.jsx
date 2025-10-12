import {
  FaClock,
  FaUser,
  FaStar,
  FaUsers,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { useState } from "react";

const CourseCardEnrollment = ({ course, onEnroll }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Bookmark Button */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-md"
        >
          {isBookmarked ? (
            <FaBookmark className="w-4 h-4 text-blue-600" />
          ) : (
            <FaRegBookmark className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Category Badge */}
        {course.category && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {course.category}
          </span>
        )}

        {/* Price or Free Badge */}
        {course.price === 0 ? (
          <span className="absolute bottom-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            FREE
          </span>
        ) : (
          <span className="absolute bottom-3 right-3 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            ${course.price}
          </span>
        )}
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
          {course.title}
        </h3>

        {/* Course Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <FaClock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            {course.rating && (
              <div className="flex items-center space-x-1">
                <FaStar className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-gray-400">({course.reviews})</span>
              </div>
            )}
          </div>

          {course.instructor && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <FaUser className="w-4 h-4" />
              <span className="truncate">Taught by {course.instructor}</span>
            </div>
          )}

          {course.enrolled && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <FaUsers className="w-4 h-4" />
              <span>{course.enrolled.toLocaleString()} students enrolled</span>
            </div>
          )}
        </div>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {course.description}
          </p>
        )}

        {/* Enroll Button */}
        <button
          onClick={() => onEnroll(course)}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] duration-200"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseCardEnrollment;
