// Cloudflare Turnstile. Without env keys it uses Cloudflare's public TEST secret, which always passes.
export async function verifyCaptcha(token) {
  if (!token) return false;
  const secret = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret, response: token }) });
    return !!(await r.json()).success;
  } catch (e) { return false; }
}
