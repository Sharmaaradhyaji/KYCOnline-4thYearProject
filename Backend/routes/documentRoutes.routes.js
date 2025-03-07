import express from 'express';
import upload from '../controllers/doc.controller.js';
import Document from '../models/document.models.js';

const documentrouter = express.Router();

// Document Upload API
documentrouter.post('/uploadDocument', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const document = await Document.create({ documentImage: req.file.filename });
    res.status(200).json({ success: true, message: 'Document uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Selfie Upload API
documentrouter.post('/uploadSelfie', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    // Ensure you provide all required fields
    const selfie = await Document.create({ 
      documentImage: req.file.filename,  // or another file field if required
      selfieLive: req.file.filename 
    });
    res.status(200).json({ success: true, message: 'Selfie uploaded successfully', selfie });
  } catch (error) {
    console.error("Error uploading selfie:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});



export default documentrouter;
