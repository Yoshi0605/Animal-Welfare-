import { makeToken } from '@/lib/auth';
const g = globalThis; const fails = g._fails || (g._fails = new Map()); const WIN = 15 * 60e3;
export async function POST(req) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim(), f = fails.get(ip) || { n: 0, t: 0 };
  if (f.n >= 5 && Date.now() - f.t < WIN) return Response.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  const { password } = await req.json();
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) { fails.set(ip, { n: (Date.now() - f.t > WIN ? 0 : f.n) + 1, t: Date.now() }); return Response.json({ error: 'Wrong password.' }, { status: 401 }); }
  fails.delete(ip);
  const r = Response.json({ ok: true });
  r.headers.set('Set-Cookie', `admin=${makeToken()}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return r;
}
