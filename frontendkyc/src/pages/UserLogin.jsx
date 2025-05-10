import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

  const {user, setUser} = useContext(UserDataContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = {
      email: email,
      password: password,
    };
  
    try {
      const response = await axios.post('http://localhost:3000/users/login', userData);
  
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate(`/home/${data.user._id}`);
  
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Try again. Wrong Credentials.");
      } else {
        alert("An error occurred. Please try again later.");
        console.error(error);
      }
    }
  };
  

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
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
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="text-gray-600 text-xs italic mt-4">
          Don't have an account? <Link className='text-blue-500' to="/register">Signup here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;