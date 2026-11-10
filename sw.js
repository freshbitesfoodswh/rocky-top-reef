const MEDIA = "reef-media-v17";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== MEDIA).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isShell(url) {
  return (
    url.pathname.endsWith("/")
    || url.pathname.endsWith("/sw.js")
    || /\.(html|js|css|webmanifest|json)$/.test(url.pathname)
  );
}

function offlinePage() {
  const html = `<!DOCTYPE html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Everleigh's Rocky Top Reef</title><body style="font-family:sans-serif;background:#062844;color:#fffaf3;padding:32px"><h1>Everleigh's Rocky Top Reef</h1><p>The reef needs a connection to open the latest swim. Progress already saved on this device stays here.</p></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate" || isShell(url)) {
    event.respondWith(fetch(request, { cache: "no-store" }).catch(() => offlinePage()));
    return;
  }
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(MEDIA).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw new Error("offline");
      })
  );
});
