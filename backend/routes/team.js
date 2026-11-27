import express from 'express';
import prisma from '../prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const formatMember = (m) => {
  if (!m) return null;
  return {
    ...m,
    _id: m.id,
  };
};

// GET /api/team — public: get active members
router.get('/', async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    res.json(members.map(formatMember));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/team — admin: add member
router.post('/', auth, async (req, res) => {
  try {
    const { name, role, image, socials, order, isActive } = req.body;
    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        image: image || null,
        socials: socials || undefined,
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });
    res.status(201).json(formatMember(member));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/team/all — admin: all members
router.get('/all', auth, async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    res.json(members.map(formatMember));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/team/:id — admin: update member
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, role, image, socials, order, isActive } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (image !== undefined) updateData.image = image;
    if (socials !== undefined) updateData.socials = socials;
    if (order !== undefined) updateData.order = Number(order);
    if (isActive !== undefined) updateData.isActive = isActive;

    const member = await prisma.teamMember.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(formatMember(member));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/team/:id — admin: delete member
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.teamMember.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
