import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import Kyc from '../models/kyc.models.js';

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

const compareImages = async (req, res) => {
  try {
    const kycId = req.params.id;

    const kyc = await Kyc.findById(kycId);
    if (!kyc) {
      return res.status(404).json({ message: 'KYC details not found' });
    }

    // Fetch image URLs (from Cloudinary or database)
    const panImageUrl = kyc.panImage;
    const selfieImageUrl = kyc.selfieImage;

    // Download images using axios
    const panImage = await axios.get(panImageUrl, { responseType: 'arraybuffer' });
    const selfieImage = await axios.get(selfieImageUrl, { responseType: 'arraybuffer' });

    // Convert buffers to sharp instances
    const panImageBuffer = Buffer.from(panImage.data, 'binary');
    const selfieImageBuffer = Buffer.from(selfieImage.data, 'binary');

    // Step 1: Compare histograms
    const histogramDistance = await compareHistograms(panImageBuffer, selfieImageBuffer);

    // Normalize the score to a range between 0 and 1
    const normalizedScore = normalizeScore(histogramDistance);

    // Step 2: Threshold comparison (You can adjust this threshold based on your needs)
    const threshold = 0.1; // Set a threshold that determines "similarity"
    const isMatch = normalizedScore < threshold; // If the score is below the threshold, consider it a match

    // Return the comparison result
    res.status(200).json({ matchScore: normalizedScore, isMatch });
  } catch (error) {
    console.error('Error comparing images:', error);
    res.status(500).json({ message: 'Error comparing images' });
  }
};

// Function to compare histograms using Chi-Square method
const compareHistograms = async (imageBuffer1, imageBuffer2) => {
  const image1 = sharp(imageBuffer1);
  const image2 = sharp(imageBuffer2);

  // Convert images to grayscale, resize to the same resolution, and then to histograms (raw buffers)
  const [histogram1, histogram2] = await Promise.all([
    image1
      .resize(500, 500)   // Resize both images to the same resolution
      .grayscale()         // Convert to grayscale
      .raw()
      .toBuffer(),
    
    image2
      .resize(500, 500)   // Resize both images to the same resolution
      .grayscale()         // Convert to grayscale
      .raw()
      .toBuffer()
  ]);

  // Compare histograms using Chi-Square method
  const chiSquareDistance = calculateChiSquare(histogram1, histogram2);
  return chiSquareDistance;
};

// Chi-Square comparison function for histograms
const calculateChiSquare = (hist1, hist2) => {
  let sum = 0;

  // Ensure both histograms are the same length
  if (hist1.length !== hist2.length) {
    throw new Error('Histograms have different lengths');
  }

  // Calculate the Chi-Square distance between the two histograms
  for (let i = 0; i < hist1.length; i++) {
    if (hist1[i] + hist2[i] !== 0) {
      sum += Math.pow(hist1[i] - hist2[i], 2) / (hist1[i] + hist2[i]);
    }
  }
  return sum;
};

// Function to normalize the Chi-Square score (so it ranges from 0 to 1)
const normalizeScore = (score) => {
  // We need to scale the score to a range of [0, 1]
  // You can adjust this max value based on your dataset and experimentation
  const maxPossibleScore = 5000000; // Assume this is the maximum possible score
  const normalized = Math.min(score / maxPossibleScore, 1); // Ensure it's capped at 1
  return normalized;
};

export { addDetails, getDetails, compareImages };
