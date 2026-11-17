import { q } from '@/lib/db';
export async function POST(req) {
  const { codes } = await req.json();
  const c = (codes || []).filter((x) => /^(RP|AD|DN)-[A-Z0-9]{6}$/.test(x)).slice(0, 20);
  if (!c.length) return Response.json({ items: [] });
  const rows = await Promise.all(['reports', 'adoption_requests', 'donations'].map((t) => q(`SELECT code,status FROM ${t} WHERE code IN (?)`, [c])));
  return Response.json({ items: rows.flat() });
}
