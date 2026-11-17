'use client';
import { useState } from 'react';
import { post } from '@/lib/client';
export default function FeedbackForm() {
  const [r, setR] = useState(0), [msg, setMsg] = useState(null), [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); if (!r) return setMsg('Please choose a rating from 1 to 5.');
    setBusy(true); const f = Object.fromEntries(new FormData(e.target));
    const x = await post('/api/feedback', { ...f, rating: r }); setBusy(false);
    if (x.ok) { setMsg('ok'); setR(0); e.target.reset(); } else setMsg(x.data.error || 'Could not send.');
  }
  return (<form className="f panel rv" onSubmit={go}>
    <h3>Share your feedback</h3>
    <div><b style={{ fontSize: '.95rem' }}>How was your experience? *</b><div className="chips" style={{ marginBottom: 0 }}>{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} className={'chip' + (r === n ? ' on' : '')} onClick={() => setR(n)} aria-label={`${n} out of 5`}>{n}</button>)}</div><small className="note">1 = poor, 5 = excellent</small></div>
    <label>I am a<select name="role"><option>Visitor</option><option>Adopter</option><option>Donor</option><option>Volunteer</option><option>Rescuer or reporter</option></select></label>
    <label>Your comments or suggestions *<textarea name="message" rows="4" required /></label>
    <label>Email or phone (optional)<input name="contact" /></label>
    <button className="btn" disabled={busy}>{busy ? 'Sending' : 'Send feedback'}</button>
    {msg === 'ok' && <p className="ok">Thank you. Your feedback helps shape this project.</p>}{msg && msg !== 'ok' && <p className="err">{msg}</p>}</form>);
}
