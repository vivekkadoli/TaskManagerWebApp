import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('/api/auth/reset-password', { email, password });
      setMessage('Password reset successful! Please login.');
      setTimeout(onSwitch, 2000); // Automatically switch back to login after 2 seconds
    } catch (err: unknown) { // Changed 'any' to 'unknown'
      if (axios.isAxiosError(err)) { // Type narrowing for Axios error
        setError(err.response?.data?.message || 'Reset failed');
      } else {
        setError('An unexpected error occurred during password reset.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Reset Password</h2>
      {error && <p className="text-red-600 text-center text-sm mb-3">{error}</p>}
      {message && <p className="text-green-600 text-center text-sm mb-3">{message}</p>}
      
      <div className="relative">
        <input
          type="email"
          id="email-reset"
          placeholder=" " // Important for floating label effect
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="block w-full px-3 py-2 text-base text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        />
        <label htmlFor="email-reset" className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
          Email
        </label>
      </div>

      <div className="relative">
        <input
          type="password"
          id="new-password"
          placeholder=" "
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="block w-full px-3 py-2 text-base text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        />
        <label htmlFor="new-password" className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
          New Password
        </label>
      </div>

      <div className="relative">
        <input
          type="password"
          id="confirm-password"
          placeholder=" "
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="block w-full px-3 py-2 text-base text-gray-900 bg-gray-50 rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
        />
        <label htmlFor="confirm-password" className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
          Confirm Password
        </label>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold"
      >
        Reset Password
      </button>
      <button 
        type="button" 
        className="w-full text-blue-600 hover:text-blue-800 mt-2 text-sm" 
        onClick={onSwitch}
      >
        ← Back to Login
      </button>
    </form>
  );
};

export default ForgotPasswordForm;