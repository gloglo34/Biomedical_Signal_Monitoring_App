import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/auth.js";
import EmailRoutes from "./routes/EmailRoutes.js";
import OAuth2Routes from "./routes/OAuth2Routes.js";

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
app.use("/auth", AuthRoutes);

app.use("/email", EmailRoutes);

app.use("/oauth2", OAuth2Routes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
