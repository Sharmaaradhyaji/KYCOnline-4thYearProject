import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdditionalDetails = () => {
  // State for form fields
  const [fatherName, setFatherName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create an object with all the details to be passed to the next page
    const userDetails = {
      fatherName,
      phoneNumber,
      address,
      email,
      age,
    };

    // Navigate to the next page and pass the userDetails using state
    navigate('/kyc-details', { state: { user: userDetails } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Details</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Father's Name Field */}
          <div>
            <label className="block text-gray-700 font-medium">Father's Name</label>
            <input
              type="text"
              value={fatherName}
              onChange={(event) => setFatherName(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Father's Name"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Phone Number"
              required
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Address"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Email"
              required
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-gray-700 font-medium">Age</label>
            <input
              type="number"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Age"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdditionalDetails;
