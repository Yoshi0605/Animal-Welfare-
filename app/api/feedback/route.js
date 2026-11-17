import { isHuman } from '@/lib/human';
import { q } from '@/lib/db';
export async function POST(req) {
  const b = await req.json();
  if (!isHuman()) return Response.json({ error: 'Security check expired. Please refresh the page and try again.' }, { status: 403 }); const r = parseInt(b.rating);
  if (!(r >= 1 && r <= 5) || !String(b.message || '').trim()) return Response.json({ error: 'Add a rating and a short comment.' }, { status: 400 });
  await q('INSERT INTO feedback(rating,role,message,contact) VALUES(?,?,?,?)', [r, String(b.role || '').slice(0, 30), String(b.message).slice(0, 2000), String(b.contact || '').slice(0, 120)]);
  return Response.json({ ok: true });
}
