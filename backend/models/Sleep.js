import mongoose from "mongoose";

const SleepSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: { type: String, required: true },
  duration: { type: Number, required: true },
  levelsData: [
    {
      dateTime: { type: String, required: true },
      level: { type: String, required: true },
      seconds: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now, index: { expires: "4d" } },
});

SleepSchema.index({ email: 1, date: 1 }, { unique: true });

export default mongoose.model("Sleep", SleepSchema);
