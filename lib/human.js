import crypto from 'crypto';
import { cookies } from 'next/headers';
const sign = (t) => crypto.createHmac('sha256', process.env.SESSION_SECRET || 'dev').update('human.' + t).digest('hex');
export const makeHuman = () => { const t = Date.now(); return t + '.' + sign(t); };
export function isHuman() {
  const [t, s] = (cookies().get('human')?.value || '').split('.');
  if (!t || !s || Date.now() - Number(t) > 12 * 3600e3) return false;
  const e = sign(t); return s.length === e.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(e));
}
