import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes() {
  const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return <Navigate to="/" replace={true} />;
    }
    return <Outlet />
}
