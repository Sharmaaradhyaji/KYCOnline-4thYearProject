import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaCamera, FaFileAlt, FaCheckCircle, FaImages, FaFlagCheckered } from 'react-icons/fa'; // Importing modern icons

const Process = () => {
    const navigate = useNavigate();
    
    const handleBackClick = () => {
        navigate(-1);
    }

    const steps = [
        { id: 1, label: 'Add your details', icon: <FaUserEdit size={20} /> },
        { id: 2, label: 'Take a photo', icon: <FaCamera size={20} /> },
        { id: 3, label: 'Get documents (Adhaar, PAN, Signature)', icon: <FaFileAlt size={20} /> },
        { id: 4, label: 'Verify name and other details from documents', icon: <FaCheckCircle size={20} /> },
        { id: 5, label: 'Compare your live selfie with images and Signature', icon: <FaImages size={20} /> },
        { id: 6, label: 'Get match score and complete KYC', icon: <FaFlagCheckered size={20} /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">KYC Process</h1>

                <div className="space-y-6">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center mr-4">
                                {step.icon}
                            </div>
                            <span className="text-lg font-medium">{step.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={handleBackClick}
                        className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 hover:text-white transition-all duration-300"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Process;
