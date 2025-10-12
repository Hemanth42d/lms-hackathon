import { Routes, Route, Navigate } from "react-router";
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

function App() {
  return (
    <>
      <div className="App">
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
            <Route path="calendar" element={<StudentCalendar />} />
            <Route path="messages" element={<StudentMessages />} />
            <Route path="settings" element={<StudentSettings />} />
            <Route path="notifications" element={<StudentNotifications />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
