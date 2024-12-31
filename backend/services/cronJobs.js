import cron from "node-cron";
import Patient from "../models/Patient.js";
import { saveHeartRate } from "./heartRateService.js";

cron.schedule("59 * * * *", async () => {
  console.log("Running minute heart rate sync...");
  const patients = await Patient.find();
  const today = new Date().toISOString().slice(0, 10);

  for (const patient of patients) {
    try {
      await saveHeartRate(
        patient.email,
        patient.fitbitUserId,
        patient.fitbitAccessToken,
        today
      );
      console.log(`Heart rate saved for patient: ${patient.email}`);
    } catch (error) {
      console.error(
        `Error syncing heart rate for patient ${patient.email}:`,
        error
      );
    }
  }
});
