import mongoose from "mongoose";

const heartRateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: { type: String, required: true },
  restingHeartRate: { type: Number },
  intraday: [
    {
      time: { type: String },
      value: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now, index: { expires: "4d" } },
});

heartRateSchema.index({ email: 1, date: 1 }, { unique: true });

export default mongoose.model("HeartRate", heartRateSchema);
