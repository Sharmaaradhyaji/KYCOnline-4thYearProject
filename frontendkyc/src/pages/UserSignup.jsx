import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null); // Track the time OTP was sent
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification state

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle OTP request
  const handleRequestOtp = async () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setOtpLoading(true);
    try {
      // Send OTP to the email
      const response = await axios.post('http://localhost:3000/users/request-otp', { email });
      if (response.status === 200) {
        setOtpSent(true);
        setOtpSentTime(Date.now()); // Store the time OTP was sent
        alert('OTP has been sent to your email!');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter the OTP.');
      return;
    }
  
    setVerifyLoading(true);
    try {
      // Verify the OTP entered by the user
      const response = await axios.post('http://localhost:3000/users/verify-otp', { email, otp });
      if (response.status === 200) {
        alert('OTP verified successfully!');
        setOtpVerified(true);  // Mark OTP as verified
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP or error verifying OTP');
    } finally {
      setVerifyLoading(false);
    }
  };
  
  // Handle form submission (sign-up)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();  // Only call preventDefault if e is available
  
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!firstName || !lastName || !password || !confirmPassword || !otpVerified) {
      alert('All fields are required and OTP must be verified');
      return;
    }

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email.trim(),
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:3000/users/register', newUser);
  
      if (response.status === 201) {
        const data = response.data;
        // Handle user data on successful registration
        navigate(`/home/${data.user._id}`);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error creating user');
    }
  
    // Reset fields
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };
  
  // Check if 1 minute has passed since OTP was sent
  const canResendOtp = otpSentTime && Date.now() - otpSentTime > 60 * 1000;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Signup</h1>

        {!otpSent ? (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                />
              </div>

              <button
                type="button"
                onClick={handleRequestOtp}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {otpLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              {/* Resend OTP button */}
              {otpSent && !canResendOtp && (
                <p className="text-red-500 text-sm mt-2">Please wait 1 minute before requesting again.</p>
              )}
              {otpSent && canResendOtp && (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                >
                  Resend OTP
                </button>
              )}
            </form>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                Enter OTP
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {verifyLoading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {otpVerified && (
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Signup
          </button>
        )}

        <p className="text-gray-600 text-xs italic mt-4">
          Already have an account? <Link className="text-blue-500" to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
