import express from 'express';
import prisma from '../prisma.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { sendEmail } from '../lib/mailer.js';
import { uploadImage, uploadRawFile } from '../lib/blob.js';

const router = express.Router();

// Multer Config (Memory Storage for Sharp / Blob processing)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to process and save image (Blob or local WebP fallback)
const saveImage = async (buffer) => {
  return await uploadImage(`events/${Date.now()}.webp`, buffer, { width: 1200, height: 800 });
};

// Helper to format event for frontend with _id alias
const formatEvent = (event) => {
  if (!event) return null;
  return {
    ...event,
    _id: event.id,
    subEvents: event.subEvents ? event.subEvents.map(s => ({ ...s, _id: s.id })) : [],
  };
};

// Helper to format registration for frontend with _id alias
const formatRegistration = (reg) => {
  if (!reg) return null;
  return {
    ...reg,
    _id: reg.id,
    eventId: reg.event ? { ...reg.event, _id: reg.event.id } : reg.eventId,
  };
};

// ===== EVENT MANAGEMENT (Admin) =====

// POST /api/events — admin: create event in Prisma DB
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const eventData = req.body;
    let imageUrl = eventData.image || null;

    if (req.file) {
      imageUrl = await saveImage(req.file.buffer);
    }

    const event = await prisma.event.create({
      data: {
        name: eventData.name,
        description: eventData.description || null,
        date: eventData.date ? new Date(eventData.date) : null,
        venue: eventData.venue || null,
        type: eventData.type || 'standalone',
        isTeamEvent: eventData.isTeamEvent === true || eventData.isTeamEvent === 'true',
        maxTeamSize: Number(eventData.maxTeamSize) || 1,
        isActive: eventData.isActive !== false && eventData.isActive !== 'false',
        category: eventData.category || 'Inginiux 2.0',
        parentId: eventData.parentId || null,
        image: imageUrl,
        registrationsOpen: eventData.registrationsOpen !== false && eventData.registrationsOpen !== 'false',
        status: eventData.status || 'upcoming',
        isFeatured: eventData.isFeatured === true || eventData.isFeatured === 'true',
        certificateTemplate: eventData.certificateTemplate || null,
        certificateCoords: eventData.certificateCoords
          ? (typeof eventData.certificateCoords === 'string' ? JSON.parse(eventData.certificateCoords) : eventData.certificateCoords)
          : undefined,
      },
      include: {
        subEvents: true,
      }
    });

    res.status(201).json(formatEvent(event));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/events — public: list active events from Prisma DB
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: 'asc' },
      include: {
        subEvents: true,
      }
    });
    res.json(events.map(formatEvent));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/all — admin: list all events from Prisma DB
router.get('/all', auth, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        subEvents: true,
      }
    });
    res.json(events.map(formatEvent));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/events/:id — admin: update event in Prisma DB
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = await saveImage(req.file.buffer);
    }

    const data = {};
    if (updateData.name !== undefined) data.name = updateData.name;
    if (updateData.description !== undefined) data.description = updateData.description || null;
    if (updateData.date !== undefined) data.date = updateData.date ? new Date(updateData.date) : null;
    if (updateData.venue !== undefined) data.venue = updateData.venue || null;
    if (updateData.type !== undefined) data.type = updateData.type;
    if (updateData.isTeamEvent !== undefined) data.isTeamEvent = updateData.isTeamEvent === true || updateData.isTeamEvent === 'true';
    if (updateData.maxTeamSize !== undefined) data.maxTeamSize = Number(updateData.maxTeamSize) || 1;
    if (updateData.isActive !== undefined) data.isActive = updateData.isActive !== false && updateData.isActive !== 'false';
    if (updateData.category !== undefined) data.category = updateData.category;
    if (updateData.parentId !== undefined) data.parentId = updateData.parentId || null;
    if (updateData.image !== undefined) data.image = updateData.image;
    if (updateData.registrationsOpen !== undefined) data.registrationsOpen = updateData.registrationsOpen !== false && updateData.registrationsOpen !== 'false';
    if (updateData.status !== undefined) data.status = updateData.status;
    if (updateData.isFeatured !== undefined) data.isFeatured = updateData.isFeatured === true || updateData.isFeatured === 'true';
    if (updateData.certificateTemplate !== undefined) data.certificateTemplate = updateData.certificateTemplate;
    if (updateData.certificateCoords !== undefined) {
      data.certificateCoords = typeof updateData.certificateCoords === 'string'
        ? JSON.parse(updateData.certificateCoords)
        : updateData.certificateCoords;
    }

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data,
      include: {
        subEvents: true,
      }
    });

    res.json(formatEvent(event));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/events/:id — admin: delete event (cascade deletes registrations and sub-events)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Delete event (foreign keys with onDelete: Cascade will clean up sub-events and registrations)
    await prisma.event.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Event and related data deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== EVENT REGISTRATION (Public) =====

