'use client';
import { useEffect, useRef } from 'react';
const KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
export default function Captcha({ onToken, nonce = 0 }) {
  const el = useRef(null), id = useRef(null);
  useEffect(() => {
    let dead = false;
    const draw = () => { if (dead || !el.current || !window.turnstile || id.current !== null) return; id.current = window.turnstile.render(el.current, { sitekey: KEY, callback: onToken, 'expired-callback': () => onToken(''), 'error-callback': () => onToken('') }); };
    if (window.turnstile) { draw(); return () => { dead = true; }; }
    if (!document.getElementById('cf-ts')) { const s = document.createElement('script'); s.id = 'cf-ts'; s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true; document.head.appendChild(s); }
    const t = setInterval(() => { if (window.turnstile) { clearInterval(t); draw(); } }, 200);
    return () => { dead = true; clearInterval(t); };
  }, []);
  useEffect(() => { if (nonce && id.current !== null && window.turnstile) { window.turnstile.reset(id.current); onToken(''); } }, [nonce]);
  return <div ref={el} className="captcha" />;
}
