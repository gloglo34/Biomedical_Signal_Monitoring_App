import mongoose from "mongoose";

const minuteSchema = new mongoose.Schema({});

const hrvSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: { type: String, required: true },
  minutes: [
    {
      minute: { type: String, required: true },
      value: {
        rmssd: { type: Number, required: true },
        coverage: { type: Number },
        hf: { type: Number },
        lf: { type: Number },
      },
    },
  ],
  createdAt: { type: Date, default: Date.now, index: { expires: "4d" } },
});

//Unique index to prevent duplicate entries for the same email and date
hrvSchema.index({ email: 1, date: 1 }, { unique: true });

export default mongoose.model("HRV", hrvSchema);
