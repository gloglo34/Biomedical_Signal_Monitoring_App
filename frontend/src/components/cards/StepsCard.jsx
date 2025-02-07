import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { useContext } from "react";
import { PatientContext } from "../../context/PatientContext";
import { usePatientData } from "../../hooks/usePatientData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function StepsCard() {
  const { selectedPatientEmail } = useContext(PatientContext);
  const {
    data: patientData,
    isLoading,
    error,
  } = usePatientData(selectedPatientEmail);

  // Process steps data for the chart
  const stepsData =
    patientData?.steps?.["activities-steps-intraday"]?.dataset || [];
  const times = stepsData.map((item) => item.time);
  const values = stepsData.map((item) => item.value);

  const totalSteps =
    patientData?.steps?.["activities-steps"]?.[0]?.value || "N/A";

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "Steps",
        data: values,
        backgroundColor: "rgba(137, 196, 244)",
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Steps",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="steps-card">
        <h4>Steps</h4>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="steps-card">
        <h4>Steps</h4>
        <p>Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="steps-card">
      <span className="card-header">
        <h4>Steps</h4>
        <i className="material-symbols-outlined">footprint</i>
      </span>
      <div className="card-content">
        <p>Total steps : {totalSteps}</p>
        {stepsData.length > 0 ? (
          <Bar data={chartData} options={options} width={400} height={300} />
        ) : (
          <p>No steps data available.</p>
        )}
      </div>
    </div>
  );
}
