const express = require('express');
const jwt = require('jsonwebtoken'); // For handling JWTs
const bcrypt = require('bcryptjs'); // For hashing passwords
const User = require('../models/User'); // Your user model

const router = express.Router();

// Use JWT_SECRET from environment
const jwtSecret = process.env.JWT_SECRET;

// Example Sign-Up route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Create a JWT token
    const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '1h' });

    // Return the token
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Example Sign-In route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

    // Return the token
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error signing in' });
  }
});

module.exports = router;
