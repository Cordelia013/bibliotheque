/* Service worker de la bibliothèque.
 *
 * Stratégie : réseau d'abord pour la page et son script, pour qu'une nouvelle
 * publication soit prise en compte dès le rechargement suivant ; cache d'abord
 * pour les textes, figés une fois publiés. La lecture hors ligne reste complète
 * dès la première visite, le cache servant de repli quand le réseau manque.
 *
 * Pour forcer la mise à jour après publication d'un chapitre, incrémenter
 * VERSION ci-dessous : l'ancien cache est alors supprimé à l'activation.
 */

const VERSION = 'liseuse-v5';

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
  './data-braises-p1.js',
  './data-braises-p2.js',
  './data-braises-p3.js',
  './data-braises-p4.js',
  './data-braises-p5.js',
  './data-braises-p6.js',
  './data-braises-p7.js',
  './data-braises-p8.js',
  './data-braises-p9.js',
  './data-verre.js',
  './icone-192.png',
  './icone-512.png',
  './apple-touch-icon.png',
  './couvertures/braises.jpg',
  './couvertures/castellano.jpg'
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

// La page et son script passent par le réseau d'abord, le cache ne servant que
// de repli hors ligne. Sans cela, un index.html gardé en cache continue de
// réclamer des fichiers de texte qu'une nouvelle publication a pu renommer ou
// supprimer — et la bibliothèque s'affiche vide. Les textes, eux, ne changent
// plus une fois publiés : ils restent servis par le cache d'abord.
const RESEAU_DABORD = /\/(index\.html)?$|\/app\.js$|\/manifest\.json$/;

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // polices Google : réseau direct

  if (req.mode === 'navigate' || RESEAU_DABORD.test(url.pathname)) {
    e.respondWith(
      fetch(req).then(rep => {
        if (rep && rep.status === 200) {
          const copie = rep.clone();
          caches.open(VERSION).then(c => c.put(req, copie));
        }
        return rep;
      }).catch(() => caches.match(req).then(enCache => enCache || Promise.reject('hors ligne')))
    );
    return;
  }

  // Textes et images : cache d'abord, réseau en repli, rafraîchissement
  // silencieux de l'entrée mise en cache quand le réseau répond.
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
