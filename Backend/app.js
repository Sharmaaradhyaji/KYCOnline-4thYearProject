import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import kycRouter from "./routes/kyc.routes.js";
import connectCloudinary from "./config/cloudinary.js";

dotenv.config();

connectDB();

const app = express();

connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Jai Shree Ram!");
});

app.use('/users', userRouter);
app.use('/kyc', kycRouter);

export default app;