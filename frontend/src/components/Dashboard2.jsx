import { useLocation } from "react-router-dom";

export default function Dashboard2() {
  const location = useLocation();
  const email = location.state?.email;

  const mockHealthMetrics = {
    heartRate: 72, // Normal resting heart rate
    steps: 8500, // Steps walked
    caloriesBurned: 350, // Calories burned
    sleepHours: 7, // Sleep duration
  };

  return (
    <div>
      <h1>You are monitoring {email}</h1>;<h2>Health metrics</h2>
      <p>
        <strong>Heart Rate: </strong>
        {mockHealthMetrics.heartRate}
      </p>
      <p>
        <strong>Steps: </strong>
        {mockHealthMetrics.steps}
      </p>
    </div>
  );
}
