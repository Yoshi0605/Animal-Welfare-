import { q } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const m = async (t) => +(await q(`SELECT COALESCE(MAX(id),0) m FROM ${t}`))[0].m;
  const [r, a, d] = await Promise.all([m('reports'), m('adoption_requests'), m('donations')]);
  return Response.json({ r, a, d });
}
