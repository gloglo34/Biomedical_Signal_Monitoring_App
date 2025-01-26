import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../context/PatientContext";
import "../styles/Alerts.css";

export default function Alerts() {
  const { selectedPatientEmail } = useContext(PatientContext);

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedPatientEmail) return;

    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          `https://localhost:443/alerts?email=${selectedPatientEmail}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const data = await response.json();
        setAlerts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [selectedPatientEmail]);

  const markAsRead = async (id) => {
    try {
      await fetch(`https://localhost:443/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert._id === id ? { ...alert, read: true } : alert
        )
      );
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  const dismissAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert._id !== id));
  };

  return (
    <div className="alerts-page">
      <h2>Alerts</h2>
      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No alerts found.</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`alert-item ${alert.read ? "read" : "unread"}`}
            >
              <p>
                <strong>{new Date(alert.timestamp).toLocaleString()}</strong>
              </p>
              <p>{alert.message}</p>
              <div className="alert-actions">
                {!alert.read && (
                  <button onClick={() => markAsRead(alert._id)}>
                    Mark as Read
                  </button>
                )}
                <button onClick={() => dismissAlert(alert._id)}>Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
