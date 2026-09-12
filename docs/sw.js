/* Service worker de la bibliothèque.
 *
 * Stratégie : cache d'abord pour les ressources de l'application, avec
 * rafraîchissement en arrière-plan. Les textes des livres étant figés une fois
 * publiés, la lecture hors ligne est complète dès la première visite.
 *
 * Pour forcer la mise à jour après publication d'un chapitre, incrémenter
 * VERSION ci-dessous : l'ancien cache est alors supprimé à l'activation.
 */

const VERSION = 'liseuse-v1';

const RESSOURCES = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './data-castellano-p1.js',
  './data-castellano-p2.js',
  './data-castellano-p3.js',
  './data-castellano-p4.js',
  './data-vesper.js',
  './data-braises.js',
  './data-verre.js',
  './icone-192.png',
  './icone-512.png',
  './apple-touch-icon.png'
];

// Installation : mise en cache initiale. Chaque ressource est demandée
// séparément pour qu'un fichier absent (une icône non encore générée,
// par exemple) n'empêche pas l'installation des autres.
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(cache =>
      Promise.all(
        RESSOURCES.map(url =>
          cache.add(url).catch(err => console.warn('Non mis en cache :', url, err))
        )
      )
    ).then(() => self.skipWaiting())
  );
});

// Activation : suppression des caches des versions précédentes.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(
        noms.filter(n => n !== VERSION).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

// Interception : cache d'abord, réseau en repli, et rafraîchissement
// silencieux de l'entrée mise en cache quand le réseau répond.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // polices Google : réseau direct

  e.respondWith(
    caches.match(req).then(enCache => {
      const reseau = fetch(req).then(rep => {
        if (rep && rep.status === 200) {
          const copie = rep.clone();
          caches.open(VERSION).then(c => c.put(req, copie));
        }
        return rep;
      }).catch(() => enCache);

      return enCache || reseau;
    })
  );
});
