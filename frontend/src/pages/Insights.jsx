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
import { useActionState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function Insights() {
  const [activeTab, setActiveTab] = useState("heartRate"); // Default tab

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "heartRate":
        return (
          <div className="heartrate-insights-container">
            <div className="heartrate-section">
              <div className="graph-container">
                <h5>Resting Heart Rate History (Last 3 Days)</h5>
                <Line data={restingHeartRateChartData} />
              </div>

              <div className="info-container">
                <p>
                  The graph shows the resting heart rate trend for the last
                  three days.
                </p>
              </div>
            </div>

            <div className="heartrate-section">
              <div className="graph-container">
                <h5>Intraday Heart Rate History (Available for Last 3 Days)</h5>

                <label htmlFor="date-select">Select Date: </label>
                <select
                  id="date-select"
                  onChange={(e) =>
                    console.log(`Selected Date: ${e.target.value}`)
                  }
                >
                  <option value="2025-01-01">2025-01-01</option>
                  <option value="2024-12-31">2024-12-31</option>
                  <option value="2024-12-30">2024-12-30</option>
                </select>
                <Line data={restingHeartRateChartData} />
              </div>

              <div className="info-container">
                <p>
                  This graph shows intraday heart rate insights for selected
                  day.
                </p>
                <p>
                  Use the dropdown to select a date and view intraday heart rate
                  data. Data only availble for the last 3 days.
                </p>
              </div>
            </div>
          </div>
        );

      case "sleep":
        return (
          <div>
            <h4>Sleep insights</h4>
          </div>
        );

      case "steps":
        return <h4>Steps insights</h4>;

      case "oxygen":
        return (
          <div>
            <h4>Blood oxygen saturation Insights</h4>
          </div>
        );

      case "hrv":
        return (
          <div>
            <h4>Heart Rate Variability Insights</h4>
          </div>
        );

      case "skinTemp":
        return (
          <div>
            <h4>Skin Temperature Insights</h4>
          </div>
        );

      case "breathingRate":
        return (
          <div>
            <h4>Breathing Rate Insights</h4>
          </div>
        );
    }
  };

  return (
    <>
      <div className="tab">
        <button
          className={activeTab === "heartRate" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("heartRate")}
        >
          Heart Rate
        </button>

        <button
          className={activeTab === "sleep" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("sleep")}
        >
          Sleep
        </button>

        <button
          className={activeTab === "steps" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("steps")}
        >
          Steps
        </button>

        <button
          className={activeTab === "oxygen" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("oxygen")}
        >
          Oxygen Level
        </button>

        <button
          className={activeTab === "hrv" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("hrv")}
        >
          Heart Rate Variability
        </button>

        <button
          className={activeTab === "skinTemp" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("skinTemp")}
        >
          Skin Temperature
        </button>

        <button
          className={activeTab === "breathingRate" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("breathingRate")}
        >
          Breathing Rate
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">{renderTabContent()}</div>
    </>
  );
}
