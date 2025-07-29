import React, { useState } from 'react';
import axios from 'axios';

type RegisterFormProps = {
  onSwitch: () => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setError('Mobile must be a 10-digit number.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', { email, password, mobile });
      setSuccess(response.data.message || 'Registration successful! Please log in.');
      setEmail('');
      setMobile('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Registration failed!');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto text-white">
      <h2 className="text-lg font-semibold mb-4">Join Us!</h2>
      <label>Email Address</label>
      <input
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
      />

      <label className="mt-2">Mobile Number</label>
      <input
        type="tel"
        name="mobile"
        inputMode="numeric"
        value={mobile}
        onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
        placeholder="10-digit mobile number"
        required
        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
        maxLength={10}
      />

      <label className="mt-2">Password</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
      />

      <label className="mt-2">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
      />

      {error && <div className="text-red-400 text-sm my-1">{error}</div>}
      {success && <div className="text-green-400 text-sm my-1">{success}</div>}

      <button
        type="submit"
        className="w-full mt-3 bg-yellow-500 text-black font-bold py-2 px-4 rounded"
      >
        Register
      </button>

      <button
        type="button"
        onClick={onSwitch}
        className="w-full mt-3 text-yellow-400 underline"
      >
        Already have an account? Login
      </button>
    </form>
  );
};

export default RegisterForm;
