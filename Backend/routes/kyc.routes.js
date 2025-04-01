import { Router } from "express";
import { addDetails, getDetails } from "../controllers/kyc.controllers.js";

const kycRouter = Router();

kycRouter.post("/add-details", addDetails);

kycRouter.get("/get-details", getDetails);

export default kycRouter;