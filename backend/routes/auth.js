import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prisma.js';
import { sendEmail } from '../lib/mailer.js';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ignite_secret_jwt_key_2025';

// POST /api/auth/register — register new student account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        verificationCode: otp,
      },
    });

    // Send OTP Email
    const emailHtml = `
      <div style="font-family: sans-serif; color: #333; text-align: center; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #f97316;">Verify Your IGNITE Account</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your verification code for IGNITE is:</p>
        <div style="background: #f7f7f7; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; color: #f97316; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>Keep burning bright!</p>
        <br/>
        <p>Best Regards,<br/><strong>Team IGNITE</strong></p>
      </div>
    `;

    sendEmail(cleanEmail, 'Verify Your IGNITE Account', emailHtml)
      .catch(err => console.error('Register OTP email error:', err));

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user.id,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verificationCode !== otp) return res.status(400).json({ error: 'Invalid verification code' });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
      },
    });

    const token = jwt.sign({ id: updated.id, role: 'user', email: updated.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: updated.id, _id: updated.id, name: updated.name, email: updated.email, isVerified: updated.isVerified },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/complete-profile
router.post('/complete-profile', auth, async (req, res) => {
  try {
    const { phone, college, branch, batch } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        phone: phone || null,
        college: college || null,
        branch: branch || null,
        batch: batch || null,
      },
    });

    res.json({
      message: 'Profile completed successfully',
      user: { id: user.id, _id: user.id, name: user.name, email: user.email, isVerified: user.isVerified },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login — User & Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    // 1. Default Admin Credentials Check (admin / admin)
    const isAdminUser = cleanEmail === 'admin' || cleanEmail === 'admin@ignite.com' || cleanEmail === 'admin@ignitebitp.in';
    const isDefaultAdminPass = cleanPassword === 'admin' || cleanPassword === (process.env.ADMIN_PASSWORD || 'admin');

    if (isAdminUser && isDefaultAdminPass) {
      const token = jwt.sign(
        { id: 'admin-root', role: 'admin', email: 'admin@ignitebitp.in', name: 'IGNITE Administrator' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        token,
        role: 'admin',
        user: { name: 'IGNITE Administrator', email: 'admin@ignitebitp.in', role: 'admin' },
      });
    }

    // 2. Regular User Login from Prisma DB
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email first', email: user.email });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = jwt.sign({ id: user.id, role: 'user', email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, _id: user.id, name: user.name, email: user.email, isVerified: user.isVerified },
      role: 'user',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/verify
router.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role === 'admin') {
      return res.json({ valid: true, role: 'admin' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return res.status(401).json({ valid: false });

    res.json({
      valid: true,
      role: 'user',
      user: { id: user.id, _id: user.id, name: user.name, email: user.email, isVerified: user.isVerified },
    });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
