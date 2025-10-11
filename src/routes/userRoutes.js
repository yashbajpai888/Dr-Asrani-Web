const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// 🧩 Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 🔑 Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ✅ REGISTER USER
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, profilePic } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      profilePic: profilePic || '',
    });

    const savedUser = await newUser.save();

    console.log(`✅ User created: ${savedUser.email}`);

    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      profilePic: savedUser.profilePic,
      token: generateToken(savedUser._id),
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Server Error during registration' });
  }
});

// ✅ LOGIN USER
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Fallback hardcoded users for testing
    const hardcodedUsers = [
      { _id: '1', name: 'Admin', email: 'admin@drasrani.in', password: 'admin123', role: 'admin' },
      { _id: '2', name: 'John Doe', email: 'john@drasrani.in', password: 'patient123', role: 'patient' },
      { _id: '3', name: 'Dr. Smith', email: 'doctor@drasrani.in', password: 'doctor123', role: 'doctor' },
      { _id: '4', name: 'Diksha Kore', email: 'korediksha30@gmail.com', password: 'diksha123', role: 'doctor' },
    ];

    if (!user) {
      const fallbackUser = hardcodedUsers.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );
      if (fallbackUser) {
        console.log(`✅ Fallback login: ${fallbackUser.email}`);
        return res.json({
          ...fallbackUser,
          token: generateToken(fallbackUser._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ Database login: ${user.email}`);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server Error during login' });
  }
});

// ✅ GET LOGGED-IN USER PROFILE
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error('❌ Profile fetch error:', err);
    res.status(500).json({ message: 'Server Error while fetching profile' });
  }
});

// ✅ UPDATE USER PROFILE
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email ? req.body.email.toLowerCase() : user.email;
      user.role = req.body.role || user.role;
      user.profilePic = req.body.profilePic || user.profilePic;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ message: 'Server Error while updating profile' });
  }
});

// ✅ GET ALL USERS (ADMIN)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('❌ Fetch users error:', err);
    res.status(500).json({ message: 'Server Error while fetching users' });
  }
});

// ✅ DELETE USER BY ID (ADMIN)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Delete user error:', err);
    res.status(500).json({ message: 'Server Error while deleting user' });
  }
});

// ✅ FORGOT PASSWORD - REQUEST OTP
// @route   POST /api/users/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in session
    req.session.resetOTP = {
      email: normalizedEmail,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };
    
    // Fallback for demo/development
    const hardcodedUsers = [
      { _id: '1', name: 'Admin', email: 'admin@drasrani.in', password: 'admin123', role: 'admin' },
      { _id: '2', name: 'John Doe', email: 'john@drasrani.in', password: 'patient123', role: 'patient' },
      { _id: '3', name: 'Dr. Smith', email: 'doctor@drasrani.in', password: 'doctor123', role: 'doctor' },
      { _id: '4', name: 'Diksha Kore', email: 'korediksha30@gmail.com', password: 'diksha123', role: 'doctor' },
    ];
    
    const fallbackUser = hardcodedUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (!user && !fallbackUser) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If your email is registered, you will receive an OTP shortly' });
    }
    
    // In a real application, send email with OTP
    console.log(`✅ OTP for ${normalizedEmail}: ${otp}`);
    
    res.json({ 
      message: 'OTP sent to your email',
      // Include OTP in response for demo purposes only
      // In production, this should be removed
      demo_otp: otp
    });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ message: 'Server Error during password reset request' });
  }
});

// ✅ VERIFY OTP
// @route   POST /api/users/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    
    const normalizedEmail = email.toLowerCase();
    
    // Check if OTP exists and is valid
    const resetOTP = req.session.resetOTP;
    
    if (!resetOTP || 
        resetOTP.email !== normalizedEmail || 
        resetOTP.otp !== otp || 
        Date.now() > resetOTP.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Mark OTP as verified
    req.session.resetOTP.verified = true;
    
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('❌ OTP verification error:', err);
    res.status(500).json({ message: 'Server Error during OTP verification' });
  }
});

// ✅ RESET PASSWORD
// @route   POST /api/users/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    
    const normalizedEmail = email.toLowerCase();
    
    // Check if OTP was verified
    const resetOTP = req.session.resetOTP;
    
    if (!resetOTP || 
        resetOTP.email !== normalizedEmail || 
        !resetOTP.verified) {
      return res.status(400).json({ message: 'OTP verification required before password reset' });
    }
    
    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    
    if (user) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
    }
    
    // Clear session data
    delete req.session.resetOTP;
    
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('❌ Password reset error:', err);
    res.status(500).json({ message: 'Server Error during password reset' });
  }
});

module.exports = router;
