import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'ignite_secret_jwt_key_2025';

export const ROLE_LEVEL = {
  moderator: 1,
  admin: 2,
  owner: 3,
};

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireStaff = (req, res, next) => {
  const role = req.user?.role;
  if (role && ROLE_LEVEL[role] >= ROLE_LEVEL.moderator) {
    return next();
  }
  return res.status(403).json({ error: 'Staff access required' });
};

export const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role && ROLE_LEVEL[role] >= ROLE_LEVEL.admin) {
    return next();
  }
  return res.status(403).json({ error: 'Admin or Owner clearance required' });
};

export const requireOwner = (req, res, next) => {
  if (req.user?.role === 'owner') {
    return next();
  }
  return res.status(403).json({ error: 'Owner clearance required' });
};

export default auth;
