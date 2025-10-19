import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export interface AdminTokenPayload {
  admin: boolean;
  iat: number;
  exp: number;
}

export function generateAdminToken(): string {
  return jwt.sign(
    { admin: true },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}