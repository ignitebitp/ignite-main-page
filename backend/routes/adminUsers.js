import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import auth from '../middleware/auth.js';
import { sendEmail } from '../lib/mailer.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ignite_secret_jwt_key_2025';

// Admin Authorization Guard
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Administrative clearance required' });
  }
};

// POST /api/admin/login — explicit admin login (admin/admin)
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const userIdentifier = (email || username || 'admin').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    const isValidUser = userIdentifier === 'admin' || userIdentifier === 'admin@ignite.com' || userIdentifier === 'admin@ignitebitp.in';
    const isValidPass = cleanPassword === 'admin' || cleanPassword === (process.env.ADMIN_PASSWORD || 'admin');

    if (isValidUser && isValidPass) {
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

    return res.status(401).json({ error: 'Invalid admin credentials' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users — admin: list all registered users from Prisma DB
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        branch: true,
        batch: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
      },
    });
    res.json(users.map(u => ({ ...u, _id: u.id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/resend-status — check Resend API key status
router.get('/resend-status', auth, requireAdmin, async (req, res) => {
  const configured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_'));
  const sender = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  res.json({
    configured,
    sender,
    message: configured ? 'Resend API is connected and ready.' : 'RESEND_API_KEY is not configured or invalid.',
  });
});

// POST /api/admin/send-email — send email via Resend API
router.post('/send-email', auth, requireAdmin, async (req, res) => {
  try {
    const { to, subject, html, message, targetGroup } = req.body;

    if (!subject) {
      return res.status(400).json({ error: 'Email subject is required' });
    }

    const emailContent = html || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #f97316;">IGNITE Technical Club</h2>
        <div style="line-height: 1.6; color: #333; margin: 20px 0;">
          ${(message || '').replace(/\n/g, '<br/>')}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777;">
          You are receiving this communication from IGNITE Technical Innovation Club, BIT Mesra.
        </p>
      </div>
    `;

    let recipients = [];

    if (targetGroup === 'recruits') {
      const recruits = await prisma.recruitment.findMany({ select: { email: true } });
      recipients = recruits.map(r => r.email).filter(Boolean);
    } else if (targetGroup === 'events') {
      const registrations = await prisma.eventRegistration.findMany({ select: { email: true } });
      recipients = registrations.map(r => r.email).filter(Boolean);
    } else if (targetGroup === 'users') {
      const users = await prisma.user.findMany({ select: { email: true } });
      recipients = users.map(u => u.email).filter(Boolean);
    } else if (to) {
      recipients = Array.isArray(to) ? to : to.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Deduplicate recipient emails
    recipients = Array.from(new Set(recipients));

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No recipient email addresses found' });
    }

    const results = { sent: 0, failed: 0, errors: [] };

    // Send emails (batch or loop through recipients)
    for (const recipient of recipients) {
      try {
        await sendEmail(recipient, subject, emailContent);
        results.sent++;
      } catch (err) {
        results.failed++;
        results.errors.push({ email: recipient, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Transmission complete: ${results.sent} sent, ${results.failed} failed.`,
      results,
    });
  } catch (err) {
    console.error('Admin send email error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
