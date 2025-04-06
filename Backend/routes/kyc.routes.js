import { Router } from "express";
import { addDetails, compareImages, endKyc, getDetails, updateDetails } from "../controllers/kyc.controllers.js";
import upload from "../middleware/multer.js";

const kycRouter = Router();

kycRouter.post("/add-details", 
    upload.fields([
      { name: 'panImage', maxCount: 1 },
      { name: 'adhaarImage', maxCount: 1 },
      { name: 'selfieImage', maxCount: 1 },
      { name: 'signature', maxCount: 1}
    ])
    ,addDetails);

kycRouter.get("/get-details/:id", getDetails);

kycRouter.put('/update-details/:id', 
    upload.fields([
      { name: 'panImage', maxCount: 1 },
      { name: 'adhaarImage', maxCount: 1 },
      { name: 'selfieImage', maxCount: 1 },
      { name: 'signature', maxCount: 1 }
    ])
    , updateDetails);

kycRouter.get("/compare-images/:id", compareImages);

kycRouter.put("/kyc-end/:id", endKyc)

export default kycRouter;