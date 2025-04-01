import Kyc from "../models/kyc.models.js";
import multer from 'multer';

// Set up the storage location and file naming conventions for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Give a unique name to the file
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// This middleware will handle the file uploads and add the files to req.files
const uploadFields = upload.fields([
  { name: 'panImage', maxCount: 1 },
  { name: 'adhaarImage', maxCount: 1 },
  { name: 'selfieImage', maxCount: 1 }
]);

const addDetails = async (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error in file upload', error: err.message });
    }

    // Access form fields from req.body
    const {
      fatherName,
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      age,
      panNumber,
      adhaarNumber,
      gender
    } = req.body;

    // Access files from req.files
    const panImage = req.files.panImage ? req.files.panImage[0].path : null;
    const adhaarImage = req.files.adhaarImage ? req.files.adhaarImage[0].path : null;
    const selfieImage = req.files.selfieImage ? req.files.selfieImage[0].path : null;


    try {

      // Check if any of the required fields are missing
      if (!fatherName || !firstName || !lastName || !phoneNumber || !address || !email || !age || !panNumber || !adhaarNumber || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Create new KYC document
      const kyc = await Kyc.create({
        fatherName,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        age,
        panNumber,
        adhaarNumber,
        panImage,
        adhaarImage,
        selfieImage,
        gender
      });

      await kyc.save();

      res.status(201).json({ message: 'KYC details added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
};

const getDetails = async (req, res) => {
    try {
        const userId = req.params.id; // Assume you're passing the user ID to fetch their KYC details
        const kycDetails = await Kyc.findOne({ email }); // Find the KYC details using the userId
    
        if (!kycDetails) {
          return res.status(404).json({ message: "KYC details not found" });
        }
    
        res.json(kycDetails); // Send KYC details back to the client
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
};

export { addDetails, getDetails };
