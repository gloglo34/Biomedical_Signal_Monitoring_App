import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  authorizationStatus: { type: String, default: "Pending" },
  fitbitAccessToken: { type: String },
  fitbitRefreshToken: { type: String },
  fitbitUserId: { type: String },
  fitbitScopes: { type: String },
  tokenExpiresIn: { type: Number },
  addedBy: { type: [String] },
});

export default mongoose.model("Patient", patientSchema);
