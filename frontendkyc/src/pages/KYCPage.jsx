import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa'; // Added spinner icon

const KycDetails = () => {
  const { id } = useParams();
  const [kycData, setKycData] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [verificationStatus, setVerificationStatus] = useState({
    firstName: false,
    lastName: false,
    panNumber: false,
    aadhaarNumber: false,
  });
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKycData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/kyc/get-details/${id}`);
        setKycData(response.data);
      } catch (error) {
        console.error('Error fetching KYC data:', error);
      }
    };

    fetchKycData();
  }, [id]);

  const handleOcrVerification = () => {
    let combinedText = ''; // To combine text from both PAN and Aadhaar images
    setLoading(true); // Set loading to true when OCR starts

    const processImage = (image, textCallback) => {
      return new Promise((resolve) => {
        Tesseract.recognize(
          image, 
          'eng',
          {
            logger: (m) => console.log(m),
          }
        ).then(({ data: { text } }) => {
          textCallback(text); // Callback to update OCR text
          resolve();
        });
      });
    };

    // Process PAN and Aadhaar images
    const panPromise = kycData?.panImage ? processImage(kycData.panImage, (text) => { combinedText += text.toLowerCase(); }) : Promise.resolve();
    const adhaarPromise = kycData?.adhaarImage ? processImage(kycData.adhaarImage, (text) => { combinedText += text.toLowerCase(); }) : Promise.resolve();

    // Once both are processed, set the OCR text and stop the loading animation
    Promise.all([panPromise, adhaarPromise]).then(() => {
      setOcrText(combinedText); // Set the combined OCR text
      setLoading(false); // Set loading to false once OCR is done
      alert('OCR Extraction Complete!'); // Alert user once OCR is done
    });
  };

  const verifyFirstName = () => {
    if (!ocrText || !kycData?.firstName) {
      alert('OCR not performed or first name missing!');
      return;
    }

    const firstNameLowerCase = kycData.firstName.toLowerCase();
    if (ocrText.includes(firstNameLowerCase)) {
      setVerificationStatus((prevState) => ({ ...prevState, firstName: true }));
    } else {
      alert('First Name Not Verified');
    }
  };

  const verifyLastName = () => {
    if (!ocrText || !kycData?.lastName) {
      alert('OCR not performed or last name missing!');
      return;
    }

    const lastNameLowerCase = kycData.lastName.toLowerCase();
    if (ocrText.includes(lastNameLowerCase)) {
      setVerificationStatus((prevState) => ({ ...prevState, lastName: true }));
    } else {
      alert('Last Name Not Verified');
    }
  };

  const verifyPanNumber = () => {
    if (!ocrText || !kycData?.panNumber) {
      alert('OCR not performed or PAN number missing!');
      return;
    }

    const panNumberLowerCase = kycData.panNumber.toLowerCase();
    if (ocrText.includes(panNumberLowerCase)) {
      setVerificationStatus((prevState) => ({ ...prevState, panNumber: true }));
    } else {
      alert('PAN Number Not Verified');
    }
  };

  const verifyAadhaarNumber = () => {
    if (!ocrText || !kycData?.adhaarNumber) {
      alert('OCR not performed or Aadhaar number missing!');
      return;
    }

    // Format the Aadhaar number to the standard format: 4 digit groups
    const aadhaarNumberFormatted = kycData.adhaarNumber.replace(/\s+/g, '');  // Remove spaces from the Aadhaar number to format it without spaces
    const aadhaarParts = aadhaarNumberFormatted.match(/.{1,4}/g); // Split the Aadhaar number into groups of 4 digits

    // Check if the OCR text contains each part of the Aadhaar number
    const isAadhaarMatched = aadhaarParts?.every((part) =>
      ocrText.includes(part.toLowerCase())
    );

    if (isAadhaarMatched) {
      setVerificationStatus((prevState) => ({ ...prevState, aadhaarNumber: true }));
      alert('Aadhaar Number Verified');
    } else {
      alert('Aadhaar Number Not Verified');
    }
  };

  const handleNextClick = () => {
    navigate(`/kyc-image/${id}`);
  };

  const isAllVerified = verificationStatus.firstName && verificationStatus.lastName && verificationStatus.panNumber && verificationStatus.aadhaarNumber;

  const handleBackClick = () => {
    navigate(`/details-again/${id}`);  // Go back to the previous page
  };

  if (!kycData) return <div className="text-center text-gray-500 mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-10 space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">KYC Details</h2>

      <div className="space-y-4">
        <p className="text-lg text-gray-700"><strong>Name:</strong> {kycData.firstName} {kycData.lastName}</p>
        <p className="text-lg text-gray-700"><strong>Email:</strong> {kycData.email}</p>
        <p className="text-lg text-gray-700"><strong>Phone:</strong> {kycData.phoneNumber}</p>
        <p className="text-lg text-gray-700"><strong>Address:</strong> {kycData.address}</p>
        <p className="text-lg text-gray-700"><strong>Age:</strong> {kycData.age}</p>
        <p className="text-lg text-gray-700"><strong>PAN Number:</strong> {kycData.panNumber}</p>
        <p className="text-lg text-gray-700"><strong>Aadhaar Number:</strong> {kycData.adhaarNumber}</p>
        <p className="text-lg text-gray-700"><strong>Gender:</strong> {kycData.gender}</p>
      </div>

      <div className="space-y-4">
        <img src={kycData.panImage} alt="PAN Image" className="w-full h-auto rounded-lg shadow-md" />
        <img src={kycData.adhaarImage} alt="Aadhaar Image" className="w-full h-auto rounded-lg shadow-md" />
        <img src={kycData.selfieImage} alt="Selfie Image" className="w-full h-auto rounded-lg shadow-md" />
        <img src={kycData.signature} alt="Signature" className="w-full h-auto rounded-lg shadow-md" />
      </div>

      <div className="mb-6">
        <button
          onClick={handleOcrVerification}
          className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 w-full"
        >
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <FaSpinner className="animate-spin text-white" />
              <span>Extracting OCR...</span>
            </div>
          ) : (
            'Extract OCR Text'
          )}
        </button>
      </div>

      <div className="space-y-4">
        <button
          onClick={verifyFirstName}
          disabled={verificationStatus.firstName}
          className={`w-full px-6 py-3 ${verificationStatus.firstName ? 'bg-green-500' : 'bg-blue-500'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300`}
        >
          {verificationStatus.firstName ? <><FaCheckCircle className="inline mr-2" /> Verified</> : 'Verify First Name'}
        </button>

        <button
          onClick={verifyLastName}
          disabled={verificationStatus.lastName}
          className={`w-full px-6 py-3 ${verificationStatus.lastName ? 'bg-green-500' : 'bg-blue-500'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300`}
        >
          {verificationStatus.lastName ? <><FaCheckCircle className="inline mr-2" /> Verified</> : 'Verify Last Name'}
        </button>

        <button
          onClick={verifyPanNumber}
          disabled={verificationStatus.panNumber}
          className={`w-full px-6 py-3 ${verificationStatus.panNumber ? 'bg-green-500' : 'bg-purple-500'} text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition duration-300`}
        >
          {verificationStatus.panNumber ? <><FaCheckCircle className="inline mr-2" /> Verified</> : 'Verify PAN Number'}
        </button>

        <button
          onClick={verifyAadhaarNumber}
          disabled={verificationStatus.aadhaarNumber}
          className={`w-full px-6 py-3 ${verificationStatus.aadhaarNumber ? 'bg-green-500' : 'bg-teal-500'} text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-300`}
        >
          {verificationStatus.aadhaarNumber ? <><FaCheckCircle className="inline mr-2" /> Verified</> : 'Verify Aadhaar Number'}
        </button>
      </div>

      {isAllVerified && (
        <div className="mt-6">
          <button
            onClick={handleNextClick}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleBackClick}
          className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
        >
          Back & Update
        </button>
      </div>
    </div>
  );
};

export default KycDetails;
