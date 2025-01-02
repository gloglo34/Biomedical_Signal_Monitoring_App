import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { PatientProvider } from "../context/PatientContext";

export default function MainLayout() {
  return (
    <PatientProvider>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </PatientProvider>
  );
}
