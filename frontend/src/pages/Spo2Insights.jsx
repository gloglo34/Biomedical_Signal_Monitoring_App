import { useEffect, useState } from "react";
import "./Insights.css";
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
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [intradayData, setIntradayData] = useState([]);
  const [lastThreeDates, setLastThreeDates] = useState([]);

  // Generate the last 3 dates dynamically
  const generateLastThreeDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    }
    return dates;
  };

  useEffect(() => {
    // Set the last 3 dates
    const lastThree = generateLastThreeDates();
    setLastThreeDates(lastThree);
    setSelectedDate(lastThree[0]); // Default to the most recent date
  }, []);

  useEffect(() => {
    // Fetch SpO2 intraday data for the selected date
    const fetchIntradayData = async () => {
      if (!selectedDate) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/history/spo2?email=gloriazhou34@gmail.com`
        );
        const data = await response.json();

        const entry = data.spo2.find((item) => item.date === selectedDate);
        setIntradayData(entry ? entry.minutes : []); // Set intraday data or empty array if not available
        setLoading(false);
      } catch (error) {
        console.error("Error fetching SpO2 intraday data:", error);
        setLoading(false);
      }
    };

    fetchIntradayData();
  }, [selectedDate]);

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
        tension: 0.1,
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
