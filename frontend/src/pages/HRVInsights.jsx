import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../context/PatientContext";
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

export default function HRVInsights() {
  const { selectedPatientEmail } = useContext(PatientContext);

  const [lastThreeDates, setLastThreeDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [intradayData, setIntradayData] = useState([]);

  // Generate the last 3 dates dynamically
  const generateLastThreeDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  useEffect(() => {
    if (!selectedPatientEmail) return;

    // Fetch HRV data from the server
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/history/hrv?email=${selectedPatientEmail}`
        );

        const data = await response.json();

        const lastThree = generateLastThreeDates();
        setLastThreeDates(lastThree);

        // Process HRV data for the most recent date
        const record = data.hrv.find((item) => item.date === lastThree[0]);
        setIntradayData(
          record
            ? record.minutes.map((entry) => ({
                time: entry.time,
                rmssd: entry.rmssd,
              }))
            : []
        );

        setSelectedDate(lastThree[0]); // Default to the most recent date
        setLoading(false);
      } catch (error) {
        console.error("Error fetching HRV data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPatientEmail]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    try {
      const response = await fetch(
        `http://localhost:5000/history/hrv?email=${selectedPatientEmail}`
      );
      const data = await response.json();

      const record = data.hrv.find((item) => item.date === date);
      setIntradayData(
        record
          ? record.minutes.map((entry) => ({
              time: entry.time,
              rmssd: entry.rmssd,
            }))
          : []
      );
    } catch (error) {
      console.error("Error updating HRV data for the selected date:", error);
    }
  };

  const hrvChartData = {
    labels: intradayData.map((item) =>
      new Date(item.time).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "RMSSD (ms)",
        data: intradayData.map((item) => item.rmssd),
        borderColor: "rgb(228, 145, 67)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "RMSSD (ms)",
        },
      },
    },
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="hrv-insights-container">
      <div className="graph-container">
        <h5>Heart Rate Variability Insights</h5>
        <label htmlFor="date-select">Select Date: </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
        >
          {lastThreeDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
        <Line data={hrvChartData} options={options} />
      </div>

      <div className="info-container">
        <p>
          HRV is the variation in the time between heartbeats. Even if your
          patient's heart rate is 60 beats per minute, it doesn’t mean their
          heart beats once a second. The autonomic nervous system determines the
          timing of each heartbeat. The RMSSD metric is used to calculate HRV.
          The latest HRV measurements come from the longest sleep periods, and
          history data is available for the last 3 days.
        </p>
      </div>
    </div>
  );
}
