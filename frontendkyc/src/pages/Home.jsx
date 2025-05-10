import React, { use, useEffect, useState } from "react";
import { data, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const {id} = useParams();
  const [kycStatus, setKycStatus] = useState("Not Updated");

  const navigate = useNavigate();

  const handleKYCUpdate = () => {
    navigate("/details");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/get-details/${id}`);
        if (response.status) {
          const data = response.data;
          setKycStatus(data.kycStatus);
        } else {
          console.error("Error fetching user data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id])

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
          { (
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
            Want to learn the Process?{" "}
            <Link to="/process" className="text-blue-600 font-semibold hover:underline">
              About KYC Process
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
