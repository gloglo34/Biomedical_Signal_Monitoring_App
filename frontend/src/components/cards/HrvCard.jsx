import { useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import { usePatientData } from "../../hooks/usePatientData";
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

export default function HrvCard() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const {
    data: patientData,
    isLoading,
    error,
  } = usePatientData(selectedPatientEmail);

  // Process HRV data for the chart
  const hrvData = patientData?.hrv?.hrv?.[0]?.minutes || [];
  const times = hrvData.map((item) =>
    new Date(item.minute).toLocaleTimeString()
  );
  const rmssdValues = hrvData.map((item) => item.value.rmssd);

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "HRV",
        data: rmssdValues,
        borderColor: "rgba(137, 196, 244)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "RMSSD (ms)",
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="hrv-card">
        <h4>HRV</h4>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hrv-card">
        <h4>HRV</h4>
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="hrv-card">
      <span className="card-header">
        <h4>HRV</h4>
        <i className="material-symbols-outlined">show_chart</i>
      </span>
      <div className="card-content">
        {hrvData.length > 0 ? (
          <Line data={chartData} options={options} height={300} width={400} />
        ) : (
          <p>No HRV data available.</p>
        )}
      </div>
    </div>
  );
}
