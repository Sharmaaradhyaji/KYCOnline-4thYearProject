import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Importing a modern icon for the back button

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLogout = () => {
    // Clear any authentication data here (localStorage, cookies, etc.)
    console.log('Logged out');
    navigate('/login'); // Redirect to login page after logging out
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-10 py-4 px-8 flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-700 shadow-xl">
      {/* Left section: Back button and title */}
      <div className="flex items-center space-x-6">
        <button
          onClick={handleBack}
          className="text-white text-lg font-medium hover:text-gray-200 transition-colors duration-300 transform hover:scale-110"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-white text-3xl font-semibold tracking-tight animate__animated animate__fadeIn">
          Modern KYC
        </h1>
      </div>

      {/* Right section: About page link and logout button */}
      <div className="hidden sm:flex items-center space-x-8">
        <Link
          to="/process"
          className="text-white hover:text-gray-200 text-lg font-medium transition-colors duration-300"
        >
          About Process
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-lg font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Mobile view - Hamburger menu for smaller screens */}
      <div className="sm:hidden flex items-center space-x-6">
        <button
          onClick={handleBack}
          className="text-white text-lg font-medium hover:text-gray-200 transition-colors duration-300 transform hover:scale-110"
        >
          <FaArrowLeft size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-lg font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
