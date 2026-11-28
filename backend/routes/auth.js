import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ignite_secret_jwt_key_2025';

const getEnvOwnerEmail = () => (process.env.OWNER_EMAIL || 'owner@igniteclub.tech').toLowerCase().trim();
const getEnvOwnerPassword = () => (process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD || 'ignite_owner_2025').trim();

/**
 * Ensures the single Owner account exists in PostgreSQL, seeded from .env on first use.
 * Once in the DB, password changes/resets mutate the DB row directly.
 */
async function ensureOwnerSeeded() {
  const ownerEmail = getEnvOwnerEmail();
  const existingOwner = await prisma.user.findFirst({ where: { role: 'owner' } });
  if (existingOwner) {
    if (existingOwner.email !== ownerEmail) {
      return await prisma.user.update({
        where: { id: existingOwner.id },
        data: { email: ownerEmail },
      });
    }
    return existingOwner;
  }

  const hashedPassword = await bcrypt.hash(getEnvOwnerPassword(), 10);

  return await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { role: 'owner', password: hashedPassword, isVerified: true },
    create: {
      name: 'IGNITE Owner',
      email: ownerEmail,
      role: 'owner',
      password: hashedPassword,
      isVerified: true,
    },
  });
}

// POST /api/auth/login — Owner, Admin, & Moderator Login (DB-backed)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const owner = await ensureOwnerSeeded();

    // Allow logging in with OWNER_EMAIL or shortcut 'owner' / 'admin'
    const isOwnerLogin = cleanEmail === 'owner' || cleanEmail === 'admin' || cleanEmail === owner.email;
    const user = isOwnerLogin
      ? owner
      : await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.password) {
      return res.status(403).json({
        error: 'Password not set yet. Please create your password to activate your account.',
        needsPasswordSetup: true,
        email: user.email,
      });
    }

    let isMatch = await bcrypt.compare(cleanPassword, user.password);
    // If .env OWNER_PASSWORD was updated directly, allow it and sync DB hash
    if (!isMatch && isOwnerLogin && cleanPassword === getEnvOwnerPassword()) {
      isMatch = true;
      const newHash = await bcrypt.hash(cleanPassword, 10);
      await prisma.user.update({ where: { id: owner.id }, data: { password: newHash } });
    }
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), isVerified: true },
    });

    const userRole = ['owner', 'admin', 'moderator'].includes(updated.role) ? updated.role : 'moderator';
    const token = jwt.sign(
      { id: updated.id, role: userRole, email: updated.email, name: updated.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      role: userRole,
      user: {
        id: updated.id,
        _id: updated.id,
        name: updated.name,
        email: updated.email,
        role: userRole,
        isVerified: updated.isVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/change-password — authenticated user updates password directly in DB (no email)
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const cleanCurrent = (currentPassword || '').trim();
    const cleanNew = (newPassword || '').trim();

    if (!cleanCurrent || !cleanNew) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    if (cleanNew.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !user.password) {
      return res.status(404).json({ error: 'User account not found' });
    }

    const isMatch = await bcrypt.compare(cleanCurrent, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(cleanNew, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return res.json({ message: 'Password updated directly in database' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password — Owner recovery reset directly in DB using .env OWNER_PASSWORD (no email)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, recoveryPassword, newPassword } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanRecovery = (recoveryPassword || '').trim();
    const cleanNew = (newPassword || '').trim();

    if (!cleanEmail || !cleanRecovery || !cleanNew) {
      return res.status(400).json({ error: 'Email, .env recovery password, and new password are required' });
    }
    if (cleanNew.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const owner = await ensureOwnerSeeded();
    const matchesOwnerEmail = cleanEmail === owner.email || cleanEmail === 'owner' || cleanEmail === 'admin';
    if (!matchesOwnerEmail || cleanRecovery !== getEnvOwnerPassword()) {
      return res.status(401).json({ error: 'Invalid owner email or .env recovery password' });
    }

    const hashedPassword = await bcrypt.hash(cleanNew, 10);
    await prisma.user.update({
      where: { id: owner.id },
      data: { password: hashedPassword, isVerified: true },
    });

    return res.json({ message: 'Owner password reset directly in database' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/invite-status — check if invited email needs password creation
router.get('/invite-status', async (req, res) => {
  try {
    const token = typeof req.query.token === 'string' ? req.query.token.trim() : '';
    const email = typeof req.query.email === 'string' ? req.query.email.toLowerCase().trim() : '';

    if (!token && !email) {
      return res.status(400).json({ error: 'Invite token or email is required' });
    }

    const user = token
      ? await prisma.user.findUnique({ where: { inviteToken: token } })
      : await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'No pending invite found for this account' });
    }

    if (user.inviteExpires && new Date(user.inviteExpires) < new Date()) {
      return res.status(410).json({ error: 'Invite has expired. Ask an Admin or Owner to re-invite you.' });
    }

    return res.json({
      email: user.email,
      name: user.name,
      role: user.role,
      needsPasswordSetup: !user.password,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/setup-password — invited user creates their password and logs in
router.post('/setup-password', async (req, res) => {
  try {
    const { token, email, password, name } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    if (cleanPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = token
      ? await prisma.user.findUnique({ where: { inviteToken: String(token).trim() } })
      : await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return res.status(404).json({ error: 'No account found for this email or invite token' });
    }

    if (user.password) {
      return res.status(400).json({ error: 'Password is already set. Please sign in normally.' });
    }

    if (user.inviteExpires && new Date(user.inviteExpires) < new Date()) {
      return res.status(410).json({ error: 'Invite has expired. Please request a new invite.' });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name?.trim() || user.name,
        password: hashedPassword,
        isVerified: true,
        inviteToken: null,
        inviteExpires: null,
        lastLogin: new Date(),
      },
    });

    const userRole = ['owner', 'admin', 'moderator'].includes(updated.role) ? updated.role : 'moderator';
    const jwtToken = jwt.sign(
      { id: updated.id, role: userRole, email: updated.email, name: updated.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token: jwtToken,
      role: userRole,
      user: {
        id: updated.id,
        _id: updated.id,
        name: updated.name,
        email: updated.email,
        role: userRole,
        isVerified: true,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PATCH /api/auth/profile — authenticated user updates their display name in DB
router.patch('/profile', auth, async (req, res) => {
  try {
    const cleanName = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name: cleanName },
    });

    const userRole = ['owner', 'admin', 'moderator'].includes(updated.role) ? updated.role : 'moderator';
    const token = jwt.sign(
      { id: updated.id, role: userRole, email: updated.email, name: updated.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: updated.id,
        _id: updated.id,
        name: updated.name,
        email: updated.email,
        role: userRole,
        isVerified: updated.isVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/verify — verify JWT
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, user: req.user, role: req.user.role });
});

export default router;
