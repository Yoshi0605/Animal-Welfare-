'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Bell from './Bell';
import Paw from './Paw';
import StatusStrip from './StatusStrip';
const L = [['home', 'Home'], ['how', 'How it works'], ['adopt', 'Adopt'], ['report', 'Report'], ['donate', 'Donate'], ['faq', 'FAQ'], ['contact', 'Contact']];
export default function Nav() {
  const p = usePathname(); const [a, setA] = useState('home'), [o, setO] = useState(false), [sc, setSc] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setA(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach((s) => io.observe(s));
    const f = () => setSc(window.scrollY > 20); f(); window.addEventListener('scroll', f);
    return () => { io.disconnect(); window.removeEventListener('scroll', f); };
  }, [p]);
  if (p.startsWith('/admin')) return null;
  return (<header className={'top' + (sc ? ' sc' : '')}><StatusStrip /><div className="wrap nav"><a className="logo" href="#home"><Paw />Pawhaven</a>
    <div className={'links' + (o ? ' open' : '')}>{L.map(([id, t]) => <a key={id} href={'#' + id} className={a === id ? 'on' : ''} onClick={() => setO(false)}>{t}</a>)}</div>
    <Bell /><button className="burger" onClick={() => setO(!o)} aria-label="Menu"><svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button></div></header>);
}
