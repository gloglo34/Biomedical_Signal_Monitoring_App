import cron from "node-cron";
import Patient from "../models/Patient.js";
import { saveHeartRate } from "./heartRateService.js";
import { saveHRV } from "./hrvService.js";
import { saveSpo2 } from "./Spo2Service.js";
import { saveSleep } from "./sleepService.js";

cron.schedule("59 * * * *", async () => {
  console.log("Running hourly syncing of health metrics...");

  try {
    //Fetch only authorized patients
    const authorizedPatients = await Patient.find({
      authorizationStatus: "Authorized",
    });

    if (authorizedPatients.length === 0) {
      console.log("No authorized patients found.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    for (const patient of authorizedPatients) {
      try {
        //Save heart rate data
        const hrSaved = await saveHeartRate(patient, today);
        if (hrSaved) {
          console.log(`Heart rate data saved for patient: ${patient.email}`);
        }

        // Save HRV data
        const hrvSaved = await saveHRV(patient, today);
        if (hrSaved) {
          console.log(`HRV data saved for patient: ${patient.email}`);
        }

        // Save Spo2 data
        const spo2Saved = await saveSpo2(patient, today);
        if (spo2Saved) {
          console.log(`SpO2 data saved for patient: ${patient.email}`);
        }

        //Save Sleep data
        const sleepSaved = await saveSleep(patient, today);
        if (sleepSaved) {
          console.log(`Sleep data saved for patient: ${patient.email}`);
        }
      } catch (error) {
        console.error(
          `Error syncing data for patient ${patient.email}`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Error fetching patients or running cron job:",
      error.message
    );
  }
});
