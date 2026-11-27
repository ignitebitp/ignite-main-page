import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

/**
 * Secured media endpoint:
 * - Blocks direct tab navigation (Sec-Fetch-Dest: document / Sec-Fetch-Mode: navigate)
 * - Blocks cross-site hotlinking (Sec-Fetch-Site: cross-site or mismatched Referer/Origin)
 * - Disables browser caching and search engine image indexing
 */
router.get('/', async (req, res) => {
  try {
    const rawKey = typeof req.query.key === 'string' ? req.query.key : '';
    const key = rawKey.replace(/^\/+/, '').trim();

    if (!key || key.includes('..')) {
      return res.status(400).json({ error: 'Invalid media key' });
    }

    const fetchDest = String(req.headers['sec-fetch-dest'] || '').toLowerCase();
    const fetchMode = String(req.headers['sec-fetch-mode'] || '').toLowerCase();
    const fetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();

    if (fetchDest === 'document' || fetchMode === 'navigate') {
      return res.status(403).json({ error: 'Direct image viewing is disabled' });
    }

    if (fetchSite === 'cross-site') {
      return res.status(403).json({ error: 'Cross-site access denied' });
    }

    const host = req.headers.host;
    const referer = req.headers.referer || req.headers.origin;
    if (referer && host) {
      try {
        const refHost = new URL(referer).host;
        if (refHost !== host) {
          return res.status(403).json({ error: 'Origin mismatch' });
        }
      } catch {
        return res.status(403).json({ error: 'Invalid origin' });
      }
    }

    const asset = await prisma.mediaAsset.findUnique({
      where: { key },
      select: { mimeType: true, data: true },
    });

    if (!asset) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.setHeader('Content-Type', asset.mimeType);
    res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex, noimageindex');
    res.setHeader('Content-Disposition', 'inline');

    return res.send(Buffer.from(asset.data));
  } catch (err) {
    console.error('Media fetch error:', err);
    return res.status(500).json({ error: 'Failed to load media' });
  }
});

export default router;

