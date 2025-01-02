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

export default function HeartRateInsights() {
  const { selectedPatientEmail } = useContext(PatientContext);

  const [restingHeartRateData, setRestingHeartRateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [intradayData, setIntradayData] = useState([]);
  const [lastThreeDates, setLastThreeDates] = useState([]);

  //Generate the last 3 dates dynamically
  const generateLastThreeDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); //Format:YYYY:MM:DD
    }
    return dates;
  };

  useEffect(() => {
    if (!selectedPatientEmail) return;

    //Fetch data from history endpoint (database)
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/history/heartrate?email=${selectedPatientEmail}`
        );

        const data = await response.json();

        const lastThree = generateLastThreeDates();
        setLastThreeDates(lastThree);

        //Process resting heart rate data
        const processedRestingData = lastThree.map((date) => {
          const entry = data.restingHeartRate.find(
            (item) => item.date === date
          );
          return {
            date,
            restingHeartRate: entry ? entry.restingHeartRate : null,
          };
        });

        setRestingHeartRateData(processedRestingData);

        // Set the most recent date as the default selected date
        setSelectedDate(lastThree[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPatientEmail]);

  useEffect(() => {
    if (!selectedDate || !selectedPatientEmail) return;

    //Fetch intraday data for the selected date
    const fetchIntradayData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/history/heartrate?email=${selectedPatientEmail}`
        );
        const data = await response.json();

        const entry = data.intraday.find((item) => item.date === selectedDate);
        setIntradayData(entry ? entry.intraday : []); //set intraday data or empty if not available
        setLoading(false);
      } catch (error) {
        console.error("Error fetching intraday data:", error);
        setLoading(false);
      }
    };
    fetchIntradayData();
  }, [selectedDate, selectedPatientEmail]);

  const restingHeartRateChartData = {
    labels: restingHeartRateData.map((item) => item.date),
    datasets: [
      {
        label: "Resting Heart Rate (bpm)",
        data: restingHeartRateData.map((item) => item.restingHeartRate),
        borderColor: "rgba(137, 196, 244)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const intradayHeartRateChartData = {
    labels: intradayData.map((item) => item.time),
    datasets: [
      {
        label: "Intraday Heart Rate (bpm)",
        data: intradayData.map((item) => item.value),
        borderColor: "rgba(137, 196, 244)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="heartrate-insights-container">
      <div className="heartrate-section">
        <div className="graph-container">
          <h5>Intraday Heart Rate History</h5>
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
          <Line data={intradayHeartRateChartData} />
        </div>
        <div className="info-container">
          <p>
            This graph shows intraday heart rate insights for the selected day.
            Use the dropdown to view minute-by-minute data.
          </p>
        </div>
      </div>

      <div className="heartrate-section">
        <div className="graph-container">
          <h5>Resting Heart Rate History (Last 3 Days)</h5>
          <Line data={restingHeartRateChartData} />
        </div>
        <div className="info-container">
          <p>
            The graph shows the resting heart rate trend for the last three
            days.
          </p>
        </div>
      </div>
    </div>
  );
}
