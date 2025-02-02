import { useEffect, useState, useContext } from "react";
import { PatientContext } from "../context/PatientContext";
import "../styles/PatientProfile.css";

export default function PatientProfile() {
  const { selectedPatientEmail } = useContext(PatientContext);

  const [age, setAge] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatar, setAvatar] = useState("");

  const [device, setDevice] = useState("");
  const [batteryLevel, setBatteryLevel] = useState("");
  const [type, setType] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState();

  useEffect(() => {
    if (!selectedPatientEmail) return;

    const fetchPatientProfileData = async () => {
      try {
        const response = await fetch(
          `https://localhost:443/fitbitData/profile?email=${selectedPatientEmail}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        setAge(res.user.age || "N/A");
        setGender(res.user.gender || "N/A");
        setFirstName(res.user.firstName || "N/A");
        setLastName(res.user.lastName || "N/A");
        setWeight(res.user.weight || "N/A");
        setHeight(res.user.height || "N/A");
        setDateOfBirth(res.user.dateOfBirth || "N/A");
        setAvatar(res.user.avatar || "https://via.placeholder.com/150");
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
      }
    };

    const fetchDeviceInfo = async () => {
      try {
        const response = await fetch(
          `https://localhost:443/fitbitData/devices?email=${selectedPatientEmail}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        setDevice(res[0].deviceVersion || "N/A");
        setBatteryLevel(res[0].batteryLevel || "N/A");
        setType(res[0].type || "N/A");
        setLastSyncTime(res[0].lastSyncTime || "N/A");
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
      }
    };
    fetchPatientProfileData();
    fetchDeviceInfo();
  }, [selectedPatientEmail]);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Patient Profile</h2>
        <img src={avatar} className="profile-avatar" />
        <p>
          <strong>First Name: </strong> {firstName}
        </p>
        <p>
          <strong>Last Name: </strong>
          {lastName}
        </p>
        <p>
          <strong>Age: </strong>
          {age}
        </p>
        <p>
          <strong>Gender: </strong> {gender}
        </p>
        <p>
          <strong>Date of Birth:</strong> {dateOfBirth}
        </p>
        <p>
          <strong>Weight: </strong>
          {weight} kg
        </p>
        <p>
          <strong>Height: </strong> {height} cm
        </p>
      </div>

      <div className="device-info">
        <h2>Device Information</h2>
        <p>
          <strong>Device: </strong>
          {device}
        </p>
        <p>
          <strong>Battery Level: </strong>
          {batteryLevel}%
        </p>
        <p>
          <strong>Type: </strong>
          {type}
        </p>
        <p>
          <strong>Last sync time: </strong>
          {lastSyncTime}
        </p>
      </div>
    </div>
  );
}
