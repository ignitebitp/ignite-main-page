import express from 'express';
import prisma from '../prisma.js';
import auth, { requireStaff } from '../middleware/auth.js';
import { sendEmail } from '../lib/mailer.js';

const router = express.Router();
const CLUB_EMAIL = 'ignite@bitmesra.ac.in';

// POST /api/contact — public: submit Contact Us form, store in DB & email ignite@bitmesra.ac.in
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const entry = await prisma.contactMessage.create({
      data: {
        type: 'contact',
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject ? subject.trim() : 'General Inquiry',
        message: message.trim(),
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">New Contact Message — IGNITE Website</h2>
        <p><strong>Name:</strong> ${entry.name}</p>
        <p><strong>Email:</strong> ${entry.email}</p>
        <p><strong>Subject:</strong> ${entry.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f7f7f7; padding: 14px; border-radius: 8px; white-space: pre-wrap;">${entry.message}</div>
      </div>
    `;

    sendEmail(CLUB_EMAIL, `[Contact] ${entry.subject} — ${entry.name}`, emailHtml)
      .catch(err => console.error('Contact notification email error:', err));

    return res.status(201).json({ message: 'Message received', entry });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/contact/interest — public: /register interest form, store in DB & email ignite@bitmesra.ac.in
router.post('/interest', async (req, res) => {
  try {
    const { name, email, phone, branch, batch, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const entry = await prisma.contactMessage.create({
      data: {
        type: 'interest',
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        branch: branch ? branch.trim() : null,
        batch: batch ? batch.trim() : null,
        subject: 'Student Interest Registration (/register)',
        message: (message || 'Interested in joining / participating in IGNITE events.').trim(),
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">New Student Interest Submission (/register)</h2>
        <p><strong>Name:</strong> ${entry.name}</p>
        <p><strong>Email:</strong> ${entry.email}</p>
        ${entry.phone ? `<p><strong>Phone:</strong> ${entry.phone}</p>` : ''}
        ${entry.branch ? `<p><strong>Branch:</strong> ${entry.branch}</p>` : ''}
        ${entry.batch ? `<p><strong>Batch:</strong> ${entry.batch}</p>` : ''}
        <p><strong>Notes / Interests:</strong></p>
        <div style="background: #f7f7f7; padding: 14px; border-radius: 8px; white-space: pre-wrap;">${entry.message}</div>
      </div>
    `;

    sendEmail(CLUB_EMAIL, `[Student Interest] ${entry.name} (${entry.email})`, emailHtml)
      .catch(err => console.error('Interest notification email error:', err));

    return res.status(201).json({ message: 'Interest recorded', entry });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/contact — staff (Owner, Admin, Moderator): view all contact & interest submissions
router.get('/', auth, requireStaff, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(messages.map(m => ({ ...m, _id: m.id })));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contact/:id — staff: delete a message
router.delete('/:id', auth, requireStaff, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
