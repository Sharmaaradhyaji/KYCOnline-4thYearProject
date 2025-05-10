import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import Kyc from '../models/kyc.models.js';
import User from '../models/user.models.js';

const addDetails = async (req, res) => {
  try {
    const {
      fatherName, firstName, lastName, phoneNumber, address, email, age, panNumber,
      adhaarNumber, gender
    } = req.body;

    console.log(req.body);

    const panImage = req.files.panImage && req.files.panImage[0].path;
    const adhaarImage = req.files.adhaarImage && req.files.adhaarImage[0].path;
    const selfieImage = req.files.selfieImage && req.files.selfieImage[0].path;
    const signature = req.files.signature && req.files.signature[0].path;
    console.log("Reaached 1")
    // Check for valid images
    if (!panImage || !adhaarImage || !selfieImage ) {
      return res.status(400).json({ message: 'Please upload all required images' });
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

    let signatureUrl = await cloudinary.uploader.upload(signature, {
      resource_type: "image",
    });

    console.log("reached 2")
    // Create KYC document
    const kyc = new Kyc({
      fatherName, firstName, lastName, phoneNumber, address, email, age, panNumber,
      adhaarNumber, gender, panImage: panImageUrl.url, adhaarImage: adhaarImageUrl.url, selfieImage: selfieImageUrl.url, signature: signatureUrl.url
    });
    console.log("Kyc reached")
    // Save to database
    await kyc.save();

    res.status(201).json({ message: 'KYC details added successfully', kycId: kyc._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateDetails = async (req, res) => {
  try {
    const kycId = req.params.id;
    const {
      fatherName, firstName, lastName, phoneNumber, address, email, age, panNumber,
      adhaarNumber, gender
    } = req.body;

    const panImage = req.files.panImage && req.files.panImage[0].path;
    const adhaarImage = req.files.adhaarImage && req.files.adhaarImage[0].path;
    const selfieImage = req.files.selfieImage && req.files.selfieImage[0].path;
    const signature = req.files.signature && req.files.signature[0].path;

    // Check for valid images
    if (!panImage || !adhaarImage || !selfieImage || !signature) {
      return res.status(400).json({ message: 'Please upload all required images' });
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
    let signatureUrl = await cloudinary.uploader.upload(signature, {
      resource_type: "image",
    });

    // Find and update KYC document
    const kyc = await Kyc.findByIdAndUpdate(kycId, {
      fatherName, firstName, lastName, phoneNumber, address, email, age, panNumber,
      adhaarNumber, gender, panImage: panImageUrl.url, adhaarImage: adhaarImageUrl.url, selfieImage: selfieImageUrl.url, signature: signatureUrl.url
    });

    if (!kyc) {
      return res.status(404).json({ message: 'KYC details not found' });
    }

    res.status(200).json({ message: 'KYC details updated successfully', kyc });

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

const endKyc = async (req, res) => {
  try {
    const kycId = req.params.id;
    const kyc = await Kyc.findById(kycId);
    
    if (!kyc) {
      return res.status(404).json({ message: 'KYC details not found' });
    }

    const email = kyc.email;
    const status = 'KYC Completed';

    // Await the result to get the document, not a query object
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.kycStatus = status;
    
    // Save the user document after updating
    await user.save();

    res.status(200).json({ message: 'KYC completed successfully' });
  } catch (error) {
    console.error('Error ending KYC:', error);
    res.status(500).json({ message: 'Error ending KYC' });
  }
};


const compareImages = async (req, res) => {
  try {
      const kycId = req.params.id;
      const kyc = await Kyc.findById(kycId);

      if (!kyc) {
          return res.status(404).json({ message: 'KYC details not found' });
      }

      // Forward request to Flask API to compare the images
      const response = await axios.post(
          'http://127.0.0.1:5000/compare-faces',  // Flask API URL
          {
              panImageUrl: kyc.panImage,
              selfieImageUrl: kyc.selfieImage,
          },
          {
              headers: {
                  'Content-Type': 'application/json',
              }
          }
      );

      // Extract similarity index from Flask API response
      const { similarity_index } = response.data;
      console.log(similarity_index);
      // Define a threshold for determining whether the faces match
      const matchThreshold = 0.7;  // Adjust this threshold as needed
      const match = similarity_index > matchThreshold;

      // Return match result and similarity score to frontend
      res.status(200).json({
          match,
          similarity_index,
          message: match ? "Faces match" : "Faces do not match"
      });
  } catch (error) {
      console.error('Error calling face comparison API:', error.message);
      res.status(500).json({ message: 'Error comparing images' });
  }
};


export { addDetails, updateDetails, getDetails, compareImages, endKyc };
