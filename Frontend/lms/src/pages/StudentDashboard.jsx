import {
  FaBook,
  FaClipboardList,
  FaEnvelope,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import StatsCard from "../components/StudentDashboard/StatsCard";
import CourseCard from "../components/StudentDashboard/CourseCard";
import AssignmentsTable from "../components/StudentDashboard/AssignmentsTable";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Active Courses",
      value: "3",
      icon: <FaBook className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Assignments Due",
      value: "2",
      icon: <FaClipboardList className="w-6 h-6 text-orange-600" />,
      bgColor: "bg-orange-100",
    },
    {
      title: "Messages",
      value: "5",
      icon: <FaEnvelope className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-100",
    },
    {
      title: "Upcoming Events",
      value: "1",
      icon: <FaCalendarAlt className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-100",
    },
  ];

  const courses = [
    {
      title: "Introduction to Data Science",
      instructor: "Instructor: Dr. Evelyn Reed",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
      bgColor: "bg-green-100",
    },
    {
      title: "Advanced Calculus",
      instructor: "Instructor: Prof. Charles Bennett",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
      bgColor: "bg-cyan-100",
    },
    {
      title: "Digital Marketing Fundamentals",
      instructor: "Instructor: Ms. Olivia Carter",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      bgColor: "bg-orange-100",
    },
  ];

  const assignments = [
    {
      course: "Introduction to Data Science",
      assignment: "Project 1: Data Analysis",
      dueDate: "October 20, 2024",
      status: "In Progress",
    },
    {
      course: "Advanced Calculus",
      assignment: "Problem Set 3",
      dueDate: "October 25, 2024",
      status: "Not Started",
    },
    {
      course: "Digital Marketing Fundamentals",
      assignment: "Campaign Proposal",
      dueDate: "November 5, 2024",
      status: "Submitted",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your learning overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* My Courses Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          <button
            onClick={() => navigate("/student/my-courses")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] duration-200"
          >
            <span>View All Courses</span>
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              instructor={course.instructor}
              image={course.image}
              bgColor={course.bgColor}
            />
          ))}
        </div>
      </div>

      {/* Assignments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Assignments</h2>
        <AssignmentsTable assignments={assignments} />
      </div>
    </div>
  );
};

export default StudentDashboard;
