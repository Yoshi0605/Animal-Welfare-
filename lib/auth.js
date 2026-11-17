import crypto from 'crypto';
import { cookies } from 'next/headers';
const sig = () => crypto.createHmac('sha256', process.env.SESSION_SECRET || 'dev').update('admin').digest('hex');
export const makeToken = () => sig();
export function isAdmin() {
  const t = cookies().get('admin')?.value || '';
  const s = sig();
  return t.length === s.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(s));
}
