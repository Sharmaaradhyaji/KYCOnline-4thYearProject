import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ImageCheck = () => {
  const { id } = useParams();
  const [kycData, setKycData] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false); // To track comparison in progress
  const [error, setError] = useState(null);

    const navigate = useNavigate();

  useEffect(() => {
    const fetchKycData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/kyc/get-details/${id}`);
        setKycData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching KYC data');
        setLoading(false);
      }
    };

    if (id) {
      fetchKycData();
    }
  }, [id]);

  const compareImages = async () => {
    setComparing(true);  // Disable the button during comparison
    setError(null);      // Reset any previous errors
    try {
      const response = await axios.get(`http://localhost:3000/kyc/compare-images/${id}`);
      if (response.data.matchScore !== undefined) {
        setMatchScore(response.data.matchScore);  // Set the match score if present
      } else {
        setError('No match score returned from the server');
      }
    } catch (err) {
      console.error('Error comparing images:', err);
      setError('Error comparing images');
    } finally {
      setComparing(false);  // Enable the button after comparison
    }
  };

  const endKycBlock = async () => {
    alert('KYC process ended!');
    navigate('/home');
  }

  const tryAgainBlock = async () => {
    navigate('/details');
  }

  if (loading) return <div className="text-center text-xl text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-6">
      <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">Image Verification</h3>
      <p className="text-center text-lg text-gray-600 mb-6">Live selfie image is verified with documents</p>

      {kycData && (
        <div className="text-center">
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none mb-6"
            onClick={compareImages}
            disabled={comparing}  // Disable button while comparing
          >
            {comparing ? 'Comparing Images...' : 'Compare Images'}
          </button>

          {matchScore !== null && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-700">Match Score: {matchScore}</p>

              {matchScore > 0.7 ? (
                <div className="mt-4 flex items-center justify-center text-green-500 font-semibold text-2xl">
                  <span className="mr-2">✔</span> Matched!
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-center text-red-500 font-semibold text-2xl">
                  <span className="mr-2">❌</span> Not Matched
                </div>
              )}

              {/* Success/Failure Block */}
              {matchScore >= 0.7 ? (
                <div className="mt-6 p-6 bg-green-50 rounded-xl shadow-xl">
                  <p className="text-green-600 font-medium text-xl">You are verified as a User!</p>
                  <button onClick={endKycBlock} className="mt-4 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105">
                    END KYC
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-6 bg-red-50 rounded-xl shadow-xl">
                  <p className="text-red-600 font-medium text-xl">You are not verified as a User!</p>
                  <button onClick={tryAgainBlock} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCheck;
