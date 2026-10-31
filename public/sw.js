// Service worker: makes the site installable and provides an offline fallback for page navigations.
// Strategy: network first. A successful page is saved so it can be shown offline, but never for longer
// than MAX_AGE_MS, so visitors do not see old inventory or prices.
const CACHE = 'sfm-v2';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const STAMP = 'x-sw-cached-at';

const OFFLINE = {
  en: { title: 'Offline', h1: "You're offline", p: 'Connect to the internet to see the current inventory.', call: 'Call' },
  es: { title: 'Sin conexión', h1: 'Sin conexión', p: 'Conéctese a internet para ver el inventario actual.', call: 'Llamar' },
};

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  // Remove caches from earlier versions (e.g. "sfm-v1") so they cannot keep serving old pages.
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || req.mode !== 'navigate' || url.origin !== self.location.origin) return;
  e.respondWith(networkFirst(req, url, e));
});

async function networkFirst(req, url, e) {
  try {
    const res = await fetch(req);
    if (res.ok && res.type === 'basic') e.waitUntil(saveCopy(req, res.clone()));
    return res;
  } catch {
    const cached = await caches.open(CACHE).then((c) => c.match(req));
    if (cached && isFresh(cached)) return cached;
    return offlinePage(url);
  }
}

async function saveCopy(req, res) {
  const body = await res.blob();
  const headers = new Headers(res.headers);
  headers.set(STAMP, String(Date.now()));
  const cache = await caches.open(CACHE);
  await cache.put(req, new Response(body, { status: res.status, statusText: res.statusText, headers }));
}

function isFresh(res) {
  const at = Number(res.headers.get(STAMP));
  return Number.isFinite(at) && Date.now() - at < MAX_AGE_MS;
}

function offlinePage(url) {
  const lang = url.pathname.startsWith('/es') ? 'es' : 'en';
  const t = OFFLINE[lang];
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1"><title>${t.title}</title>` +
    `<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0f1a;color:#f3f6fc;` +
    `font-family:system-ui,sans-serif;text-align:center;padding:24px}a{display:inline-block;margin-top:16px;` +
    `background:#FFCD00;color:#000;padding:12px 24px;border-radius:99px;font-weight:700;text-decoration:none}</style>` +
    `</head><body><main><h1>${t.h1}</h1><p>${t.p}</p><a href="tel:+14697206172">${t.call} (469) 720-6172</a></main></body></html>`;
  return new Response(html, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
