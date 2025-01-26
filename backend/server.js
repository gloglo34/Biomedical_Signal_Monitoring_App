import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/auth.js";
import EmailRoutes from "./routes/EmailRoutes.js";
import OAuth2Routes from "./routes/OAuth2Routes.js";
import PatientRoutes from "./routes/PatientRoutes.js";
import DataRoutes from "./routes/DataRoutes.js";
import AlertRoutes from "./routes/AlertRoutes.js";
import "./services/cronJobs.js";
import HistoryRoutes from "./routes/HistoryRoutes.js";
import https from "https";
import fs from "fs";

dotenv.config();

const app = express();

//Load SSL certificate and private key
const sslOptions = {
  key: fs.readFileSync("./certs/server.key"),
  cert: fs.readFileSync("./certs/server.crt"),
};

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the backend. HTTPS is working!</h1> ");
});

app.get("/callback", (req, res) => {
  res.send("<h1>Callback url</h1>");
});

//routes
app.use("/auth", AuthRoutes);

app.use("/email", EmailRoutes);

app.use("/oauth2", OAuth2Routes);

app.use("/patients", PatientRoutes);

app.use("/fitbitData", DataRoutes);

app.use("/history", HistoryRoutes);

app.use("/", AlertRoutes);

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port http://localhost:${PORT}`);
// });

//Start the https server
const PORT = 443;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
