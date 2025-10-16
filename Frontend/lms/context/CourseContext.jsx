import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const CourseContext = createContext({
  courses: [],
  lectures: [],
  assignments: [],
  course: {},
  lecture: {},
  assignment: {},
  loading: false,
  error: null,
  fetchCourses: () => {},
  getCourseById: () => null,
  getLectureById: () => null,
  getAssignmentById: () => null,
});

export const useCourses = () => {
  const context = useContext(CourseContext); // Fixed: was courseContext
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseDataProvider"); // Fixed error message
  }
  return context;
};

const DataProvider = ({ children }) => {
  // State management
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState({});
  const [lecture, setLecture] = useState({});
  const [assignment, setAssignment] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/get-all-courses");
      setCourses(response.data.courses);
      return { success: true, data: response.data.courses };
    } catch (error) {
      console.error("Error fetching Courses data:", error.message);
      setError(error.message);
      return { error: true, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Helper functions
  const getCourseById = (id) => {
    return courses.find((course) => course._id === id) || null;
  };

  const getLectureById = (id) => {
    return lectures.find((lecture) => lecture._id === id) || null;
  };

  const getAssignmentById = (id) => {
    return assignments.find((assignment) => assignment._id === id) || null;
  };

  // Fixed: Don't call fetchCourses() in useMemo, just pass the function reference
  const contextValue = useMemo(
    () => ({
      courses,
      lectures,
      assignments,
      course,
      lecture,
      assignment,
      loading,
      error,
      fetchCourses,
      getCourseById,
      getLectureById,
      getAssignmentById,
    }),
    [
      courses,
      lectures,
      assignments,
      course,
      lecture,
      assignment,
      loading,
      error,
    ]
  );

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};

export default DataProvider;
