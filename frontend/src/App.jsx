import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard1 from "./pages/Dashboard1";
import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";
import ManagePatients from "./pages/ManagePatients";
import Dashboard2 from "./pages/Dashboard2";
import MainLayout from "./components/MainLayout";
import Alerts from "./pages/Alerts";
import Insights from "./pages/insights/Insights";
import PatientProfile from "./pages/PatientProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard1" element={<Dashboard1 />} />
          <Route path="/managePatients" element={<ManagePatients />} />
          <Route path="/dashboard2" element={<MainLayout />}>
            <Route index element={<Dashboard2 />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="insights" element={<Insights />} />
            <Route path="patientProfile" element={<PatientProfile />} />
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
