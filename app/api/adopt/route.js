import { isHuman } from '@/lib/human';
import { q } from '@/lib/db';
import { newCode } from '@/lib/code';
export async function POST(req) {
  const b = await req.json();
  if (!isHuman()) return Response.json({ error: 'Security check expired. Please refresh the page and try again.' }, { status: 403 }); const d = b.details || {};
  if (!b.animal_id || !d.name || !d.contact || !d.reason || !d.visit || !d.care) return Response.json({ error: 'Missing fields' }, { status: 400 });
  const code = newCode('AD');
  await q('INSERT INTO adoption_requests(animal_id,name,contact,message,code) VALUES(?,?,?,?,?)', [b.animal_id, String(d.name).slice(0, 80), String(d.contact).slice(0, 120), JSON.stringify(d).slice(0, 4000), code]);
  return Response.json({ ok: true, code });
}
