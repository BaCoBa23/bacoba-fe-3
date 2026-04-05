
import { LandingPage } from "@/pages/Common/LandingPage";

import { Route, Routes } from "react-router-dom";


function AppRoutes() {
  return (
    <Routes>
        <Route index element={<LandingPage />} />
    </Routes>
  );
}

export default AppRoutes;
