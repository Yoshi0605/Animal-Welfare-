import { q } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
const Q = (s) => q(s).catch(() => []);
const okPhoto = (v) => (v && (/^https?:\/\/\S{4,2000}$/.test(v) || String(v).startsWith('data:image/')) ? v : null);
const no = () => Response.json({ error: 'Unauthorized' }, { status: 401 });
export async function GET() {
  if (!isAdmin()) return no();
  const [reports, adoptions, animals, donations, feedback] = await Promise.all([
    Q('SELECT * FROM reports ORDER BY id DESC'),
    Q('SELECT r.*,a.name animal FROM adoption_requests r JOIN animals a ON a.id=r.animal_id ORDER BY r.id DESC'),
    Q('SELECT * FROM animals ORDER BY id DESC'),
    Q('SELECT * FROM donations ORDER BY id DESC'),
    Q('SELECT * FROM feedback ORDER BY id DESC'),
  ]);
  return Response.json({ reports, adoptions, animals, donations, feedback });
}
const cap = (s) => String(s || '').trim().toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
const oneOf = (v, l) => (l.includes(v) ? v : l[0]);
export async function POST(req) {
  if (!isAdmin()) return no();
  const b = await req.json();
  switch (b.action) {
    case 'report': await q('UPDATE reports SET status=? WHERE id=?', [oneOf(b.status, ['new', 'dispatched', 'rescued', 'closed']), b.id]); break;
    case 'adoption': {
      const s = oneOf(b.status, ['pending', 'approved', 'rejected']);
      await q('UPDATE adoption_requests SET status=? WHERE id=?', [s, b.id]);
      if (s === 'approved') await q('UPDATE animals SET status="adopted" WHERE id=(SELECT animal_id FROM adoption_requests WHERE id=?)', [b.id]);
      break; }
    case 'donation': await q('UPDATE donations SET status=? WHERE id=?', [oneOf(b.status, ['pending', 'confirmed']), b.id]); break;
    case 'animalStatus': await q('UPDATE animals SET status=? WHERE id=?', [oneOf(b.status, ['available', 'pending', 'adopted']), b.id]); break;
    case 'addAnimal': await q('INSERT INTO animals(name,species,age,sex,description,photo) VALUES(?,?,?,?,?,?)', [cap(b.name), cap(b.species) || 'Dog', String(b.age || '').slice(0, 40), oneOf(b.sex, ['Male', 'Female']), String(b.description || '').slice(0, 1000), okPhoto(b.photo)]); break;
    case 'animalPhoto': await q('UPDATE animals SET photo=? WHERE id=?', [okPhoto(b.photo), b.id]); break;
    default: return Response.json({ error: 'Unknown action' }, { status: 400 });
  }
  return Response.json({ ok: true });
}
