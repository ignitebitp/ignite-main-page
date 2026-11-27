import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// In-memory cache & prefix batch-loading to minimize Postgres connections
const mediaCache = new Map();
const prefixInFlight = new Map();
const MAX_CACHE_ENTRIES = 120;

const queryWithRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const msg = String(err?.message || '');
      if (
        i < retries - 1 &&
        (msg.includes('too many connections') ||
          msg.includes('Timed out fetching') ||
          msg.includes("Can't reach database server"))
      ) {
        await new Promise((r) => setTimeout(r, 300 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
};

const fetchAsset = async (key) => {
  if (mediaCache.has(key)) {
    return mediaCache.get(key);
  }

  // Batch-load all assets in the same folder (e.g. "team/" or "alumni/2k23/") in 1 query
  const slashIdx = key.lastIndexOf('/');
  const prefix = slashIdx !== -1 ? key.slice(0, slashIdx + 1) : key;

  if (!prefixInFlight.has(prefix)) {
    const batchPromise = queryWithRetry(async () => {
      const assets = await prisma.mediaAsset.findMany({
        where: { key: { startsWith: prefix } },
        select: { key: true, mimeType: true, data: true },
      });
      for (const asset of assets) {
        if (mediaCache.size >= MAX_CACHE_ENTRIES) {
          const oldestKey = mediaCache.keys().next().value;
          mediaCache.delete(oldestKey);
        }
        mediaCache.set(asset.key, {
          mimeType: asset.mimeType,
          buffer: Buffer.from(asset.data),
        });
      }
    }).finally(() => {
      prefixInFlight.delete(prefix);
    });

    prefixInFlight.set(prefix, batchPromise);
  }

  await prefixInFlight.get(prefix);
  return mediaCache.get(key) || null;
};

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

    const rawHosts = [req.headers.host, req.headers['x-forwarded-host']]
      .filter(Boolean)
      .flatMap((h) => String(h).split(',').map((s) => s.trim().toLowerCase()))
      .filter(Boolean);
    const referer = req.headers.referer || req.headers.origin;
    if (referer && rawHosts.length > 0) {
      try {
        const refHost = new URL(referer).host.toLowerCase();
        if (!rawHosts.includes(refHost)) {
          return res.status(403).json({ error: 'Origin mismatch' });
        }
      } catch {
        return res.status(403).json({ error: 'Invalid origin' });
      }
    }

    const asset = await fetchAsset(key);

    if (!asset) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.setHeader('Content-Type', asset.mimeType);
    res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex, noimageindex');
    res.setHeader('Content-Disposition', 'inline');

    return res.send(asset.buffer);
  } catch (err) {
    console.error('Media fetch error:', err);
    return res.status(500).json({ error: 'Failed to load media' });
  }
});

export default router;
