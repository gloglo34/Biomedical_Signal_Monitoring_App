import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/Auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the backend</h1>");
});

app.get("/callback", (req, res) => {
  res.send("<h1>Callback url</h1>");
});

//routes
app.use("/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gloriazhou34@gmail.com",
    pass: process.env.AppPassword,
  },
});

var mailOptions = {
  from: "gloriazhou34@gmail.com",
  to: "geezee2510@gmail.com",
  subject: "Request for authentication",
  text: "Hey I would like to monitor you remotely, please allow me to acces your fitbit data",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent:" + info.response);
  }
});
