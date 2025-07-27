import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const otpStore = new Map<string, { otp: string; expiresAt: number }>();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

exports.sendOtp = async function (email: string): Promise<boolean> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(email, { otp, expiresAt });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Your OTP Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 500px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .otp-box {
          background-color: #f0f0f0;
          padding: 20px;
          text-align: center;
          font-size: 32px;
          letter-spacing: 4px;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: bold;
          color: #000;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello,</h2>
        <p>Your OTP for logging in to <strong>Exam Grid</strong> is:</p>
        <div class="otp-box">${otp}</div>
        <p>This OTP will expire in <strong>5 minutes</strong>. Please do not share it with anyone.</p>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Exam Grid. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: "Your Exam Grid OTP Code",
      html: htmlContent,
    });
    return true;
  } catch (err) {
    console.error("Failed to send OTP", err);
    return false;
  }
};

exports.verifyOtp = function (email: string, otp: string): boolean {
  const entry = otpStore.get(email);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email); // Clean up expired OTP
    return false;
  }

  return entry.otp === otp;
};
