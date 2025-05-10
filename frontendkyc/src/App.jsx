import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import Start from "./pages/Start";
import Home from "./pages/Home";
import KYCPage from "./pages/KYCPage";
import Details from "./pages/Details";
import ImageCheck from "./pages/ImageCheck";
import DetailsAgain from "./pages/DetailsAgain";
import Process from "./pages/Process";
import Navbar from "./components/Navbar";

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/login", "/register"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className={`min-h-screen bg-gray-50 ${showNavbar ? 'pt-20' : ''}`}>
      {/* Conditionally render Navbar */}
      {showNavbar && <Navbar />}

      <Routes>
        {/* Routes without Navbar */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserSignup />} />

        {/* Routes with Navbar */}
        <Route path="/home/:id" element={<Home />} />
        <Route path="/process" element={<Process />} />
        <Route path="/details" element={<Details />} />
        <Route path="/details-again/:id" element={<DetailsAgain />} />
        <Route path="/kyc-details/:id" element={<KYCPage />} />
        <Route path="/kyc-image/:id" element={<ImageCheck />} />
      </Routes>
    </div>
  );
};

export default App;
