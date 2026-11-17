import { isHuman } from '@/lib/human';
import { q } from '@/lib/db';
import { newCode } from '@/lib/code';
const OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^\+?[\d\s-]{7,16}$/;
export async function POST(req) {
  const b = await req.json();
  if (!isHuman()) return Response.json({ error: 'Security check expired. Please refresh the page and try again.' }, { status: 403 });
  if (!String(b.description || '').trim() || !String(b.address || '').trim() || !OK.test(String(b.contact || '').trim())) return Response.json({ error: 'Check the description, location and a valid phone or email.' }, { status: 400 });
  if (b.photo && !String(b.photo).startsWith('data:image/')) return Response.json({ error: 'Bad photo' }, { status: 400 });
  const urg = ['Emergency', 'Needs help soon', 'Not urgent'].includes(b.urgency) ? b.urgency : 'Needs help soon';
  const n = Math.min(Math.max(parseInt(b.count) || 1, 1), 99), code = newCode('RP');
  await q('INSERT INTO reports(reporter_name,contact,species,description,address,lat,lng,photo,urgency,animal_count,injured,still_there,code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [String(b.name || '').slice(0, 80), String(b.contact).trim(), String(b.species || 'dog').slice(0, 20), String(b.description).slice(0, 2000), String(b.address).slice(0, 400), b.lat || null, b.lng || null, b.photo || null, urg, n, ['Yes', 'No', 'Not sure'].includes(b.injured) ? b.injured : 'Not sure', ['Yes', 'No', 'Not sure'].includes(b.still) ? b.still : 'Not sure', code]);
  return Response.json({ ok: true, code });
}
