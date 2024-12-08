import { Link } from "react-router-dom";

export default function Sidebar() {
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
    </aside>
  );
}
