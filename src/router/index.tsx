import { LandingPage } from "@/pages/Common/LandingPage";
import HomePage from "@/pages/Common/HomePage";
import { Route, Routes } from "react-router-dom";
import ProductsList from "@/pages/Products/ProductsList";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/products-list" element={<ProductsList />} />
    </Routes>
  );
}

export default AppRoutes;
