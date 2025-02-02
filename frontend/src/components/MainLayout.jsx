import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { PatientContext } from "../context/PatientContext";
import { useState, useEffect, useContext } from "react";

export default function MainLayout() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const [unreadCount, setUnreadCount] = useState(0);

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

        // Calculate unread alerts count
        const unreadCount = data.filter((alert) => !alert.read).length;
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, [selectedPatientEmail]);

  return (
    <div className="layout">
      <Sidebar unreadCount={unreadCount} />
      <div className="main-content">
        <Header />
        <main className="content">
          <Outlet context={{ setUnreadCount }} />
        </main>
      </div>
    </div>
  );
}
