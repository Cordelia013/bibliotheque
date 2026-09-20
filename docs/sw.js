/* Service worker de la bibliothèque.
 *
 * Ce qu'il met en cache à l'installation : la coquille de l'application — la
 * page, son script, le manifeste, les icônes —, puis le catalogue et les
 * couvertures en image que celui-ci déclare. Rien du texte : un morceau est mis
 * en cache la première fois qu'on le lit, et l'application précharge
 * d'elle-même le reste d'un livre dont on a lu un chapitre.
 *
 * Ce fichier ne nomme aucun livre : ce qui dépend du catalogue en est lu.
 *
 * Stratégies :
 *  - réseau d'abord pour la coquille, pour qu'une nouvelle publication soit
 *    prise en compte dès le rechargement suivant, le cache servant de repli ;
 *  - cache d'abord pour les morceaux de texte, dont l'adresse porte une version
 *    tirée du contenu (data-<id>-pN.json?v=…) : une adresse donnée ne change
 *    jamais de contenu, elle peut être gardée indéfiniment ;
 *  - cache d'abord, rafraîchi en silence, pour les images.
 *
 * Quand un catalogue frais arrive, les morceaux qu'il ne cite plus — anciennes
 * versions — sont retirés du cache.
 *
 * VERSION ne change que si le code de l'application change de façon
 * incompatible avec ce que d'anciens caches pourraient servir.
 */

const VERSION = 'liseuse-v7';

const COQUILLE = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icone-192.png',
  './icone-512.png',
  './apple-touch-icon.png'
];

const RESEAU_DABORD = /\/(index\.html)?$|\/app\.js$|\/manifest\.json$|\/catalogue\.json$/;
const MORCEAU = /\/data-[a-z0-9-]+\.json$/;

/* Chaque ressource est demandée séparément : un fichier absent n'empêche pas
   l'installation des autres. Le catalogue est lu au passage pour mettre en cache
   les couvertures en image qu'il déclare. */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(async cache => {
      const ajouter = url => cache.add(url).catch(err => console.warn('Non mis en cache :', url, err));
      await Promise.all(COQUILLE.map(ajouter));
      try {
        const rep = await fetch('./catalogue.json');
        if (rep && rep.status === 200) {
          const cat = await rep.clone().json();
          await cache.put('./catalogue.json', rep);
          const couvertures = (cat.livres || []).map(l => l.couvImage).filter(Boolean);
          await Promise.all(couvertures.map(ajouter));
        }
      } catch (err) { console.warn('Catalogue non mis en cache à l\'installation :', err); }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(
        noms.filter(n => n !== VERSION).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

/* Les morceaux que le catalogue ne cite plus sont retirés du cache. */
function purgerMorceaux(catalogueTexte) {
  let gardes;
  try {
    const cat = JSON.parse(catalogueTexte);
    gardes = new Set();
    (cat.livres || []).forEach(l => (l.morceaux || []).forEach(m =>
      gardes.add(new URL(m.url, self.registration.scope).href)));
  } catch (e) { return Promise.resolve(); }
  return caches.open(VERSION).then(cache => cache.keys().then(reqs => Promise.all(
    reqs.filter(r => MORCEAU.test(new URL(r.url).pathname) && !gardes.has(r.url))
        .map(r => cache.delete(r))
  )));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // polices : réseau direct

  if (req.mode === 'navigate' || RESEAU_DABORD.test(url.pathname)) {
    e.respondWith(
      fetch(req).then(rep => {
        if (rep && rep.status === 200) {
          const copie = rep.clone();
          caches.open(VERSION).then(c => c.put(req, copie));
          if (/\/catalogue\.json$/.test(url.pathname))
            e.waitUntil(rep.clone().text().then(purgerMorceaux));
        }
        return rep;
      }).catch(() => caches.match(req).then(enCache => enCache || Promise.reject('hors ligne')))
    );
    return;
  }

  if (MORCEAU.test(url.pathname)) {
    // Versionné par son adresse : ce qui est en cache est bon pour toujours.
    e.respondWith(
      caches.match(req).then(enCache => enCache || fetch(req).then(rep => {
        if (rep && rep.status === 200) {
          const copie = rep.clone();
          caches.open(VERSION).then(c => c.put(req, copie));
        }
        return rep;
      }))
    );
    return;
  }

  // Images : cache d'abord, réseau en repli, rafraîchissement silencieux.
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
