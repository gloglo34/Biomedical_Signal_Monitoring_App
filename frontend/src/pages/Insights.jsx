import { useState } from "react";

export default function Insights() {
  const [activeTab, setActiveTab] = useState("heartRate"); // Default tab

  const renderTabContent = () => {
    switch (activeTab) {
      case "heartRate":
        return (
          <div>
            <h4>Heart Rate insights</h4>
            <p>`What is HR and RHR`</p>
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
            <h4>Oxygen Level insights</h4>
            <p>
              Blood oxygen saturation estimates the amount of oxygen in the
              blood. Nighttime SpO2 is usually lower than daytime SpO2 due to
              the fact that your breathing rate is usually slower during sleep.
              In general, SpO2 values during sleep are typically above 90%.
              Tracking SpO2 can help you be more aware of your patient's oxygen
              saturation trends during sleep. The oxygen levels in blood tend to
              remain relatively constant, even during exercises and sleep
            </p>
          </div>
        );

      case "hrv":
        return (
          <div>
            <h4>Heart Rate Variability Insights</h4>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="tab">
        <button
          className={activeTab === "heartRate" ? "tab active" : "tab"}
          onClick={() => setActiveTab("heartRate")}
        >
          Heart Rate
        </button>

        <button
          className={activeTab === "sleep" ? "tab active" : "tab"}
          onClick={() => setActiveTab("sleep")}
        >
          Sleep
        </button>

        <button
          className={activeTab === "steps" ? "tab active" : "tab"}
          onClick={() => setActiveTab("steps")}
        >
          Steps
        </button>

        <button
          className={activeTab === "oxygen" ? "tab active" : "tab"}
          onClick={() => setActiveTab("oxygen")}
        >
          Oxygen Level
        </button>

        <button
          className={activeTab === "hrv" ? "tab active" : "tab"}
          onClick={() => setActiveTab("hrv")}
        >
          HRV
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}
