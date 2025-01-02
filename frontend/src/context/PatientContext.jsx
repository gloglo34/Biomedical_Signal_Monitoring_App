import { createContext, useState } from "react";

export const PatientContext = createContext();

export function PatientProvider({ children }) {
  const [selectedPatientEmail, setSelectedPatientEmail] = useState("");

  return (
    <PatientContext.Provider
      value={{ selectedPatientEmail, setSelectedPatientEmail }}
    >
      {children}
    </PatientContext.Provider>
  );
}
