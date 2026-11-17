import { isHuman } from '@/lib/human';
import { q } from '@/lib/db';
import { newCode } from '@/lib/code';
const OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^\+?[\d\s-]{7,16}$/;
const M = { gcash: 'GCash', maya: 'Maya', bank: 'Bank transfer' };
export async function POST(req) {
  const b = await req.json();
  if (!isHuman()) return Response.json({ error: 'Security check expired. Please refresh the page and try again.' }, { status: 403 }); const amt = Number(b.amount);
  const bad = (e) => Response.json({ error: e }, { status: 400 });
  if (!(amt >= 1 && amt <= 1000000)) return bad('Enter an amount between 1 and 1,000,000.');
  if (!String(b.name || '').trim()) return bad('Enter your name.');
  if (!OK.test(String(b.contact || '').trim())) return bad('Enter a valid phone or email.');
  if (!M[b.method]) return bad('Choose a payment method.');
  if (b.method === 'bank' && !String(b.bank || '').trim()) return bad('Choose your bank.');
  if (String(b.reference || '').trim().length < 4) return bad('Enter the payment reference number.');
  if (b.receipt && !String(b.receipt).startsWith('data:image/')) return bad('Receipt must be an image.');
  const code = newCode('DN');
  // Prototype: admin confirms once money is received. TODO: PayMongo/Xendit checkout + webhook.
  await q('INSERT INTO donations(donor_name,contact,amount,method,bank,anonymous,receipt,reference,code) VALUES(?,?,?,?,?,?,?,?,?)',
    [String(b.name).trim().slice(0, 80), String(b.contact).trim(), amt, M[b.method], b.method === 'bank' ? String(b.bank).slice(0, 40) : null, b.anonymous ? 1 : 0, b.receipt || null, String(b.reference).trim().slice(0, 80), code]);
  return Response.json({ ok: true, code });
}
