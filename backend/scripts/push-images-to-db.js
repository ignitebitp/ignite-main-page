import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
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

async function main() {
  let count = 0;

  for (const folder of TARGET_DIRS) {
    const dirPath = path.join(PUBLIC_DIR, folder);
    const files = walkFiles(dirPath);

    for (const filePath of files) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_BY_EXT[ext];
      if (!mimeType) continue;

      const key = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
      const data = fs.readFileSync(filePath);

      await prisma.mediaAsset.upsert({
        where: { key },
        update: { mimeType, data, size: data.length },
        create: { key, mimeType, data, size: data.length },
      });

      count++;
      console.log(`Synced: ${key} (${data.length} bytes)`);
    }
  }

  console.log(`\nDone. Upserted ${count} media assets into PostgreSQL.`);
}

main()
  .catch((err) => {
    console.error('Failed to push images to DB:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

