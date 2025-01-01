import mongoose from "mongoose";

const spo2Schema = mongoose.Schema({
  email: { type: String, requred: true },
  date: { type: String, requred: true },
  minutes: [
    {
      minute: {
        type: String,
        required: true,
      },

      value: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "4d" },
  },
});

//Unique index to prevent duplicate entries for the same email and date
spo2Schema.index({ email: 1, date: 1 }, { unique: true });

export default mongoose.model("Spo2", spo2Schema);
