import { Router } from "express";
import { ratelimiter } from "../middleware/rate-limter";
const { sendOtp, verifyOtp } = require("../controllers/otp-functions");

const router = Router();

router.post("/send-otp", ratelimiter, sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/", (_req, res) => {
  res.send("OTP Service is running");
});

export default router;
