import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const sth = localStorage.getItem("email");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };
  return (
    <div>
      <h1>Welcome to the MediTrack Pro Dashboard</h1>
      <p>You are logged in as {sth}</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
