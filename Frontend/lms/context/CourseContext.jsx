import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState(null);

  // Fetch all courses
  const fetchCourses = async () => {
    const res = await axiosInstance.get("/courses");
    setCourses(res.data);
  };

  // Fetch single course
  const fetchCourse = async (id) => {
    const res = await axiosInstance.get(`/courses/${id}`);
    setCourse(res.data);
  };

  // Fetch all lectures for a course
  const fetchLectures = async (courseId) => {
    const res = await axiosInstance.get(`/courses/${courseId}/lectures`);
    setLectures(res.data);
  };

  // Fetch single lecture
  const fetchLecture = async (lectureId) => {
    const res = await axiosInstance.get(`/lectures/${lectureId}`);
    setLecture(res.data);
  };

  // Fetch all assignments for a course
  const fetchAssignments = async (courseId) => {
    const res = await axiosInstance.get(`/courses/${courseId}/assignments`);
    setAssignments(res.data);
  };

  // Fetch single assignment
  const fetchAssignment = async (assignmentId) => {
    const res = await axiosInstance.get(`/assignments/${assignmentId}`);
    setAssignment(res.data);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        course,
        lectures,
        lecture,
        assignments,
        assignment,
        fetchCourses,
        fetchCourse,
        fetchLectures,
        fetchLecture,
        fetchAssignments,
        fetchAssignment,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
