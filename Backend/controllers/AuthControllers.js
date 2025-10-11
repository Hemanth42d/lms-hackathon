import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER || "hemanthcodehub@gmail.com",
    pass: process.env.EMAIL_PASS || "xodrosycikmeagbc",
  },
});

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    const currTime = new Date();

    if (!userName || !email || !password || !role) {
      return res.status(400).json({
        error: true,
        message: "All fields are required",
      });
    }

    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        error: true,
        message: "User already exists with this email",
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    let newUser = await userModel.create({
      userName,
      email,
      password: hash,
      role,
      createdAt: currTime,
      updatedAt: currTime,
    });

    let token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User does not exist. Please create a new account.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    let token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Successfully logged in",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Send OTP for password reset
export const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Email is required",
      });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found with this email address",
      });
    }

    const otp = generateOTP();
    otpStore.set(email, {
      otp: otp,
      expires: Date.now() + 5 * 60 * 1000,
    });

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || "hemanthcodehub@gmail.com",
        to: email,
        subject: `Password Reset OTP - EduConnect`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background-color: #f8fafc;
                  padding: 20px;
                  color: #334155;
                  margin: 0;
                }
                .container {
                  background-color: #ffffff;
                  padding: 40px;
                  border-radius: 12px;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                  max-width: 600px;
                  margin: auto;
                  border: 1px solid #e2e8f0;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                }
                .logo {
                  font-size: 28px;
                  font-weight: bold;
                  color: #2563eb;
                  margin-bottom: 10px;
                }
                .title {
                  color: #1e293b;
                  font-size: 24px;
                  margin-bottom: 20px;
                }
                .otp-container {
                  background-color: #f1f5f9;
                  padding: 20px;
                  border-radius: 8px;
                  text-align: center;
                  margin: 25px 0;
                  border-left: 4px solid #2563eb;
                }
                .otp-code {
                  font-size: 32px;
                  font-weight: bold;
                  color: #2563eb;
                  letter-spacing: 4px;
                  margin: 10px 0;
                }
                .content {
                  font-size: 16px;
                  line-height: 1.6;
                  margin-bottom: 20px;
                }
                .warning {
                  background-color: #fef3c7;
                  padding: 15px;
                  border-radius: 6px;
                  border-left: 4px solid #f59e0b;
                  margin: 20px 0;
                  font-size: 14px;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #64748b;
                  text-align: center;
                  border-top: 1px solid #e2e8f0;
                  padding-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">EduConnect</div>
                  <h2 class="title">Password Reset Request</h2>
                </div>
                
                <div class="content">
                  <p>Hello ${user.userName},</p>
                  <p>
                    We received a request to reset your password for your EduConnect account. 
                    Use the OTP below to complete your password reset:
                  </p>
                </div>

                <div class="otp-container">
                  <p style="margin: 0; font-size: 14px; color: #64748b;">Your verification code is:</p>
                  <div class="otp-code">${otp}</div>
                  <p style="margin: 0; font-size: 12px; color: #64748b;">This code will expire in 5 minutes</p>
                </div>

                <div class="content">
                  <p>
                    If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
                  </p>
                </div>

                <div class="warning">
                  <strong>Security Notice:</strong> Never share this OTP with anyone. EduConnect support will never ask for your OTP.
                </div>

                <div class="footer">
                  <p>This is an automated message, please do not reply to this email.</p>
                  <p>&copy; 2024 EduConnect. All rights reserved.</p>
                  <p>If you have any questions, contact us at support@educonnect.com</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      const result = await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.log("Continuing with OTP generation (email failed)");
    }

    return res.json({
      success: true,
      message: "OTP sent successfully to your email",
      otp: otp,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to send OTP",
      details: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        error: true,
        message: "Email, OTP, and new password are required",
      });
    }

    const storedOTPData = otpStore.get(email);

    if (!storedOTPData) {
      return res.status(400).json({
        error: true,
        message: "OTP not found or expired. Please request a new OTP.",
      });
    }

    if (Date.now() > storedOTPData.expires) {
      otpStore.delete(email);
      return res.status(400).json({
        error: true,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    const enteredOTP = otp.toString().trim();
    const storedOTP = storedOTPData.otp.toString().trim();

    if (storedOTP !== enteredOTP) {
      return res.status(400).json({
        error: true,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email },
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({
        error: true,
        message: "Failed to update password in database",
      });
    }

    otpStore.delete(email);

    return res.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to reset password",
      details: error.message,
    });
  }
};
