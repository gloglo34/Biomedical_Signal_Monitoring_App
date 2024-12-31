import mongoose, { Schema } from "mongoose";

const alertSchema = new mongoose.Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  time: String,
  value: Number,
  message: { type: String, default: "Abnornal reading detected" },
  read: { type: Boolean, default: false },
});

export default mongoose.model("Alert", alertSchema);
