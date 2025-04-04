import React, { use } from 'react';
import { useNavigate } from 'react-router-dom';

const Process = () => {
    const navigate = useNavigate();
    const handleOnClick = () => {
        navigate('/details');
    }

    const handleBackClick = () => { 
        navigate(-1)
    }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">KYC Process</h1>

        <div className="space-y-6">
          {/* Step 1: Add Details */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">1</div>
            <span className="text-lg font-medium">Add your details</span>
          </div>

          {/* Step 2: Take Photo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">2</div>
            <span className="text-lg font-medium">Take a photo</span>
          </div>

          {/* Step 3: Get Documents */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">3</div>
            <span className="text-lg font-medium">Get documents (Adhaar, PAN)</span>
          </div>

          {/* Step 4: Verify Name and Other Details */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">4</div>
            <span className="text-lg font-medium">Verify name and other details from documents</span>
          </div>

          {/* Step 5: Compare Live Selfie */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">5</div>
            <span className="text-lg font-medium">Compare your live selfie with images</span>
          </div>

          {/* Step 6: Get Match Score and Complete KYC */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">6</div>
            <span className="text-lg font-medium">Get match score and complete KYC</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={handleOnClick} className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
            Start KYC Process
          </button>
          <button onClick={handleBackClick} className="bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ml-2">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Process;
