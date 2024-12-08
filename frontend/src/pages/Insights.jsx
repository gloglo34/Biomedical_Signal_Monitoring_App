import { useState } from "react";

export default function Insights() {
  const [activeTab, setActiveTab] = useState("heartRate"); // Default tab

  const renderTabContent = () => {
    switch (activeTab) {
      case "heartRate":
        return <h4>Heart Rate insights</h4>;
      case "sleep":
        return <h4>Sleep insights</h4>;
      case "steps":
        return <h4>Steps insights</h4>;
      case "oxygen":
        return <h4>Oxygen Level insights</h4>;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="tabs-menu">
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
      </div>

      {/* Tab Content */}
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}
