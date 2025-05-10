import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
        const response = await axios.get(
          `http://localhost:3000/kyc/get-details/${id}`
        );
        setKycData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching KYC data");
        setLoading(false);
      }
    };

    if (id) {
      fetchKycData();
    }
  }, [id]);

  const compareImages = async () => {
    setComparing(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/kyc/compare-images/${id}`
      );
      if (response.data.similarity_index !== undefined) {
        setMatchScore(response.data.similarity_index); // ✅ this matches your backend
      } else {
        setError("No match score returned from the server");
      }
    } catch (err) {
      console.error("Error comparing images:", err);
      setError("Error comparing images");
    } finally {
      setComparing(false);
    }
  };

  const endKycBlock = async () => {
    const response = await axios.put(`http://localhost:3000/kyc/kyc-end/${id}`);
    if (response.status === 200) {
      console.log("KYC process ended successfully!");
    } else {
      console.error("Error ending KYC process:", response.data);
    }
    alert("KYC process ended!");
    navigate(`/home/${id}`);
  };

  const tryAgainBlock = async () => {
    navigate(`/details-again/${id}`);
  };

  if (loading)
    return <div className="text-center text-xl text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center text-xl text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-6">
      <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Image Verification
      </h3>
      <p className="text-center text-lg text-gray-600 mb-6">
        Live selfie image is verified with documents
      </p>

      {kycData && (
        <div className="text-center">
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none mb-6"
            onClick={compareImages}
            disabled={comparing} // Disable button while comparing
          >
            {comparing ? "Comparing Images..." : "Compare Images"}
          </button>

          {matchScore !== null && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-700">
                Match Score: {(matchScore * 100).toFixed(2)}%
              </p>

              {matchScore * 100 >= 35 ? (
                <div className="mt-4 flex items-center justify-center text-green-500 font-semibold text-2xl">
                  <span className="mr-2">✔</span> Matched!
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-center text-red-500 font-semibold text-2xl">
                  <span className="mr-2">❌</span> Not Matched
                </div>
              )}

              {matchScore * 100 >= 35 ? (
                <div className="mt-6 p-6 bg-green-50 rounded-xl shadow-xl">
                  <p className="text-green-600 font-medium text-xl">
                    You are verified as a User!
                  </p>
                  <button
                    onClick={endKycBlock}
                    className="mt-4 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    END KYC
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-6 bg-red-50 rounded-xl shadow-xl">
                  <p className="text-red-600 font-medium text-xl">
                    You are not verified as a User because of low score!
                  </p>
                  <button
                    onClick={tryAgainBlock}
                    className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                  >
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
