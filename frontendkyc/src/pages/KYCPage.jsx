import React from 'react';
import { useLocation } from 'react-router-dom';

const KycDetails = () => {
  const location = useLocation();
  const { user } = location.state || {};  // Get the user details from state

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">KYC Details</h1>

        <div className="space-y-4">
          <div>
            <strong>Father's Name:</strong> {user?.fatherName}
          </div>
          <div>
            <strong>Phone Number:</strong> {user?.phoneNumber}
          </div>
          <div>
            <strong>Address:</strong> {user?.address}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Age:</strong> {user?.age}
          </div>
          <div>
            <strong>Selfie:</strong>
            {user.selfieLive && <img src={user.selfieLive} alt="Selfie" className="w-64 h-64 rounded-lg shadow-lg mb-4" />}
          </div>
          <div>
            <strong>Document:</strong>
            {user.documentImage && <img src={user.documentImage} alt="Document" className="w-64 h-64 rounded-lg shadow-lg mb-4" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycDetails;
