'use client';
import { useEffect, useState } from 'react';
const L = { new: 'Received', dispatched: 'Team on the way', rescued: 'Rescued', closed: 'Closed', pending: 'Under review', approved: 'Approved', rejected: 'Not approved', confirmed: 'Confirmed' };
const M = { RP: ['', 'Report', '#report'], AD: ['', 'Adoption', '#adopt'], DN: ['', 'Donation', '#donate'] };
export default function StatusStrip() {
  const [items, setItems] = useState([]), [st, setSt] = useState({});
  const poll = async () => {
    let its = []; try { its = JSON.parse(localStorage.getItem('ph_items')) || []; } catch (e) {} setItems(its); if (!its.length) return;
    const r = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codes: its.map((i) => i.code) }) });
    const m = {}; (await r.json()).items.forEach((x) => (m[x.code] = x.status)); setSt(m);
  };
  useEffect(() => { poll(); const t = setInterval(poll, 8000); window.addEventListener('ph_update', poll); return () => { clearInterval(t); window.removeEventListener('ph_update', poll); }; }, []);
  const pick = Object.keys(M).map((k) => items.find((i) => i.code.startsWith(k))).filter(Boolean);
  if (!pick.length) return null;
  return (<div className="mystrip" role="status"><span>My requests</span>{pick.map((i) => { const [ic, n, h] = M[i.code.slice(0, 2)]; return <a key={i.code} href={h}>{ic} {n} <b>{i.code}</b><span className={'pill ' + st[i.code]}>{L[st[i.code]] || '…'}</span></a>; })}</div>);
}
