import { Navigate, Outlet } from "react-router-dom";



function PublicRouters() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return <Navigate to="/home" replace={true} />;
  }
  return <Outlet />;
}

export default PublicRouters;
