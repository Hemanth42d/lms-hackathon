import { Routes, Route } from "react-router";
import LandingPageLayout from "./components/LandingPageComponents/LandingPageLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPageLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
