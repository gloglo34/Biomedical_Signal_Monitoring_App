import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="layout">
      <Header />
      <div className="layout-content">
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
