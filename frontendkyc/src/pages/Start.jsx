import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 px-4">
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-2xl text-center">
        <img
          src="https://cdn.dribbble.com/userupload/23989746/file/original-bdb3ce887d6b2a82b12b6b715ffea82f.gif"
          alt="KYC Verification Animation"
          className="w-48 h-48 mx-auto mb-6"
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Start Your KYC Verification
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Securely verify your identity online in just a few steps. Click the
          button below to begin.
        </p>
        <Link to="/login">
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg hover:ring-2 hover:ring-blue-300 focus:ring-4 focus:ring-blue-400">
            Start KYC Verification 🚀
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Start;
