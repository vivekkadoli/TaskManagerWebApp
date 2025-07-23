import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';

type LoginFormProps = {
  onSwitch: () => void; // Function to switch to Register form
  onForgot: () => void; // Function to switch to Forgot Password form
};

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth(); // Get login function from auth context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      login(response.data); // Store user data (token, email, id) in context and local storage
      setSuccess('Login successful!');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login failed!');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-sm mx-auto transform transition-all duration-300 hover:scale-105">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700">Welcome Back!</h2>
      <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            // CORRECTED: Changed text-gray-900 to text-white for visibility on dark input background
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition duration-200 ease-in-out bg-gray-700 text-white placeholder-gray-400" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            // CORRECTED: Changed text-gray-900 to text-white for visibility on dark input background
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition duration-200 ease-in-out bg-gray-700 text-white placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded-md">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center font-medium bg-green-50 p-2 rounded-md">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Login
        </button>
      </form>
      <div className="mt-8 space-y-3 text-center">
        <button
          onClick={onSwitch}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white"
        >
          Don't have an account? <span className="text-blue-600 hover:underline">Register</span>
        </button>
        <button
          onClick={onForgot}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white"
        >
          <span className="text-blue-600 hover:underline">Forgot password?</span>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;