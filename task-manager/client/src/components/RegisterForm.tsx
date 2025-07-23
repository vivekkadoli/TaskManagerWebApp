import React, { useState } from 'react';
import axios from 'axios';
// import { useAuth } from '../auth/useAuth'; // Keep this commented out as per original instruction

const RegisterForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Corrected: Renamed setPasswordEncoder back to setPassword
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State for success message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(''); // Clear previous messages
    try {
      await axios.post('/api/auth/register', { email, password }); // Corrected: Used 'password' directly
      setSuccess('Registration successful! Redirecting to login...'); // Set success message
      setTimeout(() => {
        setSuccess(''); // Clear success message after timeout
        onSwitch(); // Switch to login form
      }, 2000); // Redirect after 2 seconds
    } catch (err: unknown) { // Type narrowed for Axios error
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Register</h2>
      {error && <p className="text-red-600 text-center text-sm mb-3">{error}</p>}
      {success && <p className="text-green-600 text-center text-sm mb-3">{success}</p>} {/* Show success message */}
      
      <div className="relative">
        <input
          type="email"
          id="register-email"
          placeholder=" "
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="block w-full px-3 py-2 text-base text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        />
        <label htmlFor="register-email" className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
          Email
        </label>
      </div>

      <div className="relative">
        <input
          type="password"
          id="register-password"
          placeholder=" "
          value={password} // Corrected: Used 'password'
          onChange={e => setPassword(e.target.value)} // Corrected: Used 'setPassword'
          className="block w-full px-3 py-2 text-base text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        />
        <label htmlFor="register-password" className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
          Password
        </label>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold"
      >
        Register
      </button>
      <button 
        type="button" 
        className="w-full text-blue-600 hover:text-blue-800 mt-2 text-sm" 
        onClick={onSwitch}
      >
        Already have an account? Login
      </button>
    </form>
  );
};

export default RegisterForm;