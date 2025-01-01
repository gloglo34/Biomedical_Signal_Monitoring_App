import cron from "node-cron";
import Patient from "../models/Patient.js";
import { saveHeartRate } from "./heartRateService.js";
import { saveHRV } from "./hrvService.js";
import { saveSpo2 } from "./Spo2Service.js";

cron.schedule("59 * * * *", async () => {
  console.log("Running hourly heart rate sync...");
  const patients = await Patient.find();
  const today = new Date().toISOString().slice(0, 10);

  for (const patient of patients) {
    try {
      //Save heart rate data
      await saveHeartRate(
        patient.email,
        patient.fitbitUserId,
        patient.fitbitAccessToken,
        today
      );
      console.log(`Heart rate saved for patient: ${patient.email}`);

      // Save HRV data
      await saveHRV(
        patient.email,
        patient.fitbitUserId,
        patient.fitbitAccessToken,
        today
      );
      console.log(`HRV data saved for patient: ${patient.email}`);

      //Save Spo2 data
      await saveSpo2(
        patient.email,
        patient.fitbitUserId,
        patient.fitbitAccessToken,
        today
      );
      console.log(`Spo2 data saved for patient: ${patient.email}`);
    } catch (error) {
      console.error(
        `Error syncing heart rate for patient ${patient.email}:`,
        error
      );
    }
  }
});
