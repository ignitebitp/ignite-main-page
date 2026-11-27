import express from 'express';
import prisma from '../prisma.js';
import auth from '../middleware/auth.js';
import { sendEmail } from '../lib/mailer.js';

const router = express.Router();

// POST /api/recruit — public: submit application to Prisma DB
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      rollNo,
      branch,
      batch,
      semester,
      interests,
      esportsGame,
      resume,
      whyJoin
    } = req.body;

    if (!name || !email || !phone || !rollNo || !whyJoin) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanRollNo = rollNo.trim();

    // Check for existing application with email or rollNo
    const existing = await prisma.recruitment.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { rollNo: cleanRollNo }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already applied with this email or roll number.' });
    }

    const application = await prisma.recruitment.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        rollNo: cleanRollNo,
        branch: (branch || '').trim(),
        batch: (batch || '2025').trim(),
        semester: (semester || '1st Semester').trim(),
        interests: Array.isArray(interests) ? interests : (interests ? [interests] : []),
        esportsGame: esportsGame ? esportsGame.trim() : null,
        resume: resume ? resume.trim() : null,
        whyJoin: whyJoin.trim(),
        status: 'pending',
      }
    });

    // Fetch WhatsApp group link from config (fallback to default)
    let whatsappLink = 'https://chat.whatsapp.com/G8Ds9PBrIlpFV5lpvClOVV?mode=gi_t';
    try {
      const config = await prisma.systemConfig.findUnique({ where: { key: 'whatsappGroupLink' } });
      if (config && config.value) {
        whatsappLink = typeof config.value === 'string' ? config.value : (config.value.url || whatsappLink);
      }
    } catch (_) {}

    // Send confirmation email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 24px;">Application Received! 🎉</h2>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
          <p>Hi <strong>${application.name}</strong>,</p>
          <p>Thanks for applying to <strong>IGNITE Technical Innovation Club</strong>!</p>
          <p>We have received your application. We'll review it and get back to you soon regarding the next steps.</p>
          <p><strong>Application ID:</strong> ${application.id}</p>
          <p><strong>Roll No:</strong> ${application.rollNo}</p>
          <p><strong>Interests:</strong> ${application.interests.join(', ')}</p>

          <div style="background: #25D366; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="color: white; margin: 0 0 12px 0; font-size: 16px; font-weight: bold;">📱 Join our WhatsApp Group</p>
            <p style="color: rgba(255,255,255,0.9); margin: 0 0 16px 0; font-size: 14px;">Stay updated with all IGNITE announcements and news!</p>
            <a href="${whatsappLink}" target="_blank" style="display: inline-block; background: white; color: #25D366; font-weight: bold; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 15px;">
              Join WhatsApp Group →
            </a>
          </div>

          <p style="color: #888; font-size: 13px;">If the button above doesn't work, copy and paste this link:<br/>
          <a href="${whatsappLink}" style="color: #f97316;">${whatsappLink}</a></p>

          <br/>
          <p>Best Regards,</p>
          <p><strong>Team IGNITE</strong></p>
        </div>
      </div>
    `;

    sendEmail(application.email, 'IGNITE Recruitment: Application Received', emailHtml)
      .catch(err => console.error('Recruitment email failed:', err));

    res.status(201).json({
      message: 'Application submitted successfully!',
      id: application.id,
      _id: application.id,
      whatsappLink
    });
  } catch (err) {
    if (err.code === 'P2002' || err.code === 11000) {
      return res.status(400).json({ error: 'You have already applied with this email or roll number.' });
    }
    res.status(400).json({ error: err.message });
  }
});

// GET /api/recruit — admin: get all applications from Prisma DB
router.get('/', auth, async (req, res) => {
  try {
    const applications = await prisma.recruitment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // Add _id alias for frontend compatibility
    const formatted = applications.map(app => ({
      ...app,
      _id: app.id
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/recruit/:id — admin: update status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await prisma.recruitment.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({
      ...application,
      _id: application.id
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/recruit/:id — admin: delete
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.recruitment.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
