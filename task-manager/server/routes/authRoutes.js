import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Assuming you have JWT set up for token generation
import User from '../models/userModel.js';

const router = express.Router();

// Register Route
// Register Route
router.post('/register', async (req, res) => {
  const { email, password, mobile } = req.body;
  if (!email || !password || !mobile) {
    return res.status(400).json({ message: 'Email, password, and mobile are required.' });
  }
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ message: 'Mobile must be a 10-digit number.' });
  }
  try {
    // Check for existing email OR mobile
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, password, mobile });
    await user.save();

    // Generate JWT token upon successful registration (optional)
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, email: user.email, id: user._id, mobile: user.mobile });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare plaintext password with hashed password from DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token upon successful login
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, email: user.email, id: user._id });
  } catch (err) {
    // console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // console.log(`Password reset failed: User with email ${email} not found.`);
      return res.status(404).json({ message: 'User not found with that email address.' });
    }

    // Assign the plaintext password. The pre('save') hook in userModel.js will hash it.
    user.password = password; 
    
    await user.save(); // This will trigger the pre('save') hook in userModel.js

    // console.log(`Password for user ${email} reset successfully.`);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    // console.error('Password reset error:', err); 
    if (err.name === 'MongoError' || err.name === 'MongooseError') {
      res.status(500).json({ message: 'Password reset failed due to a database error. Please try again.' });
    } else if (err instanceof Error) {
      res.status(500).json({ message: `Password reset failed: ${err.message}` });
    } else {
      res.status(500).json({ message: 'Password reset failed due to an unexpected server error.' });
    }
  }
});

export default router; // Export router using ES module syntax