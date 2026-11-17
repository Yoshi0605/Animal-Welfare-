'use client';
import { useEffect, useState } from 'react';
import { post, saveItem, validContact } from '@/lib/client';
const F0 = { name: '', contact: '', age: '', city: '', job: '', housing: 'House', owns: 'Own', people: '', yard: 'No', pets: '', exp: 'First-time owner', alone: 'Less than 4 hours', visitTime: 'Anytime', reason: '', visit: false, care: false };
const REQ = [['name', 'contact', 'age', 'city'], ['people'], ['reason', 'visit', 'care'], []];
const bg = (p) => ({ backgroundImage: `url("${p}")` });
function Apply({ a, onClose }) {
  const [s, setS] = useState(0), [f, setF] = useState(F0), [busy, setBusy] = useState(false), [err, setErr] = useState(''), [code, setCode] = useState('');
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); document.body.style.overflow = 'hidden'; return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; }; }, []);
  const u = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const Sel = ({ k, o, t }) => <label>{t}<select value={f[k]} onChange={u(k)}>{o.map((x) => <option key={x}>{x}</option>)}</select></label>;
  const next = () => { if (REQ[s].some((k) => !f[k])) return setErr('Please complete every field marked *.'); if (s === 0 && (!validContact(f.contact) || Number(f.age) < 18)) return setErr('Enter a valid phone or email. Adopters must be 18 or older.'); setErr(''); setS(s + 1); };
  async function send() {
    setBusy(true); const r = await post('/api/adopt', { animal_id: a.id, name: f.name, contact: f.contact, details: f }); setBusy(false);
    if (r.ok) { setCode(r.data.code); saveItem(r.data.code, 'Adoption', a.name, 'pending'); } else setErr(r.data.error || 'Could not send. Check your details and try again.');
  }
  const T = ['About you', 'Your home', 'Commitment', 'Review'];
  return (<div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}><div className="sheet wide" role="dialog" aria-label={`Adopt ${a.name}`}>
    <button className="x" onClick={onClose} aria-label="Close">×</button>
    <header>
      <div className="av" style={a.photo ? { ...bg(a.photo), backgroundSize: 'cover' } : null}>{!a.photo && a.name[0]}
      </div>
      <div><h3 style={{ margin: 0 }}>Adopt {a.name}</h3><small>{a.species} · {a.age} · {a.sex}</small>
      </div>
    </header>
    {code ? <div className="ok"><h3>Application sent</h3><p>Your tracking code is <b>{code}</b>. We will review your application and contact you. Follow it in the strip at the top of the page.</p><button className="btn" onClick={onClose}>Done</button></div> : <>
      <div className="prog">{T.map((t, i) => <i key={t} className={i <= s ? 'on' : ''} />)}</div><p className="note" style={{ margin: '0 0 .8rem' }}>Step {s + 1} of 4: {T[s]}</p>
      <form className="f" onSubmit={(e) => e.preventDefault()}>
        {s === 0 && <><div className="two"><label>Full name *<input value={f.name} onChange={u('name')} autoComplete="name" /></label><label>Age *<input type="number" min="18" value={f.age} onChange={u('age')} /></label></div><div className="two"><label>Phone or email *<input value={f.contact} onChange={u('contact')} /></label><label>City or barangay *<input value={f.city} onChange={u('city')} /></label></div><label>Occupation<input value={f.job} onChange={u('job')} /></label></>}
        {s === 1 && <><div className="two"><Sel k="housing" t="Home type" o={['House', 'Apartment', 'Condo', 'Other']} /><Sel k="owns" t="Do you own or rent?" o={['Own', 'Rent']} /></div><div className="two"><label>People in household *<input type="number" min="1" value={f.people} onChange={u('people')} /></label><Sel k="yard" t="Secure yard or space?" o={['Yes', 'No']} /></div><label>Other pets at home<input value={f.pets} onChange={u('pets')} placeholder="e.g. 1 dog, or none" /></label><div className="two"><Sel k="exp" t="Pet experience" o={['First-time owner', 'Some experience', 'Very experienced']} /><Sel k="alone" t="Hours the pet is alone" o={['Less than 4 hours', '4 to 8 hours', 'More than 8 hours']} /></div></>}
        {s === 2 && <><label>Why do you want to adopt {a.name}? *<textarea rows="4" value={f.reason} onChange={u('reason')} /></label><Sel k="visitTime" t="Best time for a home visit or call" o={['Anytime', 'Weekdays', 'Weekends']} /><label className="chk"><input type="checkbox" checked={f.visit} onChange={u('visit')} />I agree to a home visit or video check by the shelter. *</label><label className="chk"><input type="checkbox" checked={f.care} onChange={u('care')} />I will provide food, vaccinations and vet care for life. *</label></>}
        {s === 3 && <><dl className="rev">{[['Name', f.name], ['Contact', f.contact], ['Age', f.age], ['City', f.city], ['Home', `${f.housing} (${f.owns})`], ['Household', f.people], ['Secure yard', f.yard], ['Other pets', f.pets || 'None'], ['Experience', f.exp], ['Hours alone', f.alone], ['Home visit', f.visitTime]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p><b>Reason:</b> {f.reason}</p></>}
        {err && <p className="err">{err}</p>}
        <div className="row">{s > 0 ? <button type="button" className="btn ghost" onClick={() => { setErr(''); setS(s - 1); }}>Back</button> : <span />}{s < 3 ? <button type="button" className="btn" onClick={next}>Next</button> : <button type="button" className="btn gold" disabled={busy} onClick={send}>Submit application</button>}</div>
      </form></>}
  </div></div>);
}
export default function Animals({ animals }) {
  const [t, setT] = useState('all'), [g, setG] = useState('all'), [q, setQ] = useState(''), [sort, setSort] = useState('new'), [sel, setSel] = useState(null);
  const types = [...new Set(animals.map((a) => a.species))];
  let list = animals.filter((a) => (t === 'all' || a.species === t) && (g === 'all' || a.sex === g) && a.name.toLowerCase().includes(q.toLowerCase()));
  if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return (<><div className="tool"><input type="search" placeholder="Search by name" aria-label="Search animals" value={q} onChange={(e) => setQ(e.target.value)} />
    <div className="chips" style={{ margin: 0 }}>{['all', ...types].map((s) => <button key={s} className={'chip' + (t === s ? ' on' : '')} onClick={() => setT(s)}>{s === 'all' ? 'All' : s}</button>)}</div>
    <select value={g} onChange={(e) => setG(e.target.value)} aria-label="Gender"><option value="all">Any gender</option><option>Male</option><option>Female</option></select>
    <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="new">Newest first</option><option value="name">Name A to Z</option></select></div>
    <p className="note" style={{ margin: '0 0 1rem' }}>{list.length} {list.length === 1 ? 'animal' : 'animals'} available</p>
    {list.length === 0 && <div className="empty"><h3>No animals match your search</h3><p>Try clearing the filters, check back soon, or <a href="#report">report an animal in need</a>.</p></div>}

    <div className="grid">{list.map((a) => (<article className="card rv" key={a.id}>
      <div
        className="ph" style={a.photo ? bg(a.photo) : null}>
        {!a.photo && 'No photo yet'}
      </div>
      <h3>
        {a.name}
      </h3>
      <span className="tag">{a.species} · {a.age} · {a.sex}
      </span> <p>{a.description}</p>
      <button className="btn sm" style={{ margin: '0 .5rem' }} onClick={() => setSel(a)}>Apply to adopt</button>
    </article>))}</div>
    {sel && <Apply a={sel} onClose={() => setSel(null)} />}</>);
}
