import { Routes, Route } from "react-router";
import LandingPageLayout from "./components/LandingPageComponents/LandingPageLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<LandingPageLayout />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
