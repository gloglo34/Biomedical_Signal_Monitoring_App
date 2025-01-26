import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import dotenv from "dotenv";

dotenv.config();

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

const encKey = process.env.MONGO_ENC_KEY;
const sigKey = process.env.MONGO_SIG_KEY;

patientSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["fitbitAccessToken", "fitbitRefreshToken", "fitbitUserId"],
});

export default mongoose.model("Patient", patientSchema);
