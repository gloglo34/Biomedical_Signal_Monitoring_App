import { useNavigate } from "react-router-dom";
import "../styles/MainLayout.css";

export default function Sidebar({ unreadCount }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleAlerts = () => {
    navigate("/dashboard/alerts");
  };

  const handleInsights = () => {
    navigate("/dashboard/insights");
  };

  const handlePatientProfile = () => {
    navigate("/dashboard/patientProfile");
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
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </button>

        <button className="sidebar-list-item" onClick={handleInsights}>
          <i className="material-symbols-outlined">search_insights</i>
          Insights
        </button>

        <button className="sidebar-list-item" onClick={handlePatientProfile}>
          <i className="material-symbols-outlined">person</i>
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
