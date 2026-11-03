// Ważne daty – działanie bez internetu: pliki aplikacji w pamięci telefonu. Dane mamy są osobno (localStorage) i nigdy nie idą do sieci.
// Nowa wersja aplikacji = zmień WERSJA; stara pamięć plików zostaje usunięta, dane zostają nietknięte.
const WERSJA = 'wazne-daty-2';
const PLIKI = ['./', './index.html', './manifest.webmanifest', './ikona-192.png', './ikona-512.png', './ikona-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(WERSJA).then(c => c.addAll(PLIKI)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== WERSJA).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
// najpierw sieć (żeby poprawki docierały), bez sieci – pamięć
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(WERSJA).then(c => c.put(e.request, k)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
