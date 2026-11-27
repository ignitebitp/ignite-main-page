import express from 'express';
import prisma from '../prisma.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import { uploadImage } from '../lib/blob.js';

const router = express.Router();

// Multer Config (Memory Storage for Sharp / Blob processing)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to format gallery item with _id alias
const formatGallery = (item) => {
  if (!item) return null;
  return {
    ...item,
    _id: item.id,
  };
};

// GET /api/gallery — public: list gallery items from Prisma DB
router.get('/', async (req, res) => {
  try {
    const items = await prisma.gallery.findMany({
      orderBy: [
        { date: 'desc' },
        { order: 'asc' },
      ],
    });
    res.json(items.map(formatGallery));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/gallery — admin: add item with Blob storage
router.post('/', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 50 }]), async (req, res) => {
  try {
    const { title, coverUrl, link, category, order, date } = req.body;
    let mainImageUrl = coverUrl || null;

    // 1. Process Cover Image
    if (req.files?.image?.[0]) {
      mainImageUrl = await uploadImage(
        `gallery/cover-${Date.now()}.webp`,
        req.files.image[0].buffer,
        { width: 1200, height: 900 }
      );
    } else if (!coverUrl) {
      return res.status(400).json({ error: 'Please provide a cover image (upload or URL).' });
    }

    // 2. Process Gallery Images (Album)
    const galleryPaths = [];
    if (req.files?.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        const file = req.files.images[i];
        const uploadedUrl = await uploadImage(
          `gallery/photo-${Date.now()}-${i}.webp`,
          file.buffer,
          { width: 1600, height: 1200 }
        );
        galleryPaths.push(uploadedUrl);
      }
    }

    const item = await prisma.gallery.create({
      data: {
        title: title || 'IGNITE Gallery Event',
        image: mainImageUrl,
        images: galleryPaths,
        coverUrl: mainImageUrl,
        link: link || null,
        category: category || 'General',
        order: Number(order) || 0,
        date: date ? new Date(date) : new Date(),
      },
    });

    res.status(201).json(formatGallery(item));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/gallery/:id — admin: update item
router.put('/:id', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 50 }]), async (req, res) => {
  try {
    const { title, coverUrl, link, category, order, date } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (link !== undefined) updateData.link = link;
    if (category !== undefined) updateData.category = category;
    if (order !== undefined) updateData.order = Number(order);
    if (date !== undefined) updateData.date = new Date(date);

    if (req.files?.image?.[0]) {
      const mainImageUrl = await uploadImage(
        `gallery/cover-${Date.now()}.webp`,
        req.files.image[0].buffer,
        { width: 1200, height: 900 }
      );
      updateData.image = mainImageUrl;
      updateData.coverUrl = mainImageUrl;
    } else if (coverUrl !== undefined) {
      updateData.coverUrl = coverUrl;
      updateData.image = coverUrl;
    }

    if (req.files?.images) {
      const galleryPaths = [];
      for (let i = 0; i < req.files.images.length; i++) {
        const file = req.files.images[i];
        const uploadedUrl = await uploadImage(
          `gallery/photo-${Date.now()}-${i}.webp`,
          file.buffer,
          { width: 1600, height: 1200 }
        );
        galleryPaths.push(uploadedUrl);
      }
      updateData.images = galleryPaths;
    }

    const item = await prisma.gallery.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(formatGallery(item));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/gallery/:id — admin: delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.gallery.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Deleted from gallery' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
