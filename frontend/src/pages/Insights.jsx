import { useState } from "react";
import "./Insights.css";
import HeartRateInsights from "./HeartRateInsights";
import SleepInsights from "./SleepInsights";
import Spo2Insights from "./Spo2Insights";
import StepsInsights from "./StepsInsights";
import HRVInsights from "./HRVInsights";
import BRInsights from "./BRInsights";
import SkinTempInsights from "./SkinTempInsights";

export default function Insights() {
  const [activeTab, setActiveTab] = useState("heartRate"); // Default tab

  const renderTabContent = () => {
    switch (activeTab) {
      case "heartRate":
        return <HeartRateInsights />;

      case "sleep":
        return <SleepInsights />;

      case "steps":
        return <StepsInsights />;

      case "oxygen":
        return <Spo2Insights />;

      case "hrv":
        return <HRVInsights />;

      case "skinTemp":
        return <SkinTempInsights />;

      case "breathingRate":
        return <BRInsights />;
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
