import React, { useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [kycStatus, setKycStatus] = useState("Not Updated");
  const [documentType, setDocumentType] = useState("");
  const [documentImage, setDocumentImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleKYCUpdate = () => {
    // TODO: Call API to update KYC status
    setKycStatus("Updated");
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleDocumentImageChange = (e) => {
    setDocumentImage(e.target.files[0]);
  };

  const handleUploadDocument = () => {
    // TODO: Call API to upload document image
    setUploadStatus("Uploaded successfully");
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

        {/* Document Upload Section */}
        <div className="p-4 rounded-lg shadow-md border bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Upload Document:</h2>
          <select
            className="block w-full bg-white border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300 outline-none transition"
            value={documentType}
            onChange={handleDocumentTypeChange}
          >
            <option value="">Select document type</option>
            <option value="PAN Card">PAN Card</option>
            <option value="DL">Driving License</option>
          </select>

          <label className="block w-full mt-4 cursor-pointer border-2 border-dashed border-gray-400 hover:border-blue-500 rounded-lg p-6 text-gray-500 text-center transition">
            <input
              type="file"
              className="hidden"
              onChange={handleDocumentImageChange}
            />
            {documentImage ? (
              <span className="text-gray-800">{documentImage.name}</span>
            ) : (
              "Click to upload document"
            )}
          </label>

          <button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            onClick={handleUploadDocument}
          >
            Upload Document
          </button>
          {uploadStatus && (
            <p className="text-green-500 font-medium mt-2">{uploadStatus}</p>
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
