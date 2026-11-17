'use client';
import { useState } from 'react';
import { post, resize, saveItem } from '@/lib/client';
export default function Report() {
  const [loc, setLoc] = useState(null); const [msg, setMsg] = useState(null); const [busy, setBusy] = useState(false); const [code, setCode] = useState('');
  const gps = () => navigator.geolocation?.getCurrentPosition((p) => setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }), () => setMsg('gps'));
  async function go(e) {
    e.preventDefault(); setBusy(true); const fd = new FormData(e.target);
    const photo = await resize(fd.get('photo'));
    const r = await post('/api/reports', { name: fd.get('name'), contact: fd.get('contact'), species: fd.get('species'), description: fd.get('description'), address: fd.get('address'), ...loc, photo });
    setBusy(false); setMsg(r.ok ? 'ok' : 'err'); if (r.ok) { e.target.reset(); setLoc(null); setCode(r.data.code); saveItem(r.data.code, 'Report', fd.get('species'), 'new'); }
  }
  return (<div className="wrap"><h1 style={{ fontSize: '3.5rem' }}>Report an animal</h1><p className="script">every report is a second chance.</p>
    <form className="f" onSubmit={go}>
      <label>Animal<select name="species"><option value="dog">Dog</option><option value="cat">Cat</option><option value="other">Other</option></select></label>
      <label>What happened? (injured, hungry, abandoned…)<textarea name="description" rows="4" required /></label>
      <label>Where is it? Street, landmark, barangay<input name="address" required /></label>
      <button type="button" className="btn gold sm" onClick={gps}>Use my current location</button>
      {loc && <p className="ok">Location saved: <a href={`https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=17/${loc.lat}/${loc.lng}`} target="_blank">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</a></p>}
      <label>Photo<input type="file" name="photo" accept="image/*" capture="environment" /></label>
      <label>Your name (optional)<input name="name" /></label><label>Phone or email, so we can reach you<input name="contact" required /></label>
      <button className="btn" disabled={busy}>{busy ? 'Sending…' : 'Send report'}</button>
      {msg === 'ok' && <p className="ok">Report received. Your tracking code is <b>{code}</b>. The bell will tell you when the status changes.</p>}
      {msg === 'err' && <p className="err">Report not sent. Fill in the description, place and contact, then try again.</p>}
      {msg === 'gps' && <p className="err">Could not read your location. Allow location access or type the address.</p>}</form></div>);
}
