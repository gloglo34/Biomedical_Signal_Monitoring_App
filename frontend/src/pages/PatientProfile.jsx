import { useEffect, useState } from "react";

export default function PatientProfile() {
  const [age, setAge] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchPatientProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/fitbitData/profile?email=gloriazhou34@gmail.com`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        setAge(res.user.age);
        setGender(res.user.gender);
        setFirstName(res.user.firstName);
        setLastName(res.user.lastName);
        setWeight(res.user.weight);
        setHeight(res.user.height);
        setDateOfBirth(res.user.dateOfBirth);
        setAvatar(res.user.avatar);
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
      }
    };
    fetchPatientProfileData();
  }, []);

  return (
    <div className="profile-card">
      <h2>Patient Profile Page</h2>
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
  );
}
