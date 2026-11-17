'use client';
import { useState } from 'react';
import { post, saveItem } from '@/lib/client';
export default function Donate() {
  const [amt, setAmt] = useState(500); const [msg, setMsg] = useState(null); const [code, setCode] = useState('');
  async function go(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    const r = await post('/api/donations', { ...f, amount: amt }); setMsg(r.ok ? 'ok' : 'err'); if (r.ok) { setCode(r.data.code); saveItem(r.data.code, 'Donation', '₱' + amt, 'pending'); }
  }
  return (<div className="wrap"><h1 style={{ fontSize: '3.5rem' }}>Donate</h1><p className="script">every peso goes to food, vet care and shelter.</p>
    <form className="f" onSubmit={go}>
      <div className="chips">{[100, 500, 1000, 2500].map((v) => <button type="button" key={v} className={'chip' + (amt === v ? ' on' : '')} onClick={() => setAmt(v)}>₱{v}</button>)}</div>
      <label>Other amount (₱)<input type="number" min="1" value={amt} onChange={(e) => setAmt(e.target.value)} /></label>
      <label>Your name<input name="name" required /></label><label>Email or phone<input name="contact" /></label>
      <label>Payment method<select name="method"><option value="gcash">GCash</option><option value="maya">Maya</option><option value="bank">Bank transfer</option></select></label>
      <label>Payment reference number<input name="reference" /></label>
      <button className="btn">Record my donation</button>
      {msg === 'ok' && <p className="ok">Thank you! Tracking code <b>{code}</b>. The bell will show when we confirm your payment.</p>}{msg === 'err' && <p className="err">Enter your name and an amount of at least ₱1.</p>}</form></div>);
}
