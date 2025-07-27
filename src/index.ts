import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import otpRoutes from "./routes/otp-routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // now TypeScript won't complain
app.use(express.json());

app.use("/", otpRoutes);

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
