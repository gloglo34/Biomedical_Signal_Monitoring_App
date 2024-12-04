import { Outlet, Navigate } from "react-router-dom";
import UseAuth from "./UseAuth";

export default function PrivateRoutes() {
  const sth = UseAuth();
  return sth ? <Outlet /> : <Navigate to="/" />;
}
