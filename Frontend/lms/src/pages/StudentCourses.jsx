import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import CourseCardEnrollment from "../components/StudentDashboard/CourseCardEnrollment";
import CourseFilter from "../components/StudentDashboard/CourseFilter";
import Pagination from "../components/StudentDashboard/Pagination";

const StudentCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const coursesPerPage = 8;

  const categories = [
    "All",
    "Technology",
    "Business",
    "Design",
    "Science",
    "Marketing",
  ];

  // Available courses for enrollment
  const allCourses = [
    {
      id: 1,
      title: "Introduction to Python Programming",
      duration: "4 hours",
      instructor: "Alex Turner",
      category: "Technology",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500",
      price: 0,
      rating: 4.8,
      reviews: 1240,
      enrolled: 15420,
      description:
        "Learn Python from scratch with hands-on projects and real-world applications.",
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      duration: "6 hours",
      instructor: "Sarah Chen",
      category: "Marketing",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
      price: 49.99,
      rating: 4.6,
      reviews: 890,
      enrolled: 8750,
      description:
        "Master digital marketing strategies including SEO, social media, and content marketing.",
    },
    {
      id: 3,
      title: "Graphic Design Masterclass",
      duration: "5 hours",
      instructor: "Emily Carter",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
      price: 0,
      rating: 4.9,
      reviews: 2100,
      enrolled: 12500,
      description:
        "Create stunning designs with Adobe Creative Suite and design principles.",
    },
    {
      id: 4,
      title: "Financial Modeling and Analysis",
      duration: "8 hours",
      instructor: "David Lee",
      category: "Business",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500",
      price: 79.99,
      rating: 4.7,
      reviews: 650,
      enrolled: 5200,
      description:
        "Build comprehensive financial models and analyze business performance.",
    },
    {
      id: 5,
      title: "Web Development Bootcamp",
      duration: "12 hours",
      instructor: "Michael Brown",
      category: "Technology",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
      price: 99.99,
      rating: 4.9,
      reviews: 3200,
      enrolled: 25000,
      description:
        "Full-stack web development with HTML, CSS, JavaScript, React, and Node.js.",
    },
    {
      id: 6,
      title: "Data Science with Python",
      duration: "10 hours",
      instructor: "Dr. Emma Wilson",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500",
      price: 89.99,
      rating: 4.8,
      reviews: 1800,
      enrolled: 18500,
      description:
        "Learn data analysis, visualization, and machine learning with Python libraries.",
    },
    {
      id: 7,
      title: "Business Strategy Essentials",
      duration: "7 hours",
      instructor: "Prof. James Anderson",
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500",
      price: 0,
      rating: 4.5,
      reviews: 720,
      enrolled: 6800,
      description:
        "Develop winning business strategies and competitive advantages.",
    },
    {
      id: 8,
      title: "UI/UX Design Principles",
      duration: "6 hours",
      instructor: "Sophie Martinez",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?w=500",
      price: 59.99,
      rating: 4.7,
      reviews: 1500,
      enrolled: 11200,
      description:
        "Design user-centered interfaces with modern UX principles and tools.",
    },
    {
      id: 9,
      title: "Machine Learning Fundamentals",
      duration: "15 hours",
      instructor: "Dr. Robert Chen",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500",
      price: 129.99,
      rating: 4.9,
      reviews: 2800,
      enrolled: 22000,
      description:
        "Master machine learning algorithms and build predictive models.",
    },
    {
      id: 10,
      title: "Social Media Marketing",
      duration: "5 hours",
      instructor: "Lisa Johnson",
      category: "Marketing",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500",
      price: 0,
      rating: 4.6,
      reviews: 980,
      enrolled: 9500,
      description:
        "Build engaging social media campaigns across all major platforms.",
    },
    {
      id: 11,
      title: "Photography Masterclass",
      duration: "8 hours",
      instructor: "Mark Stevens",
      category: "Design",
      image:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500",
      price: 69.99,
      rating: 4.8,
      reviews: 1100,
      enrolled: 8900,
      description:
        "Master photography techniques from composition to post-processing.",
    },
    {
      id: 12,
      title: "Project Management Professional",
      duration: "10 hours",
      instructor: "Jennifer White",
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500",
      price: 99.99,
      rating: 4.7,
      reviews: 1600,
      enrolled: 14500,
      description:
        "Learn project management methodologies and lead successful projects.",
    },
    {
      id: 13,
      title: "Advanced Excel for Business",
      duration: "6 hours",
      instructor: "Tom Harris",
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
      price: 0,
      rating: 4.5,
      reviews: 890,
      enrolled: 10200,
      description:
        "Master Excel formulas, pivot tables, and data analysis techniques.",
    },
    {
      id: 14,
      title: "Mobile App Development",
      duration: "14 hours",
      instructor: "Chris Taylor",
      category: "Technology",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
      price: 119.99,
      rating: 4.8,
      reviews: 2200,
      enrolled: 16800,
      description: "Build iOS and Android apps with React Native and Flutter.",
    },
    {
      id: 15,
      title: "Content Writing Masterclass",
      duration: "5 hours",
      instructor: "Rachel Green",
      category: "Marketing",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500",
      price: 39.99,
      rating: 4.6,
      reviews: 750,
      enrolled: 7200,
      description:
        "Write compelling content that engages and converts your audience.",
    },
    {
      id: 16,
      title: "Cybersecurity Basics",
      duration: "8 hours",
      instructor: "Kevin Park",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500",
      price: 0,
      rating: 4.7,
      reviews: 1300,
      enrolled: 13500,
      description:
        "Protect systems and data with essential cybersecurity practices.",
    },
  ];

  // Filter courses based on search and category
  useEffect(() => {
    let filtered = allCourses;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEnroll = (course) => {
    // Handle enrollment logic
    console.log("Enrolling in:", course.title);
    // You can add API call here to enroll the student
    alert(`Enrolling in: ${course.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Courses
        </h1>
        <p className="text-gray-600">
          Explore and enroll in courses to enhance your skills
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <CourseFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {indexOfFirstCourse + 1}-
          {Math.min(indexOfLastCourse, filteredCourses.length)} of{" "}
          {filteredCourses.length} courses
        </p>
        <div className="text-sm text-gray-600">
          {selectedCategory !== "All" && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {selectedCategory}
            </span>
          )}
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Featured Courses
        </h2>

        {/* No Results State */}
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Course Grid */}
        {currentCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCourses.map((course) => (
              <CourseCardEnrollment
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCourses.length > coursesPerPage && (
        <div className="mt-8 flex flex-col items-center space-y-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Load More Button */}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
