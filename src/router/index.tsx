import { LandingPage } from "@/pages/Common/LandingPage";
import HomePage from "@/pages/Common/HomePage";
import { Route, Routes } from "react-router-dom";
import ProductsList from "@/pages/Products/ProductsList";
import ReceivedNotesList from "@/pages/ReceivedNote/ReceivedNotesList";
import ProvidersList from "@/pages/Provider/ProvidersList";
import SaleProcess from "@/pages/Sale/SaleProcess";
import BillsList from "@/pages/Bill/BillsList";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/products" element={<ProductsList />} />
      <Route path="/received-notes" element={<ReceivedNotesList />} />
      <Route path="/providers" element={<ProvidersList />} />
      <Route path="/sale" element={<SaleProcess />} />
      <Route path="/bills" element={<BillsList />} />
    </Routes>
  );
}

export default AppRoutes;
