/* LOS Backstage – Service Worker
   Nur dafür da, dass Android (Chrome, Samsung Internet) die Seite als App installiert
   und ohne Adressleiste öffnet. Er speichert absichtlich NICHTS zwischen:
   jede neue Version auf GitHub ist sofort da. Daten laufen wie bisher direkt über Firebase. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;            // nur das Öffnen der Seite selbst
  e.respondWith(fetch(e.request).catch(() => new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>LOS Backstage</title><body style="font-family:system-ui;padding:32px;text-align:center">' +
    '<h1 style="font-size:22px">Keine Verbindung</h1><p>LOS Backstage braucht Internet. Bitte gleich noch einmal öffnen.</p></body>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
