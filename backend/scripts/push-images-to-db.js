import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import prisma from '../prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(repoRoot, '.env') });

const PUBLIC_DIR = path.join(repoRoot, 'frontend', 'public');
const TARGET_DIRS = ['team', 'alumni'];

const MIME_BY_EXT = {
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(full));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

async function optimizeForDb(key, rawBuffer, ext) {
  if (ext === '.svg') {
    return { mimeType: 'image/svg+xml', data: rawBuffer };
  }

  const isAlumni = key.startsWith('alumni/');
  const maxWidth = isAlumni ? 360 : 600;
  const maxHeight = isAlumni ? 360 : 800;

  try {
    const data = await sharp(rawBuffer)
      .rotate()
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toBuffer();

    return { mimeType: 'image/webp', data };
  } catch (err) {
    console.warn(`Sharp optimization skipped for ${key}:`, err.message);
    return { mimeType: MIME_BY_EXT[ext], data: rawBuffer };
  }
}

async function main() {
  let count = 0;
  let totalBytes = 0;

  for (const folder of TARGET_DIRS) {
    const dirPath = path.join(PUBLIC_DIR, folder);
    const files = walkFiles(dirPath);

    for (const filePath of files) {
      const ext = path.extname(filePath).toLowerCase();
      if (!MIME_BY_EXT[ext]) continue;

      const key = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      const raw = fs.readFileSync(filePath);
      const { mimeType, data } = await optimizeForDb(key, raw, ext);

      await prisma.mediaAsset.upsert({
        where: { key },
        update: { mimeType, data, size: data.length },
        create: { key, mimeType, data, size: data.length },
      });

      count++;
      totalBytes += data.length;
      console.log(`Synced: ${key} (${raw.length} -> ${data.length} bytes)`);
    }
  }

  console.log(`\nDone. Upserted ${count} optimized media assets (${(totalBytes / 1024).toFixed(1)} KB total).`);
}

main()
  .catch((err) => {
    console.error('Failed to push images to DB:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
