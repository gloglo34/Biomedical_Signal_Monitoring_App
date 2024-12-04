import { Outlet, Navigate } from "react-router-dom";
import UseAuth from "./useAuth";

export default function PublicRoutes() {
  const sth = UseAuth();
  return sth ? <Navigate to="/dashboard" /> : <Outlet />;
}
