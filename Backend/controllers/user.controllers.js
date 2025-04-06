import { validationResult } from "express-validator";
import User from "../models/user.models.js";
import { createUser } from "../services/user.services.js";
import Kyc from "../models/kyc.models.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";

export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      kycStatus: "not-started",
    });

    const token = await user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await user.generateAuthToken();
    res.cookie("token", token);

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  res.status(200).json({ message: "Logout successful" });
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const Kycuser = await Kyc.findById(userId);
    
    if (!Kycuser) {
      return null;
    }

    const email = Kycuser.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found in users" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// In-memory OTP storage for demo purposes
let otpStorage = {}; // Use Redis or a DB in production

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate OTP and store it
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  otpStorage[email] = { otp, expiry: otpExpiry };

  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "OTP Verification",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: "OTP Verification",
      intro: `Use the following OTP to verify your account: ${otp}`,
      action: {
        instructions: "Enter the following OTP to verify your account",
        button: {
          color: "#22BC66",
          text: "Use this OTP",
          link: "https://mailgen.js/",
        },
      },
      outro: "Thanks for using our service!",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Verification",
    html: mail,
  };

  try {
    await transporter.sendMail(message);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  if (!otpStorage[email]) {
    return res.status(400).json({ message: "OTP not sent or expired" });
  }

  const storedOtp = otpStorage[email].otp;
  const otpExpiry = otpStorage[email].expiry;

  // Check if OTP has expired
  if (Date.now() > otpExpiry) {
    delete otpStorage[email]; // Remove expired OTP
    return res.status(400).json({ message: "OTP has expired" });
  }

  // Check if OTP matches
  if (parseInt(otp) !== storedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpStorage[email]; // Remove OTP after successful verification
  return res.status(200).json({ message: "OTP verified successfully" });
};
