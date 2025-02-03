import { useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import { usePatientData } from "../../hooks/usePatientData";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function SleepCard() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const {
    data: patientData,
    isLoading,
    error,
  } = usePatientData(selectedPatientEmail);

  // Process sleep data for the chart
  const sleepData = patientData?.sleep.sleep || [];
  const mainSleepRecord = sleepData.find((record) => record.isMainSleep);

  const levels =
    mainSleepRecord?.levels?.data.map((item) => {
      switch (item.level) {
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
    }) || [];

  const times =
    mainSleepRecord?.levels?.data.map((item) =>
      new Date(item.dateTime).toLocaleTimeString()
    ) || [];

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "Sleep",
        data: levels,
        stepped: true,
        borderColor: "rgba(137, 196, 244)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Sleep Level",
        },
        ticks: {
          callback: function (value) {
            switch (value) {
              case 3:
                return "Wake";
              case 2:
                return "Light";
              case 1:
                return "REM";
              case 0:
                return "Deep";
              default:
                return "";
            }
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="sleep-card">
        <h4>Sleep</h4>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sleep-card">
        <h4>Sleep</h4>
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="sleep-card">
      <span className="card-header">
        <h4>Sleep</h4>
        <i className="material-symbols-outlined">bedtime</i>
      </span>
      <div className="card-content">
        {levels.length > 0 ? (
          <Line data={chartData} options={options} width={400} height={300} />
        ) : (
          <p>No sleep data available.</p>
        )}
      </div>
    </div>
  );
}