// POST /api/events/register — public: register for event in Prisma DB
router.post('/register', async (req, res) => {
  try {
    const { eventId, name, email, phone, rollNo, branch, teamName, teamMembers } = req.body;

    if (!eventId || !name || !email || !phone || !rollNo) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanRollNo = rollNo.trim();

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (!event.registrationsOpen) {
      return res.status(400).json({ error: 'Registrations are closed for this event.' });
    }

    // Check for existing registration for this event
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_email: {
          eventId,
          email: cleanEmail,
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        rollNo: cleanRollNo,
        branch: branch ? branch.trim() : null,
        teamName: teamName ? teamName.trim() : null,
        teamMembers: teamMembers || undefined,
        attended: false,
      }
    });

    // Send confirmation email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #f97316;">Registration Confirmed!</h2>
        <p>Hi <strong>${registration.name}</strong>,</p>
        <p>You have successfully registered for <strong>${event.name}</strong>.</p>
        <hr/>
        <p><strong>Registration ID:</strong> ${registration.id}</p>
        <p><strong>Event Details:</strong></p>
        <ul>
          <li><strong>Date:</strong> ${event.date ? new Date(event.date).toDateString() : 'TBA'}</li>
          <li><strong>Venue:</strong> ${event.venue || 'TBA'}</li>
        </ul>
        <p>${event.description || ''}</p>
        <br/>
        <p>See you there!</p>
        <p><strong>Team IGNITE</strong></p>
      </div>
    `;

    sendEmail(registration.email, `Registration Confirmed: ${event.name}`, emailHtml)
      .catch(err => console.error('Event registration email failed:', err));

    res.status(201).json({
      message: 'Registered successfully!',
      id: registration.id,
      _id: registration.id
    });
  } catch (err) {
    if (err.code === 'P2002' || err.code === 11000) {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }
    res.status(400).json({ error: err.message });
  }
});

// GET /api/events/registrations — admin: get all registrations from Prisma DB
router.get('/registrations', auth, async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations.map(formatRegistration));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/registrations/:eventId — admin: registrations for specific event from Prisma DB
router.get('/registrations/:eventId', auth, async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: req.params.eventId },
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations.map(formatRegistration));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id/qr — admin: get QR code for attendance
router.get('/:id/qr', auth, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attend?event=${event.id}`;
    const qrImage = await QRCode.toDataURL(url);
    res.json({ qr: qrImage, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/attend — public: mark attendance in Prisma DB
router.post('/attend', async (req, res) => {
  try {
    const { eventId, email } = req.body;
    if (!eventId || !email) {
      return res.status(400).json({ error: 'Event ID and email are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        email: cleanEmail
      }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found for this email.' });
    }

    if (registration.attended) {
      return res.json({
        message: 'Attendance already marked!',
        registration: formatRegistration(registration)
      });
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { attended: true }
    });

    res.json({
      message: 'Attendance marked successfully!',
      registration: formatRegistration(updated)
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/events/:id/certificate-template — admin: upload PDF template
router.post('/:id/certificate-template', auth, upload.single('template'), async (req, res) => {
  try {
    const updateData = {};
    if (req.file) {
      updateData.certificateTemplate = await uploadRawFile(
        `templates/template_${req.params.id}_${Date.now()}.pdf`,
        req.file.buffer,
        'application/pdf'
      );
    }

    if (req.body.coords) {
      updateData.certificateCoords = typeof req.body.coords === 'string'
        ? JSON.parse(req.body.coords)
        : req.body.coords;
    }

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(formatEvent(event));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/events/:id/certificate-preview — admin: preview certificate
router.get('/:id/certificate-preview', auth, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    let pdfDoc;
    if (event.certificateTemplate) {
      const templatePath = path.join(/*turbopackIgnore: true*/ process.cwd(), event.certificateTemplate.startsWith('/') ? event.certificateTemplate.slice(1) : event.certificateTemplate);
      if (fs.existsSync(/*turbopackIgnore: true*/ templatePath)) {
        const templateBytes = fs.readFileSync(/*turbopackIgnore: true*/ templatePath);
        pdfDoc = await PDFDocument.load(templateBytes);
      } else {
        pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([841.89, 595.28]);
        page.drawRectangle({
          x: 20, y: 20, width: 801.89, height: 555.28,
          borderColor: rgb(0.97, 0.45, 0.08), borderWidth: 4
        });
      }
    } else {
      pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([841.89, 595.28]);
      page.drawRectangle({
        x: 20, y: 20, width: 801.89, height: 555.28,
        borderColor: rgb(0.97, 0.45, 0.08), borderWidth: 4
      });
    }

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const fontMap = {
      'Helvetica': StandardFonts.Helvetica,
      'Helvetica-Bold': StandardFonts.HelveticaBold,
      'Times-Roman': StandardFonts.TimesRoman,
      'Times-Bold': StandardFonts.TimesRomanBold,
      'Courier': StandardFonts.Courier,
      'Courier-Bold': StandardFonts.CourierBold
    };
    const selectedFont = fontMap[event.certificateCoords?.name?.font] || StandardFonts.HelveticaBold;
    const font = await pdfDoc.embedFont(selectedFont);

    const coords = event.certificateCoords?.name || { x: 420, y: 300, size: 40, color: '#000000' };

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return rgb(r, g, b);
    };
    const color = hexToRgb(coords.color || '#000000');
    const text = 'SAMPLE STUDENT NAME';
    const width = font.widthOfTextAtSize(text, coords.size || 40);

    firstPage.drawText(text, {
      x: coords.x - width / 2,
      y: coords.y - (coords.size || 40) / 2,
      size: coords.size || 40,
      font: font,
      color: color,
    });

    const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });
    res.json({ pdf: pdfBase64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/generate-certificates — admin: email all certificates
router.post('/:id/generate-certificates', auth, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (!event.certificateTemplate) return res.status(400).json({ error: 'No template uploaded for this event.' });

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: event.id, attended: true }
    });

    if (registrations.length === 0) {
      return res.status(400).json({ error: 'No participants have marked attendance for this event yet.' });
    }

    const templatePath = path.join(/*turbopackIgnore: true*/ process.cwd(), event.certificateTemplate.slice(1));
    const templateBytes = fs.readFileSync(/*turbopackIgnore: true*/ templatePath);

    const fontMap = {
      'Helvetica': StandardFonts.Helvetica,
      'Helvetica-Bold': StandardFonts.HelveticaBold,
      'Times-Roman': StandardFonts.TimesRoman,
      'Times-Bold': StandardFonts.TimesRomanBold,
      'Courier': StandardFonts.Courier,
      'Courier-Bold': StandardFonts.CourierBold
    };
    const selectedFont = fontMap[event.certificateCoords?.name?.font] || StandardFonts.HelveticaBold;

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return rgb(r, g, b);
    };
    const coords = event.certificateCoords?.name || { x: 420, y: 300, size: 40, color: '#000000' };
    const color = hexToRgb(coords.color || '#000000');

    let count = 0;
    for (const reg of registrations) {
      const pdfDoc = await PDFDocument.load(templateBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const font = await pdfDoc.embedFont(selectedFont);

      const text = reg.name.toUpperCase();
      const width = font.widthOfTextAtSize(text, coords.size || 40);

      firstPage.drawText(text, {
        x: coords.x - width / 2,
        y: coords.y - (coords.size || 40) / 2,
        size: coords.size || 40,
        font: font,
        color: color,
      });

      const pdfBytes = await pdfDoc.save();

      await sendEmail(
        reg.email,
        `Certificate of Achievement: ${event.name}`,
        `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #f97316;">Congratulations!</h2>
            <p>Hi <strong>${reg.name}</strong>,</p>
            <p>Please find attached your digital certificate for participating in <strong>${event.name}</strong>.</p>
            <p>Keep burning bright!</p>
            <br/>
            <p>Best Regards,<br/><strong>Team IGNITE</strong></p>
        </div>
        `,
        [{
          filename: `Certificate_${reg.name.replace(/\s+/g, '_')}.pdf`,
          content: Buffer.from(pdfBytes)
        }]
      );
      count++;
    }

    res.json({ message: `Successfully generated and emailed ${count} certificates.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
