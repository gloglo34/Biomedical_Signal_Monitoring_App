import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//Shared query function to fetch patient data
const fetchPatientData = async (email) => {
  if (!email) return;

  const [
    hrResponse,
    stepsResponse,
    hrvResponse,
    spo2Response,
    sleepResponse,
    skinTempResponse,
    brResponse,
    profileResponse,
    devicesResponse,
  ] = await Promise.all([
    axios.get(`https://localhost:443/fitbitData/heartrate?email=${email}`),
    axios.get(`https://localhost:443/fitbitData/steps?email=${email}`),
    axios.get(`https://localhost:443/fitbitData/hrv?email=${email}`),
    axios.get(`https://localhost:443/fitbitData/spo2?email=${email}`),
    axios.get(`https://localhost:443/fitbitData/sleep?email=${email}`),
    axios.get(`https://localhost:443/fitbitData/skinTemp?email=${email}`),
    axios.get(`https://localhost:443/fitbitData/br?email=${email}`),
    axios.get(`https://localhost:443/fitbitData/profile?email=${email}`),
    axios.get(`https://localhost:443/fitbitData/devices?email=${email}`),
  ]);

  //Return the raw responses from each endpoint
  return {
    heartrate: hrResponse.data,
    steps: stepsResponse.data,
    hrv: hrvResponse.data,
    spo2: spo2Response.data,
    sleep: sleepResponse.data,
    skinTemp: skinTempResponse.data,
    br: brResponse.data,
    profile: profileResponse.data,
    devices: devicesResponse.data,
  };
};

export const usePatientData = (email) => {
  return useQuery({
    queryKey: ["patientData", email],
    queryFn: () => fetchPatientData(email),
    enabled: !!email, //Only fetch if email is defined
    refetchInterval: 5 * 60 * 1000, //Refetch every 5min
    staleTime: 5 * 60 * 1000, //Mark data as fresh for 5 minutes
  });
};
