import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

/**
 * Upload an image buffer to Vercel Blob (or fallback to local disk).
 * 
 * @param {string} pathname - e.g. "events/poster-123.webp"
 * @param {Buffer} buffer - image binary buffer
 * @param {object} options - optional sharp resize/format options
 * @returns {Promise<string>} - public URL or local file path
 */
export async function uploadImage(pathname, buffer, options = {}) {
  let processedBuffer = buffer;
  let contentType = 'image/webp';

  try {
    const sharpInstance = sharp(buffer);
    if (options.width || options.height) {
      sharpInstance.resize(options.width || 1200, options.height || 900, {
        fit: options.fit || 'inside',
        withoutEnlargement: true,
      });
    }
    processedBuffer = await sharpInstance.webp({ quality: options.quality || 85 }).toBuffer();
    if (!pathname.endsWith('.webp')) {
      pathname = `${pathname.replace(/\.[^/.]+$/, '')}.webp`;
    }
  } catch (err) {
    console.warn('Sharp image optimization skipped, using raw buffer:', err.message);
  }

  // 1. If Vercel Blob token is set, upload to Vercel Blob CDN
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(pathname, processedBuffer, {
        access: 'public',
        contentType,
      });
      return blob.url;
    } catch (err) {
      console.error('Vercel Blob upload error, attempting local fallback:', err);
    }
  }

  // 2. Local filesystem fallback (for offline or local dev)
  try {
    const localUploadDir = path.join(process.cwd(), 'backend', 'uploads', path.dirname(pathname));
    if (!fs.existsSync(localUploadDir)) {
      fs.mkdirSync(localUploadDir, { recursive: true });
    }
    const filename = `${Date.now()}-${path.basename(pathname)}`;
    const fullPath = path.join(localUploadDir, filename);
    fs.writeFileSync(fullPath, processedBuffer);
    return `/uploads/${path.dirname(pathname)}/${filename}`;
  } catch (err) {
    console.error('Local file write fallback error:', err);
    // If running in readonly serverless without Blob token, return base64 data URI
    return `data:${contentType};base64,${processedBuffer.toString('base64')}`;
  }
}

/**
 * Upload raw file (PDF, certificate template, doc, etc.)
 */
export async function uploadRawFile(pathname, buffer, contentType = 'application/octet-stream') {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(pathname, buffer, {
        access: 'public',
        contentType,
      });
      return blob.url;
    } catch (err) {
      console.error('Vercel Blob raw file upload error:', err);
    }
  }

  try {
    const localUploadDir = path.join(process.cwd(), 'backend', 'uploads', path.dirname(pathname));
    if (!fs.existsSync(localUploadDir)) {
      fs.mkdirSync(localUploadDir, { recursive: true });
    }
    const filename = `${Date.now()}-${path.basename(pathname)}`;
    const fullPath = path.join(localUploadDir, filename);
    fs.writeFileSync(fullPath, buffer);
    return `/uploads/${path.dirname(pathname)}/${filename}`;
  } catch (err) {
    console.error('Local raw file write fallback error:', err);
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  }
}
