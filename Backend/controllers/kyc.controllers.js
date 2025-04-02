import Kyc from "../models/kyc.models.js";
import {v2 as cloudinary} from "cloudinary"

const addDetails = async (req, res) => {
  try {
    const {
      fatherName, firstName, lastName, phoneNumber, address, email, age, panNumber,
      adhaarNumber, gender
    } = req.body;

    const panImage = req.files.panImage && req.files.panImage[0].path;
    const adhaarImage = req.files.adhaarImage && req.files.adhaarImage[0].path;
    const selfieImage = req.files.selfieImage && req.files.selfieImage[0].path;

    // Check for valid images
    if (!panImage || !adhaarImage || !selfieImage) {
      return res.status(400).json({ message: 'Please upload all required images (PAN, Aadhaar, Selfie)' });
    }

    // Upload to Cloudinary
    let panImageUrl = await cloudinary.uploader.upload(panImage, {
      resource_type: "image",
    });

    let adhaarImageUrl = await cloudinary.uploader.upload(adhaarImage, {
      resource_type: "image",
    });

    let selfieImageUrl = await cloudinary.uploader.upload(selfieImage, {
      resource_type: "image",
    });

    // Create KYC document
    const kyc = new Kyc({
      fatherName, firstName, lastName, phoneNumber, address, email, age, panNumber,
      adhaarNumber, gender, panImage: panImageUrl.url, adhaarImage: adhaarImageUrl.url, selfieImage: selfieImageUrl.url
    });

    // Save to database
    await kyc.save();

    res.status(201).json({ message: 'KYC details added successfully', kycId: kyc._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const getDetails = async (req, res) => {
  const kycId = req.params.id;

  try {
    const kyc = await Kyc.findById(kycId);
    if (!kyc) {
      return res.status(404).json({ message: 'KYC details not found' });
    }
    
    res.status(200).json(kyc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export { addDetails, getDetails };
