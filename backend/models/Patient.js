import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },

  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  authorizationStatus: {
    type: String,
    enum: ["Pending", "Authorized", "Revoked"],
    default: "Pending",
  },

  fitbitAccessToken: { type: String },

  fitbitRefreshToken: { type: String },

  fitbitUserId: { type: String },

  fitbitScopes: { type: String },

  tokenExpiresIn: { type: Number },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Patient", patientSchema);
