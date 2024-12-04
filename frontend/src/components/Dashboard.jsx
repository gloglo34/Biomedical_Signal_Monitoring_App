export default function Dashboard() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (!user) {
    return <h1>User not found. Please log in again</h1>;
  }
  return (
    <div>
      <h1>Welcome to the MediTrack Pro Dashboard</h1>
      <p>You are logged in as {user.email}</p>
    </div>
  );
}
