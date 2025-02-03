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

export default function SleepInsights() {
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

    // Fetch sleep history data from the database
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:443/history/sleep?email=${selectedPatientEmail}`
        );

        const data = await response.json();

        const lastThree = generateLastThreeDates();
        setLastThreeDates(lastThree);

        //Process Sleep Data for the most recent date
        const record = data.find((item) => item.date === lastThree[0]);

        setIntradayData(
          record
            ? record.levelsData.map((entry) => ({
                time: entry.dateTime,
                level: entry.level,
                seconds: entry.seconds,
              }))
            : []
        );

        setSelectedDate(lastThree[0]);
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
        `https://localhost:443/history/sleep?email=${selectedPatientEmail}`
      );
      const data = await response.json();
      const record = data.find((item) => item.date === date);
      setIntradayData(
        record
          ? record.levelsData.map((entry) => ({
              time: entry.dateTime,
              level: entry.level,
              seconds: entry.seconds,
            }))
          : []
      );
    } catch (error) {
      console.error("Error updating HRV data for the selected date:", error);
    }
  };

  const sleepChartData = {
    labels: intradayData.map((entry) => entry.time.split("T")[1]),
    datasets: [
      {
        label: "Sleep stages",
        data: intradayData.map((entry) => {
          switch (entry.level) {
            case "wake":
              return 3;
            case "light":
              return 2;
            case "rem":
              return 1;
            case "deep":
              return 0;
            default:
              return null;
          }
        }),
        stepped: true,
        borderColor: "rgba(137, 196, 244, 1)",
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
          text: "Sleep stage",
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
        <h5>Sleep Insights</h5>
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
        <Line data={sleepChartData} options={options} />
      </div>

      <div className="info-container">
        <strong>Sleep timeline</strong>
        <p>
          When one is asleep, the body typically goes through several sleep
          cylcles that generally last between 90 - 120 minutes. Based on body
          signals and movement, Fitbit estimates 3 stages of sleep.
        </p>
        <ul>
          <li>
            <strong>Light sleep</strong>, when one moves more and occasionally
            wakeup for brief moments.
          </li>
          <li>
            <strong>Deep sleep</strong>, when one's heart beats slower and
            steadier, and movements might be less.
          </li>
          <li>
            <strong>REM sleep</strong>, when one tends to dream more vividly,
            and may see changes in heartrate and breathing
          </li>
        </ul>

        <strong>Graph contents</strong>
        <p></p>
        <strong>Why it matters</strong>
        <p>
          Tracking sleep changes can help you understand your patient's sleep
          quality.
        </p>
      </div>
    </div>
  );
}
