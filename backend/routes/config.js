import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// Get config by key (Public)
router.get('/:key', async (req, res) => {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: req.params.key },
    });
    res.json(config ? config.value : null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set config
router.post('/', async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ message: 'Key and value required' });
    }

    const config = await prisma.systemConfig.upsert({
      where: { key },
      update: {
        value,
        lastUpdated: new Date(),
      },
      create: {
        key,
        value,
        lastUpdated: new Date(),
      },
    });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
