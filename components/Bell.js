'use client';
import { useEffect, useState } from 'react';
import { BellIcon } from './Paw';
const L = { new: 'Received', dispatched: 'Team on the way', rescued: 'Animal rescued', closed: 'Case closed', pending: 'Under review', approved: 'Approved', rejected: 'Not approved', confirmed: 'Payment confirmed' };
const T = { RP: 'Report', AD: 'Adoption', DN: 'Donation' };
const rd = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
export default function Bell() {
  const [items, setItems] = useState([]), [st, setSt] = useState({}), [seen, setSeen] = useState({}), [open, setOpen] = useState(false), [fresh, setFresh] = useState([]), [code, setCode] = useState('');
  const poll = async () => {
    const its = rd('ph_items', []); setItems(its); setSeen(rd('ph_seen', {})); if (!its.length) return;
    const r = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codes: its.map((i) => i.code) }) });
    const m = {}; (await r.json()).items.forEach((x) => (m[x.code] = x.status)); setSt(m);
  };
  useEffect(() => { poll(); const t = setInterval(poll, 8000); window.addEventListener('ph_update', poll); return () => { clearInterval(t); window.removeEventListener('ph_update', poll); }; }, []);
  const changed = (i) => st[i.code] && st[i.code] !== seen[i.code];
  const unread = items.filter(changed).length;
  const toggle = () => {
    if (!open) { setFresh(items.filter(changed).map((i) => i.code)); const s = { ...seen, ...st }; localStorage.setItem('ph_seen', JSON.stringify(s)); setSeen(s); }
    setOpen(!open);
  };
  const add = (e) => { e.preventDefault(); const c = code.trim().toUpperCase(); if (!/^(RP|AD|DN)-[A-Z0-9]{6}$/.test(c)) return; if (!items.find((i) => i.code === c)) { localStorage.setItem('ph_items', JSON.stringify([{ code: c, type: T[c.slice(0, 2)], label: '' }, ...items])); poll(); } setCode(''); };
  return (<div className="bellwrap"><button className="bell" onClick={toggle} aria-label={`Updates${unread ? `, ${unread} new` : ''}`}><BellIcon />{unread > 0 && <span className="dot">{unread}</span>}</button>
    {open && <div className="pop"><b>My updates</b>
      {items.length === 0 && <p>Nothing yet. After you report, adopt or donate, your tracking code appears here.</p>}
      {items.map((i) => <div key={i.code} className={'upd' + (fresh.includes(i.code) ? ' fresh' : '')}><span>{i.type}{i.label ? ` · ${i.label}` : ''}<small>{i.code}</small></span><span className={'pill ' + st[i.code]}>{L[st[i.code]] || '…'}</span></div>)}
      <form onSubmit={add}><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Add a code, e.g. RP-ABC234" /></form></div>}</div>);
}
