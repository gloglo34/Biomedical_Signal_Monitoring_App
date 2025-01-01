import React, { useState } from "react";
import { Line } from "react-chartjs-2";

export default function HeartRateInsights() {
  const [selectedDate, setSelectedDate] = useState("2025-01-01");

  const restingHeartRateChartData = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [
      {
        label: "Resting Heart Rate (bpm)",
        data: [70, 68, 69],
        borderColor: "hsla(287, 91.70%, 42.50%, 0.30)",
        backgroundColor: "rgba(31, 111, 164, 0.3)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="heartrate-insights-container">
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
      <div className="heartrate-section">
        <div className="graph-container">
          <h5>Intraday Heart Rate History</h5>
          <label htmlFor="date-select">Select Date: </label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="2025-01-01">2025-01-01</option>
            <option value="2024-12-31">2024-12-31</option>
            <option value="2024-12-30">2024-12-30</option>
          </select>
          <Line data={restingHeartRateChartData} />
        </div>
        <div className="info-container">
          <p>
            This graph shows intraday heart rate insights for the selected day.
            Use the dropdown to view minute-by-minute data.
          </p>
        </div>
      </div>
    </div>
  );
}
