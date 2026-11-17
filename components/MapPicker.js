'use client';
import { useEffect, useRef, useState } from 'react';
const short = (a, d) => { if (!a) return d || ''; const c = a.city || a.town || a.municipality || a.village || a.city_district; return [[a.house_number, a.road].filter(Boolean).join(' '), a.neighbourhood || a.suburb, c, a.state || a.region].filter(Boolean).join(', ') || d || ''; };
async function reverse(lat, lng) { try { const j = await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=en&lat=${lat}&lon=${lng}`)).json(); return short(j.address, j.display_name); } catch (e) { return ''; } }
export default function MapPicker({ onPick }) {
  const el = useRef(null), map = useRef(null), pin = useRef(null);
  const [q, setQ] = useState(''), [res, setRes] = useState([]), [note, setNote] = useState('');
  const place = async (lat, lng, zoom, addr) => {
    const L = window.L;
    if (!pin.current) { pin.current = L.marker([lat, lng], { draggable: true, icon: L.divIcon({ className: 'pinicon', html: '<span></span>', iconSize: [28, 36], iconAnchor: [14, 36] }) }).addTo(map.current); pin.current.on('dragend', () => { const p = pin.current.getLatLng(); place(p.lat, p.lng); }); } else pin.current.setLatLng([lat, lng]);
    if (zoom) map.current.setView([lat, lng], zoom);
    setNote('Finding the address…'); const address = addr || (await reverse(lat, lng));
    setNote(address ? '' : 'Could not find an address for this spot. Please type it below.'); onPick({ lat, lng, address });
  };
  useEffect(() => {
    let dead = false;
    const init = () => { if (dead || map.current || !el.current) return; const L = window.L; map.current = L.map(el.current, { scrollWheelZoom: false }).setView([14.676, 121.0437], 12); L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map.current); map.current.on('click', (e) => place(e.latlng.lat, e.latlng.lng)); };
    if (!document.getElementById('lf-css')) { const l = document.createElement('link'); l.id = 'lf-css'; l.rel = 'stylesheet'; l.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; document.head.appendChild(l); }
    if (window.L) init(); else { if (!document.getElementById('lf-js')) { const s = document.createElement('script'); s.id = 'lf-js'; s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'; document.head.appendChild(s); } var t = setInterval(() => { if (window.L) { clearInterval(t); init(); } }, 200); }
    return () => { dead = true; clearInterval(t); if (map.current) { map.current.remove(); map.current = null; pin.current = null; } };
  }, []);
  const locate = () => { if (!navigator.geolocation) return setNote('Location is not supported on this device.'); setNote('Getting your location…'); navigator.geolocation.getCurrentPosition((p) => place(p.coords.latitude, p.coords.longitude, 18), () => setNote('Location access was blocked. Search or tap the map instead.'), { enableHighAccuracy: true, timeout: 10000 }); };
  const search = async () => { if (!q.trim()) return; try { setRes(await (await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=ph&accept-language=en&q=' + encodeURIComponent(q))).json()); } catch (e) { setNote('Search is unavailable right now.'); } };
  return (<div className="mp"><div className="mpbar"><div className="mpsearch"><input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), search())} placeholder="Search a street, landmark or barangay" aria-label="Search for a place" /><button type="button" className="btn sm" onClick={search}>Search</button></div><button type="button" className="btn gold sm" onClick={locate}>Use my location</button></div>
    {res.length > 0 && <div className="mpres">{res.map((x) => <button type="button" key={x.place_id} onClick={() => { setRes([]); setQ(''); place(+x.lat, +x.lon, 17, short(x.address, x.display_name)); }}>{x.display_name}</button>)}</div>}
    <div ref={el} className="mpmap" /><small className="note">{note || 'Tap the map or drag the pin to set the exact spot. The address fills in automatically.'}</small></div>);
}
