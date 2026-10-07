// Service worker : l'appli s'ouvre hors ligne. Incrémenter V pour forcer une mise à jour du cache.
const V='suivi-v3',FICHIERS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(FICHIERS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const cle=new Request(u.origin+u.pathname); // ignore ?e=… pour le cache
  e.respondWith(caches.open(V).then(async c=>{
    const m=await c.match(cle);
    const r=fetch(e.request).then(x=>{if(x.ok)c.put(cle,x.clone());return x}).catch(()=>m);
    return m||r;
  }));
});
