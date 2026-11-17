'use client';
import { useState } from 'react';
import MapPicker from './MapPicker';
import { post, resize, saveItem, validContact } from '@/lib/client';
const YN = ['Not sure', 'Yes', 'No'];
export default function Report() {
  const [loc, setLoc] = useState(null), [addr, setAddr] = useState(''), [err, setErr] = useState({}), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false), [code, setCode] = useState(''), [prev, setPrev] = useState(null), [len, setLen] = useState(0), [copied, setCopied] = useState(false);
  const pick = (p) => { setLoc({ lat: p.lat, lng: p.lng }); if (p.address) setAddr(p.address); setErr((e) => ({ ...e, address: '' })); };
  const E = ({ k }) => (err[k] ? <small className="fe" role="alert">{err[k]}</small> : null);
  async function go(e) {
    e.preventDefault(); const fd = new FormData(e.target), x = {};
    if (String(fd.get('description')).trim().length < 10) x.description = 'Please describe the situation in a little more detail.';
    if (!addr.trim()) x.address = 'Drop a pin on the map or type the address.';
    if (!validContact(fd.get('contact'))) x.contact = 'Enter a valid phone number or email.';
    setErr(x); setMsg(''); if (Object.keys(x).length) { setTimeout(() => document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60); return; }
    setBusy(true); const photo = await resize(fd.get('photo'));
    const lm = String(fd.get('landmark') || '').trim();
    const r = await post('/api/reports', { name: fd.get('name'), contact: fd.get('contact'), species: fd.get('species'), urgency: fd.get('urgency'), count: fd.get('count'), injured: fd.get('injured'), still: fd.get('still'), description: fd.get('description'), address: addr.trim() + (lm ? ` (Landmark: ${lm})` : ''), ...loc, photo });
    setBusy(false);
    if (r.ok) { setCode(r.data.code); saveItem(r.data.code, 'Report', fd.get('species'), 'new'); setLoc(null); setAddr(''); setPrev(null); setLen(0); } else setMsg(r.data.error || 'Report not sent. Please try again.');
  }
  return (<div><div className="head rv"><h2>Report an animal</h2><p className="script">every report is a second chance.</p><p className="lead2">Tell us what you saw and where. It takes about two minutes, and you can follow the status afterwards with your tracking code.</p></div>
    {code ? <div className="panel wide done"><h3>Report received</h3><p>Your tracking code is</p><p className="bigcode">{code}</p><button className="btn sm ghost" onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); }}>{copied ? 'Copied' : 'Copy code'}</button>
      <h4>What happens next</h4><ol><li>Our team reviews your report, emergencies first.</li><li>We may contact you for more details.</li><li>Follow the status in the strip at the top of this page.</li></ol><button className="btn" onClick={() => { setCode(''); setCopied(false); }}>Report another animal</button></div> :
    <form className="f panel wide rv" onSubmit={go} noValidate>
      <div className="cols">
        <fieldset><legend>1. The animal</legend>
          <div className="two"><label>Type of animal *<select name="species"><option>Dog</option><option>Cat</option><option>Other</option></select></label><label>How many? *<input type="number" name="count" min="1" max="99" defaultValue="1" /></label></div>
          <div className="two"><label>How urgent is it? *<select name="urgency" defaultValue="Needs help soon"><option>Emergency</option><option>Needs help soon</option><option>Not urgent</option></select></label><label>Is it injured?<select name="injured">{YN.map((x) => <option key={x}>{x}</option>)}</select></label></div>
          <label>Is the animal still there?<select name="still">{YN.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>What happened? *<textarea name="description" rows="5" maxLength="2000" aria-invalid={!!err.description} onChange={(e) => setLen(e.target.value.length)} placeholder="Injured, hungry, abandoned. Add size, color and behavior if you can." /><E k="description" /><small className="note">{len}/2000</small></label>
          <label>Photo (recommended)<input type="file" name="photo" accept="image/*" onChange={(e) => setPrev(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null)} /></label>{prev && <img className="prev" src={prev} alt="Selected photo preview" />}</fieldset>
        <fieldset><legend>2. Where is it?</legend>
          <MapPicker onPick={pick} />
          <label>Address *<input value={addr} onChange={(e) => setAddr(e.target.value)} aria-invalid={!!err.address} placeholder="Fills in from the pin. You can edit it." /><E k="address" /></label>
          <label>Landmark or extra directions<input name="landmark" placeholder="e.g. beside the 7-Eleven, near the footbridge" /></label>
          {loc && <a className="btn ghost sm" style={{ justifySelf: 'start' }} target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}>Check the pin on Google Maps</a>}</fieldset></div>
      <fieldset><legend>3. Your contact details</legend>
        <div className="three"><label>Your name (optional)<input name="name" autoComplete="name" /></label><label>Phone or email *<input name="contact" autoComplete="tel" aria-invalid={!!err.contact} /><E k="contact" /></label>
          <label className="chk" style={{ alignSelf: 'end' }}><input type="checkbox" required />I confirm this information is accurate to the best of my knowledge. *</label></div></fieldset>
      {msg && <p className="err">{msg}</p>}
      <div className="row"><small className="note">Your contact details are used only to follow up on this report.</small><button className="btn" disabled={busy}>{busy ? 'Sending' : 'Submit report'}</button></div></form>}</div>);
}
