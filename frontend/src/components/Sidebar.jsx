import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <aside className="app-sidebar">
      <ul>
        <li>
          <Link to="/dashboard2">Dashboard</Link>
        </li>
        <li>
          <Link to="/dashboard2/alerts">Alerts</Link>
        </li>
        <li>
          <Link to="/dashboard2/insights">Insights</Link>
        </li>
      </ul>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
