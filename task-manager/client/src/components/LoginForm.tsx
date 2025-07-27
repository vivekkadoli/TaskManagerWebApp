import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';

type LoginFormProps = {
  onSwitch: () => void;
  onForgot: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      login(response.data);
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
    <div className="text-white w-full bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-center">Welcome Back!</h2>
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
          <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          Login
        </button>
      </form>
      <div className="mt-6 space-y-3 text-center">
        <button
          onClick={onSwitch}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Don’t have an account? <span className="text-yellow-400 underline">Register</span>
        </button>
        <button
          onClick={onForgot}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          <span className="text-yellow-400 underline">Forgot password?</span>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
