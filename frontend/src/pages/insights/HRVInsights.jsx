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
          `https://localhost:443/history/hrv?email=${selectedPatientEmail}`
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
        `https://localhost:443/history/hrv?email=${selectedPatientEmail}`
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
        borderColor: "rgba(137, 196, 244)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.4,
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
        grid: {
          drawOnChartArea: false,
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
        <strong>What is heart rate variability?</strong>
        <p>
          HRV is the variation in time between heartbeats. The autonomic nervous
          system (ANS) determines the timing of each heartbeat. A common formula
          called RMSSD is used to determine HRV from heartrate data. HRV varies
          from person to person. Gender,sleep,hormones, circadian rhythm and
          lifestyle choices (e.g. caffeine,alcohol intake,exercise,stress) can
          all affect HRV.
        </p>
        <strong>Graph contents</strong>
        <p>
          In the graph ,the HRV measurements are from the longest sleep of that
          particular day. Only sleep periods greater than 3 hours are
          considered.
        </p>
        <strong>Why it matters</strong>
        <p>
          Studies show that a higher HRV is linked with better health. A
          significant drop in HRV may indicate stress or strain in the body or
          potential signs of illness.
        </p>
      </div>
    </div>
  );
}
