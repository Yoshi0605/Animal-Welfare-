'use client';
import { useState } from 'react';
import { post, resize, saveItem, validContact } from '@/lib/client';
import { SITE } from '@/lib/site';
const BANKS = ['BDO', 'BPI', 'Metrobank', 'Landbank', 'UnionBank', 'Security Bank', 'PNB', 'RCBC', 'China Bank', 'Other bank'];
const A = { name: process.env.NEXT_PUBLIC_ACCOUNT_NAME || 'Set in .env', bank: process.env.NEXT_PUBLIC_ACCOUNT_BANK || 'Set in .env', no: process.env.NEXT_PUBLIC_ACCOUNT_NO || 'Set in .env', gcash: process.env.NEXT_PUBLIC_GCASH_NO || 'Set in .env', maya: process.env.NEXT_PUBLIC_MAYA_NO || 'Set in .env' };
function Row({ k, v }) { const [c, setC] = useState(false); return (<div className="crow"><span><small>{k}</small><b>{v}</b></span><button type="button" className="btn sm ghost" onClick={() => { navigator.clipboard?.writeText(v); setC(true); setTimeout(() => setC(false), 1500); }}>{c ? 'Copied' : 'Copy'}</button></div>); }
export default function Donate() {
  const [amt, setAmt] = useState(500), [method, setMethod] = useState('gcash'), [bank, setBank] = useState(BANKS[0]), [msg, setMsg] = useState(null), [code, setCode] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState({});
  const E = ({ k }) => (err[k] ? <small className="fe" role="alert">{err[k]}</small> : null);
  const rows = method === 'bank' ? [['Bank', A.bank], ['Account name', A.name], ['Account number', A.no]] : [[method === 'gcash' ? 'GCash number' : 'Maya number', method === 'gcash' ? A.gcash : A.maya], ['Account name', A.name]];
  async function go(e) {
    e.preventDefault(); const fd = new FormData(e.target), x = {};
    if (!(amt >= 1)) x.amt = 'Enter an amount of at least ₱1.'; if (!validContact(fd.get('contact'))) x.contact = 'Enter a valid phone number or email.'; if (String(fd.get('reference')).trim().length < 4) x.ref = 'Enter the reference number from your payment.';
    setErr(x); setMsg(null); if (Object.keys(x).length) return;
    setBusy(true); const receipt = await resize(fd.get('receipt'), 1000);
    const r = await post('/api/donations', { amount: amt, method, bank, name: fd.get('name'), contact: fd.get('contact'), anonymous: fd.get('anonymous') === 'on', reference: fd.get('reference'), receipt }); setBusy(false);
    if (r.ok) { setMsg('ok'); setCode(r.data.code); saveItem(r.data.code, 'Donation', '₱' + amt, 'pending'); } else setMsg(r.data.error || 'Could not send. Please try again.');
  }
  return (<div><div className="head rv"><h2>Donate</h2><p className="script">every peso goes to food, vet care and shelter.</p><p className="lead2">Pick an amount, send it through GCash, Maya or bank transfer, then enter your reference number. Our team confirms every donation.</p></div>
    {msg === 'ok' ? <div className="panel wide done"><h3>Thank you</h3><p>Your tracking code is</p><p className="bigcode">{code}</p><h4>What happens next</h4><ol><li>Our team checks that your payment has arrived.</li><li>We mark your donation as confirmed.</li><li>You see the update in the strip at the top of this page.</li></ol><button className="btn" onClick={() => setMsg(null)}>Make another donation</button></div> :
    <form className="f panel wide rv" onSubmit={go} noValidate><div className="cols">
      <fieldset><legend>1. Amount and payment</legend>
        <div className="chips" style={{ margin: 0 }}>{[100, 500, 1000, 2500].map((v) => <button type="button" key={v} className={'chip' + (amt === v ? ' on' : '')} onClick={() => setAmt(v)}>₱{v}</button>)}</div>
        <label>Other amount (₱)<input type="number" min="1" value={amt} onChange={(e) => setAmt(Number(e.target.value))} aria-invalid={!!err.amt} /><E k="amt" /></label>
        <div><b style={{ fontSize: '.95rem' }}>Payment method</b><div className="chips" style={{ margin: '.4rem 0 0' }}>{[['gcash', 'GCash'], ['maya', 'Maya'], ['bank', 'Bank transfer']].map(([k, t]) => <button type="button" key={k} className={'chip' + (method === k ? ' on' : '')} onClick={() => setMethod(k)}>{t}</button>)}</div></div>
        {method === 'bank' && <label>Which bank are you sending from?<select value={bank} onChange={(e) => setBank(e.target.value)}>{BANKS.map((b) => <option key={b}>{b}</option>)}</select></label>}
        <div className="pay"><p style={{ margin: '0 0 .4rem' }}>Send <b>₱{amt || 0}</b> to:</p>{rows.map(([k, v]) => <Row key={k} k={k} v={v} />)}</div></fieldset>
      <fieldset><legend>2. Your details</legend>
        <label>Your name *<input name="name" required autoComplete="name" /></label>
        <label className="chk"><input type="checkbox" name="anonymous" />Keep my donation anonymous in any public updates.</label>
        <label>Phone or email *<input name="contact" autoComplete="email" aria-invalid={!!err.contact} /><E k="contact" /></label>
        <label>Payment reference number *<input name="reference" aria-invalid={!!err.ref} /><E k="ref" /></label>
        <label>Proof of payment (screenshot, optional)<input type="file" name="receipt" accept="image/*" /></label></fieldset></div>
      {SITE.demo && <p className="demo">Prototype notice: this website is a demonstration for a research survey. Please do not send real money yet.</p>}
      {msg && <p className="err">{msg}</p>}
      <div className="row"><small className="note">Your details are used only to confirm your donation.</small><button className="btn" disabled={busy}>{busy ? 'Sending' : 'Submit donation details'}</button></div></form>}</div>);
}
