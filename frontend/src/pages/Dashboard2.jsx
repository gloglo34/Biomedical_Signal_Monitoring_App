import { useLocation } from "react-router-dom";

export default function Dashboard2() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div>
      <h2>Health metrics will appear here</h2>
    </div>
  );
}
