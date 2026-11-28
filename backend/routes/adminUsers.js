import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import auth, { requireAdmin, requireOwner, requireStaff } from '../middleware/auth.js';
import { sendEmail } from '../lib/mailer.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ignite_secret_jwt_key_2025';
const SITE_URL = process.env.FRONTEND_URL || 'https://www.igniteclub.tech';

// POST /api/admin/login — explicit admin/staff login
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const userIdentifier = (email || username || 'admin').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    const isRootOwner =
      userIdentifier === 'admin' ||
      userIdentifier === 'owner' ||
      userIdentifier === 'admin@ignite.com' ||
      userIdentifier === 'admin@ignitebitp.in';
    const expectedOwnerPass = process.env.ADMIN_PASSWORD || 'admin';

    if (isRootOwner && cleanPassword === expectedOwnerPass) {
      const token = jwt.sign(
        { id: 'owner-root', role: 'owner', email: 'admin@ignitebitp.in', name: 'IGNITE Owner' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        token,
        role: 'owner',
        user: { name: 'IGNITE Owner', email: 'admin@ignitebitp.in', role: 'owner' },
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users — Owner & Admin: list all staff users
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        inviteToken: true,
        lastLogin: true,
        createdAt: true,
      },
    });
    res.json(users.map(u => ({ ...u, _id: u.id, hasPassword: Boolean(u.isVerified) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/users — Owner can add Admin or Moderator; Admin can add Moderator only
router.post('/users', auth, requireAdmin, async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const requestedRole = (role || 'moderator').toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    if (requestedRole === 'owner') {
      return res.status(403).json({ error: 'There can only be one Owner' });
    }

    if (!['admin', 'moderator'].includes(requestedRole)) {
      return res.status(400).json({ error: 'Role must be admin or moderator' });
    }

    // Only Owner can add new Admins
    if (requestedRole === 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only the Owner can add new Admins' });
    }

    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing && existing.password) {
      return res.status(400).json({ error: 'A user with this email is already active' });
    }

    const inviteToken = crypto.randomBytes(24).toString('hex');
    const inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const displayName = (name || cleanEmail.split('@')[0]).trim();

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: { name: displayName, role: requestedRole, inviteToken, inviteExpires },
        })
      : await prisma.user.create({
          data: {
            name: displayName,
            email: cleanEmail,
            role: requestedRole,
            password: null,
            isVerified: false,
            inviteToken,
            inviteExpires,
          },
        });

    const inviteLink = `${SITE_URL}/admin?invite=${inviteToken}&email=${encodeURIComponent(cleanEmail)}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #f97316;">You've been invited to IGNITE Admin</h2>
        <p>Hi <strong>${displayName}</strong>,</p>
        <p>You have been added to the IGNITE Admin Panel with the role: <strong style="text-transform: uppercase;">${requestedRole}</strong>.</p>
        <p>Click below to create your password and sign in:</p>
        <div style="margin: 24px 0;">
          <a href="${inviteLink}" style="background: #f97316; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Create Password & Sign In
          </a>
        </div>
        <p style="font-size: 12px; color: #666;">Or open: <a href="${inviteLink}">${inviteLink}</a></p>
      </div>
    `;

    sendEmail(cleanEmail, 'IGNITE Admin Invitation — Set Your Password', emailHtml)
      .catch(err => console.error('Invite email error:', err));

    return res.status(201).json({
      message: `${requestedRole} invited successfully`,
      inviteLink,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/users/:id/role — Owner only: promote moderator <-> admin
router.patch('/users/:id/role', auth, requireOwner, async (req, res) => {
  try {
    const nextRole = (req.body?.role || '').toLowerCase().trim();
    if (!['admin', 'moderator'].includes(nextRole)) {
      return res.status(400).json({ error: 'Role must be admin or moderator' });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.role === 'owner') {
      return res.status(403).json({ error: 'Cannot change the Owner role' });
    }

    const updated = await prisma.user.update({
      where: { id: target.id },
      data: { role: nextRole },
      select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true },
    });

    return res.json({ ...updated, _id: updated.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/users/:id/reset-password — Owner/Admin resets staff password directly in DB (no email)
router.post('/users/:id/reset-password', auth, requireAdmin, async (req, res) => {
  try {
    const cleanNew = (req.body?.newPassword || '').trim();
    if (cleanNew.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'User not found' });

    if (target.role === 'owner' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only the Owner can reset the Owner password' });
    }
    if (target.role === 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only the Owner can reset an Admin password' });
    }

    const hashedPassword = await bcrypt.hash(cleanNew, 10);
    await prisma.user.update({
      where: { id: target.id },
      data: { password: hashedPassword, isVerified: true, inviteToken: null, inviteExpires: null },
    });

    return res.json({ message: `Password reset directly in database for ${target.email}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id — Owner can delete Admins/Moderators; Admin can delete Moderators
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: 'User not found' });

    if (target.role === 'owner') {
      return res.status(403).json({ error: 'Owner account cannot be deleted' });
    }
    if (target.role === 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only the Owner can remove Admins' });
    }

    await prisma.user.delete({ where: { id: target.id } });
    return res.json({ message: 'User removed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/resend-status — check Resend API key status
router.get('/resend-status', auth, requireStaff, async (req, res) => {
  const configured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_'));
  const sender = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  res.json({
    configured,
    sender,
    message: configured ? 'Resend API is connected and ready.' : 'RESEND_API_KEY is not configured or invalid.',
  });
});

// POST /api/admin/send-email — send email via Resend API
router.post('/send-email', auth, requireStaff, async (req, res) => {
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

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients found for the selected target.' });
    }

    const uniqueRecipients = [...new Set(recipients)];
    const results = [];
    for (const recipient of uniqueRecipients) {
      try {
        const result = await sendEmail(recipient, subject, emailContent);
        results.push({ email: recipient, status: 'sent', id: result?.id || 'ok' });
      } catch (err) {
        results.push({ email: recipient, status: 'failed', error: err.message });
      }
    }

    const sentCount = results.filter(r => r.status === 'sent').length;
    res.json({
      message: `Dispatched ${sentCount} of ${uniqueRecipients.length} emails.`,
      results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
