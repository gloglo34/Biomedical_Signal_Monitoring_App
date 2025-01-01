import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./MainLayout.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard2");
  };

  const handleAlerts = () => {
    navigate("/dashboard2/alerts");
  };

  const handleInsights = () => {
    navigate("/dashboard2/insights");
  };

  const handlePatientProfile = () => {
    navigate("/dashboard2/patientProfile");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <div className="sidebar-brand">MediTrack</div>
        <span className="close-icon">X</span>
      </div>

      <div className="sidebar-list">
        <button className="sidebar-list-item" onClick={handleDashboard}>
          <i className="material-symbols-outlined">dashboard</i>
          Dashboard
        </button>

        <button className="sidebar-list-item" onClick={handleAlerts}>
          <i className="material-symbols-outlined">notifications</i>
          Alerts
        </button>

        <button className="sidebar-list-item" onClick={handleInsights}>
          <i className="material-symbols-outlined">search_insights</i>
          {/* <Link to="/dashboard2/insights">Insights</Link> */}
          Insights
        </button>

        <button className="sidebar-list-item" onClick={handlePatientProfile}>
          <i className="material-symbols-outlined">person</i>
          {/* <Link to="/dashboard2/patientProfile">Profile</Link> */}
          Profile
        </button>

        <button
          className="sidebar-list-item logout-button"
          onClick={handleLogout}
        >
          <i className="material-symbols-outlined">logout</i>
          Logout
        </button>
      </div>
    </aside>
  );
}
