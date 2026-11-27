import express from 'express';
import multer from 'multer';
import { uploadImage, uploadRawFile } from '../lib/blob.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// POST /api/upload — upload single image or file to Vercel Blob
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const originalName = req.file.originalname || 'upload';
    const isImage = req.file.mimetype.startsWith('image/');
    const folder = req.body.folder || 'uploads';
    const filename = `${folder}/${Date.now()}-${originalName}`;

    let url;
    if (isImage) {
      url = await uploadImage(filename, req.file.buffer, {
        width: req.body.width ? Number(req.body.width) : undefined,
        height: req.body.height ? Number(req.body.height) : undefined,
      });
    } else {
      url = await uploadRawFile(filename, req.file.buffer, req.file.mimetype);
    }

    res.json({
      url,
      filename: originalName,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    console.error('Upload endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
