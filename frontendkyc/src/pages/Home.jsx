import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [kycStatus, setKycStatus] = useState("Not Updated");

  const navigate = useNavigate();

  const handleKYCUpdate = () => {
    navigate("/details");
  };


  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-200 px-6">
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">User Dashboard</h1>

        {/* KYC Status Section */}
        <div className="mb-6 p-4 rounded-lg shadow-md border bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">KYC Status:</h2>
          <p
            className={`text-lg font-semibold mt-2 ${
              kycStatus === "Not Updated" ? "text-red-500" : "text-green-500"
            }`}
          >
            {kycStatus}
          </p>
          {kycStatus === "Not Updated" && (
            <button
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
              onClick={handleKYCUpdate}
            >
              Update KYC
            </button>
          )}
        </div>
        
        {/* Navigation */}
        <div className="mt-6">
          <p className="text-gray-600">
            Want to check your KYC details?{" "}
            <Link to="/profile/kyc-details" className="text-blue-600 font-semibold hover:underline">
              View Details
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
