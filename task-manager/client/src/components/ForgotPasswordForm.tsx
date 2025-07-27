import React, { useState } from 'react';
import axios from 'axios';

type ForgotPasswordFormProps = {
  onSwitch: () => void;
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
      const response = await axios.post('/api/auth/reset-password', {
        email,
        password: newPassword
      });
      setSuccess(response.data.message || 'Password reset successful!');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Password reset failed!');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="text-white w-full bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3 px-4 rounded-lg transition-all duration-300"
        >
          Reset Password
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={onSwitch}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Back to <span className="text-yellow-400 underline">Login</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
