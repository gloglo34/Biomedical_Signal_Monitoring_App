import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./MainLayout.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <div className="sidebar-brand">MediTrack</div>
        <span className="close-icon">X</span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <i className="material-symbols-outlined">dashboard</i>
          <Link to="/dashboard2">Dashboard</Link>
        </li>

        <li className="sidebar-list-item">
          <i className="material-symbols-outlined">notifications</i>
          <Link to="/dashboard2/alerts">Alerts</Link>
        </li>

        <li className="sidebar-list-item">
          <i className="material-symbols-outlined">search_insights</i>
          <Link to="/dashboard2/insights">Insights</Link>
        </li>

        <li className="sidebar-list-item">
          <i className="material-symbols-outlined">person</i>
          <Link to="/dashboard2/patientProfile">Profile</Link>
        </li>
      </ul>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
