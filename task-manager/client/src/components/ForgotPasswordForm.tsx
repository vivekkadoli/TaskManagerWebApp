import React, { useState } from 'react';
import axios from 'axios';

type ForgotPasswordFormProps = {
  onSwitch: () => void; // Function to switch back to Login form
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/reset-password', { email, password: newPassword });
      setSuccess(response.data.message || 'Password reset successful!');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      // Optionally, switch back to login form after successful reset
      // onSwitch();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Password reset failed!');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    // Removed transform transition-all duration-300 hover:scale-105 from this div
    <div className="bg-white text-gray-900 rounded-xl shadow-2xl p-8 w-full">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition duration-200 ease-in-out bg-gray-700 text-white placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition duration-200 ease-in-out bg-gray-700 text-white placeholder-gray-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition duration-200 ease-in-out bg-gray-700 text-white placeholder-gray-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded-md">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center font-medium bg-green-50 p-2 rounded-md">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Reset Password
        </button>
      </form>
      <div className="mt-8 text-center">
        <button
          onClick={onSwitch}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white"
        >
          Back to <span className="text-blue-600 hover:underline">Login</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
