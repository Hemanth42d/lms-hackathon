import { Routes, Route, Navigate } from "react-router-dom";
import LandingPageLayout from "./components/LandingPageComponents/LandingPageLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDashboardLayout from "./pages/StudentDashboardLayout";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import StudentCalendar from "./pages/StudentCalendar";
import StudentMessages from "./pages/StudentMessages";
import StudentSettings from "./pages/StudentSettings";
import StudentMyCourses from "./components/StudentDashboard/StudentMyCourses";
import StudentNotifications from "./pages/StudentNotifications";
import StudentCourseLearning from "./pages/StudentCourseLearning";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherDashboardLayout from "./components/TeacherDashboard/TeacherDashboardLayout";
import TeacherCourses from "./pages/TeacherCourses";
import CourseLectures from "./pages/CourseLectures";
import CourseAssignments from "./pages/CourseAssignments";
import CourseDiscussions from "./pages/CourseDiscussions";
import TeacherMessages from "./pages/TeacherMessages";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherSettings from "./pages/TeacherSettings";
import CourseDetail from "./pages/CourseDetail";
import AdminLayout from "./components/adminDashboard/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CourseContext from "../context/CourseContext";
import AuthProvider from "../context/AuthContext";

function App() {
  return (
    <>
      <div className="App">
        <AuthProvider>
        <CourseContext>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPageLayout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Student Dashboard Routes */}
            <Route path="/student" element={<StudentDashboardLayout />}>
              <Route
                index
                element={<Navigate to="/student/dashboard" replace />}
              />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="my-courses" element={<StudentMyCourses />} />
              <Route
                path="course/:courseId/learn"
                element={<StudentCourseLearning />}
              />
              <Route path="calendar" element={<StudentCalendar />} />
              <Route path="messages" element={<StudentMessages />} />
              <Route path="settings" element={<StudentSettings />} />
              <Route path="notifications" element={<StudentNotifications />} />
            </Route>

            <Route path="/teacher" element={<TeacherDashboardLayout />}>
              <Route
                index
                element={<Navigate to="/teacher/dashboard" replace />}
              />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="courses" element={<TeacherCourses />} />
              <Route path="messages" element={<TeacherMessages />} />
              <Route path="profile" element={<TeacherProfile />} />
              <Route path="settings" element={<TeacherSettings />} />

              {/* Individual Course Management Routes */}
              <Route path="course/:courseId" element={<CourseDetail />}>
                {/* Default to lectures when entering a course */}
                <Route index element={<Navigate to="lectures" replace />} />
                <Route path="lectures" element={<CourseLectures />} />
                <Route path="assignments" element={<CourseAssignments />} />
                <Route path="discussions" element={<CourseDiscussions />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CourseContext>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
