import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import "../../styles/Insights.css";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function SpO2Insights() {
  const { selectedPatientEmail } = useContext(PatientContext);

  const [selectedDate, setSelectedDate] = useState("");
  const [intradayData, setIntradayData] = useState([]);
  const [lastThreeDates, setLastThreeDates] = useState([]);
  const [loading, setLoading] = useState([]);

  // Generate the last 3 dates dynamically
  function generateLastThreeDates() {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    }
    return dates;
  }

  useEffect(() => {
    if (!selectedPatientEmail) return;

    // Fetch SpO2 intraday data for the selected date
    const fetchIntradayData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/history/spo2?email=${selectedPatientEmail}`
        );
        const data = await response.json();

        const entry = data.spo2.find((item) => item.date === selectedDate);
        setIntradayData(entry ? entry.minutes : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching SpO2 intraday data:", error);
        setLoading(false);
      }
    };

    fetchIntradayData();
  }, [selectedDate, selectedPatientEmail]);

  useEffect(() => {
    // Reset date selection when patient changes
    const lastThree = generateLastThreeDates();
    setLastThreeDates(lastThree);
    setSelectedDate(lastThree[0]);
  }, [selectedPatientEmail]);

  const intradaySpO2ChartData = {
    labels: intradayData.map((item) =>
      new Date(item.minute).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "SpO2 (%)",
        data: intradayData.map((item) => item.value),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="spo2-insights-container">
      <div className="graph-container">
        <h5>SpO2 Insights</h5>
        <label htmlFor="date-select">Select Date: </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {lastThreeDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
        <Line data={intradaySpO2ChartData} />
      </div>
      <div className="info-container">
        <p>
          This graph shows the intraday SpO2 data for the selected date. Use the
          dropdown to view minute-by-minute data for the last three days.
        </p>
      </div>
    </div>
  );
}
