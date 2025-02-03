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

export default function Spo2Card() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const {
    data: patientData,
    isLoading,
    error,
  } = usePatientData(selectedPatientEmail);

  // Safely access the SpO2 data
  const spo2Data = patientData?.spo2?.minutes || [];
  const values = spo2Data.map((item) => item.value);
  const minutes = spo2Data.map((item) =>
    new Date(item.minute).toLocaleTimeString()
  );

  // Prepare chart data
  const chartData = {
    labels: minutes,
    datasets: [
      {
        label: "SpO2 (%)",
        data: values,
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
          text: "SpO2 (%)",
        },
      },
      x: {
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="spo2-card">
        <h4>Oxygen Saturation</h4>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spo2-card">
        <h4>Oxygen Saturation</h4>
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="spo2-card">
      <span className="card-header">
        <h4>Oxygen Saturation</h4>
        <i className="material-symbols-outlined">spo2</i>
      </span>
      <div className="card-content">
        {values.length > 0 ? (
          <Line data={chartData} options={options} height={300} width={400} />
        ) : (
          <p>No SpO2 data available.</p>
        )}
      </div>
    </div>
  );
}
