import { useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import { usePatientData } from "../../hooks/usePatientData";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(LinearScale, CategoryScale, BarElement, Tooltip);

export default function BrCard() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const {
    data: patientData,
    isLoading,
    error,
  } = usePatientData(selectedPatientEmail);

  // Safely access the BR data
  const brData = patientData?.br?.br?.[0]?.value || {};
  const sleepStages = ["Deep", "REM", "Full", "Light"];
  const breathingRates = [
    brData.deepSleepSummary?.breathingRate || null,
    brData.remSleepSummary?.breathingRate !== -1
      ? brData.remSleepSummary?.breathingRate
      : null,
    brData.fullSleepSummary?.breathingRate || null,
    brData.lightSleepSummary?.breathingRate || null,
  ];

  // Prepare chart data
  const chartData = {
    labels: sleepStages,
    datasets: [
      {
        label: "Breathing Rate (bpm)",
        data: breathingRates,
        backgroundColor: "rgba(137, 196, 244)",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Breathing Rate (bpm)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Sleep Stage",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="br-card">
        <h4>Breathing Rate</h4>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="br-card">
        <h4>Breathing Rate</h4>
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="br-card">
      <span className="card-header">
        <h4>Breathing Rate</h4>
        <i className="material-symbols-outlined">pulmonology</i>
      </span>
      <div className="card-content">
        {breathingRates.some((rate) => rate !== null) ? (
          <Bar data={chartData} options={options} width={400} height={150} />
        ) : (
          <p>No Breathing Rate data available.</p>
        )}
      </div>
    </div>
  );
}
