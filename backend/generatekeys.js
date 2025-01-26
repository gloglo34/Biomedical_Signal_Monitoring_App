import Patient from "./models/Patient.js";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const patient = await Patient.findOne({ email: "gloriazhou34@gmail.com" });
console.log(patient.fitbitAccessToken); // Outputs the decrypted token
console.log(patient.fitbitRefreshToken); // Outputs the decrypted token
console.log(patient.fitbitUserId);
