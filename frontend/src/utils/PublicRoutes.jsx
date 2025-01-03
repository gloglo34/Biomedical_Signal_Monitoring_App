import { Outlet, Navigate } from "react-router-dom";
import UseAuth from "./UseAuth";

export default function PublicRoutes() {
  const sth = UseAuth();
  return sth ? <Navigate to="/welcome" /> : <Outlet />;
}
