import { useState } from "react";
import "./Insights.css";

export default function Insights() {
  const [activeTab, setActiveTab] = useState("heartRate"); // Default tab

  const renderTabContent = () => {
    switch (activeTab) {
      case "heartRate":
        return (
          <div>
            <h4>Heart Rate insights</h4>
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
