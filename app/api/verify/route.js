import { verifyCaptcha } from '@/lib/captcha';
import { isHuman, makeHuman } from '@/lib/human';
export const dynamic = 'force-dynamic';
export const GET = async () => Response.json({ ok: isHuman() });
export async function POST(req) {
  const { token } = await req.json();
  if (!(await verifyCaptcha(token))) return Response.json({ error: 'Failed' }, { status: 400 });
  const r = Response.json({ ok: true });
  r.headers.set('Set-Cookie', `human=${makeHuman()}; HttpOnly; Path=/; SameSite=Lax; Max-Age=43200${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return r;
}
