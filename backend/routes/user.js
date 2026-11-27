import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// GET /api/user/check/:email — public: check if user exists in recruitment
router.get('/check/:email', async (req, res) => {
  try {
    const user = await prisma.recruitment.findUnique({
      where: { email: req.params.email.toLowerCase().trim() },
      select: {
        name: true,
        email: true,
        phone: true,
        rollNo: true,
        branch: true,
        batch: true,
        semester: true,
      },
    });
    if (user) {
      res.json({ found: true, user });
    } else {
      res.json({ found: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/profile/:email — get aggregate profile for student
router.get('/profile/:email', async (req, res) => {
  try {
    const cleanEmail = req.params.email.toLowerCase().trim();

    const [recruitment, events, exams] = await Promise.all([
      prisma.recruitment.findUnique({
        where: { email: cleanEmail },
        select: {
          id: true,
          status: true,
          interests: true,
          branch: true,
          batch: true,
          semester: true,
          createdAt: true,
        },
      }),
      prisma.eventRegistration.findMany({
        where: { email: cleanEmail },
        include: {
          event: {
            select: {
              id: true,
              name: true,
              date: true,
              venue: true,
              type: true,
            },
          },
        },
      }),
      prisma.examSubmission.findMany({
        where: { email: cleanEmail },
        select: {
          id: true,
          score: true,
          totalQuestions: true,
          status: true,
          startedAt: true,
        },
      }),
    ]);

    res.json({
      recruitment: recruitment ? { ...recruitment, _id: recruitment.id } : null,
      events: events.map(e => ({
        ...e,
        _id: e.id,
        eventId: e.event ? { ...e.event, _id: e.event.id } : null,
      })),
      exams: exams.map(x => ({ ...x, _id: x.id })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
