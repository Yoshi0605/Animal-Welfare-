'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Captcha from './Captcha';
import Paw from './Paw';
export default function Gate() {
  const p = usePathname(), [ok, setOk] = useState(true), [err, setErr] = useState('');
  useEffect(() => { fetch('/api/verify').then((r) => r.json()).then((j) => setOk(!!j.ok)).catch(() => setOk(true)); }, []);
  const hide = ok || p.startsWith('/admin');
  useEffect(() => { document.body.style.overflow = hide ? '' : 'hidden'; }, [hide]);
  if (hide) return null;
  const done = async (t) => { if (!t) return; const r = await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: t }) }); if (r.ok) setOk(true); else setErr('Verification failed. Please refresh and try again.'); };
  return (<div className="gate" role="dialog" aria-modal="true" aria-label="Security check"><div className="sheet gatebox"><Paw s={42} /><h2>Welcome to Pawhaven</h2><p>Please complete this quick security check once. It keeps our rescue reports and donation forms free of spam.</p><Captcha onToken={done} />{err && <p className="err">{err}</p>}</div></div>);
}
