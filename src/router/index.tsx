import { LandingPage } from "@/pages/Common/LandingPage";
import HomePage from "@/pages/Common/HomePage";
import { Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default AppRoutes;
