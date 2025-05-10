import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "animate.css"; // Import animate.css

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const excludedPaths = ["/", "/login", "/register"];
  if (excludedPaths.includes(location.pathname)) return null;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 shadow-lg transition-all duration-700 ${
        animate
          ? "translate-y-0 opacity-100 animate__animated animate__fadeInDown"
          : "-translate-y-10 opacity-0"
      } bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
        {/* Left: Back + Logo */}
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="hover:text-gray-300 transition-transform duration-300 transform hover:scale-110"
            title="Go Back"
          >
            <FaArrowLeft size={20} />
          </button>

          {/* KYC Wizard Title */}
          <h1 className="text-2xl font-extrabold tracking-wide animate-bounce">
            KYC<span className="text-yellow-300">Wizard</span>
          </h1>
        </div>

        {/* Right: Process Link + Logout Button */}
        <div className="hidden sm:flex items-center space-x-6">
          {/* Process Link */}
          <Link
            to="/process"
            className="hover:text-yellow-300 text-lg transition-transform duration-300 transform hover:scale-105"
          >
            About the Process
          </Link>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-full transition-transform duration-300 transform hover:scale-105 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
