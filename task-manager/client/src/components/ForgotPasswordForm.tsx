import React, { useState } from "react";
import axios, { AxiosError } from "axios";

type ForgotPasswordFormProps = { onSwitch: () => void };

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // No OTP state/logic needed now

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setFormError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!email) {
      setFormError("Please provide your email.");
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', {
        email,
        password: newPassword,
      });
      setFormSuccess("Password reset successful! You may now log in.");
      setEmail('');
      setMobile('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onSwitch(); // Switch to login form
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(
          ((err as AxiosError<{ message?: string }>).response?.data?.message) ||
          "Failed to reset password."
        );
      } else {
        setFormError("Failed to reset password.");
      }
    }
  };

  return (
    <form onSubmit={handleResetSubmit} className="w-full max-w-md mx-auto text-white">
      <h2 className="text-lg font-semibold mb-4">Reset Password</h2>

      <label>Email Address</label>
      <input
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={!!formSuccess}
        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
      />

      <label className="mt-2">Mobile Number</label>
      <input
        type="tel"
        name="mobile"
        inputMode="numeric"
        value={mobile}
        onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
        required
        disabled={!!formSuccess}
        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
        placeholder="10-digit mobile number"
        maxLength={10}
      />

      <label className="mt-2">New Password</label>
      <input
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        disabled={!!formSuccess}
        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
      />

      <label className="mt-2">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        disabled={!!formSuccess}
        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
      />

      {formError && <div className="text-red-400 text-sm my-1">{formError}</div>}
      {formSuccess && <div className="text-green-400 text-sm my-1">{formSuccess}</div>}

      <button
        type="submit"
        disabled={!!formSuccess}
        className="w-full mt-3 bg-yellow-500 text-black font-bold py-2 px-4 rounded"
      >
        Reset Password
      </button>

      <button
        type="button"
        onClick={onSwitch}
        className="w-full mt-3 text-yellow-400 underline"
      >
        Back to Login
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
