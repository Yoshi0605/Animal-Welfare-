export function resize(file, max = 800) {
  return new Promise((res) => {
    if (!file) return res(null);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = img.width * k; c.height = img.height * k;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => res(null);
    img.src = URL.createObjectURL(file);
  });
}
export async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { ok: r.ok, data: await r.json().catch(() => ({})) };
}
export function saveItem(code, type, label, status) {
  try {
    const a = JSON.parse(localStorage.getItem('ph_items') || '[]'); a.unshift({ code, type, label });
    const s = JSON.parse(localStorage.getItem('ph_seen') || '{}'); s[code] = status;
    localStorage.setItem('ph_items', JSON.stringify(a.slice(0, 20))); localStorage.setItem('ph_seen', JSON.stringify(s));
    window.dispatchEvent(new Event('ph_update'));
  } catch (e) {}
}
export const validContact = (v) => { v = String(v || '').trim(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[\d\s-]{7,16}$/.test(v); };
