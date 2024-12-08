import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard1 from "./components/Dashboard1";
import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";
import AddPatient from "./components/AddPatient";
import Dashboard2 from "./components/Dashboard2";
import MainLayout from "./components/MainLayout";
import Alerts from "./components/Alerts";
import Insights from "./components/Insights";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard1" element={<Dashboard1 />} />
          <Route path="/addPatient" element={<AddPatient />} />
          <Route path="/dashboard2" element={<MainLayout />}>
            <Route index element={<Dashboard2 />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="insights" element={<Insights />} />
          </Route>
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
