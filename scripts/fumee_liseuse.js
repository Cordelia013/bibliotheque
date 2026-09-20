/* Test de fumée de la liseuse.
 *
 * Joue, dans un vrai navigateur, ce qu'un lecteur fait : la bibliothèque, une
 * page de garde, la lecture d'un chapitre, les coupures de scène, un chapitre à
 * suffixe, une position enregistrée hors du livre, puis le service worker et la
 * lecture hors ligne — serveur coupé pour de bon, parce que l'émulation
 * « hors ligne » du navigateur n'atteint pas les requêtes du service worker.
 * Il vérifie aussi ce que la page télécharge : aucun texte avant de lire.
 *
 * Usage :
 *     npm install playwright            (une fois, hors du dépôt si l'on préfère)
 *     node scripts/fumee_liseuse.js docs
 *
 * Si le navigateur de Playwright n'est pas installé, désigner un Chromium :
 *     PLAYWRIGHT_CHROMIUM=/chemin/vers/chrome node scripts/fumee_liseuse.js docs
 *
 * Le test lit les textes publiés dans docs/ ; il suppose la présence de
 * « vesper », « braises » et « verre » dans le catalogue, et le chapitre 4 des
 * Braises à sept coupures de scène. À adapter si le catalogue change.
 */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const DOCS = path.resolve(process.argv[2] || 'docs');
const PORT = 8800 + (process.pid % 150), BASE = `http://127.0.0.1:${PORT}/`;

(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', DOCS], { stdio: 'ignore' });
  process.on('exit', () => { try { srv.kill(); } catch (e) {} });
  await new Promise(r => setTimeout(r, 800));
  if (srv.exitCode !== null) throw new Error('serveur local non démarré (port ' + PORT + ')');
  const lancement = process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {};
  const browser = await chromium.launch(lancement);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const requetes = [], erreurs = [];
  page.on('request', r => requetes.push(r.url().replace(BASE, '')));
  page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
  page.on('pageerror', e => erreurs.push('pageerror: ' + e.message));
  const donnees = () => requetes.filter(u => /^data-/.test(u));
  const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  ÉCHEC ') + msg); if (!cond) process.exitCode = 1; };

  // 0. état ancien avec une position hors du livre (constat n° 2 de la revue)
  await page.goto(BASE);
  await page.evaluate(() => localStorage.setItem('liseuse:v2', JSON.stringify({
    theme: 'clair', taille: 2, inter: 2, align: 'gauche', visite: 1, dernier: { id: 'braises', date: 1 },
    livres: { braises: { chap: 999, scroll: 0, bookmarks: [], vus: [0, 1, 2] } } })));
  requetes.length = 0;

  // 1. bibliothèque
  await page.goto(BASE);
  await page.waitForFunction(() => document.querySelectorAll('.card').length === 5, null, { timeout: 8000 });
  ok(await page.textContent('#libCount') === '5 livres', 'bibliothèque : 5 livres affichés');
  ok(donnees().length === 0, 'bibliothèque : aucun morceau de texte téléchargé (' + requetes.filter(u => /catalogue/.test(u)).length + ' catalogue)');
  ok(await page.isVisible('#reprise'), 'reprise proposée sans planter malgré chap=999');
  const rep = await page.textContent('#reprise');
  ok(/Chapitre 50 sur 52/.test(rep), 'position hors livre ramenée au dernier chapitre : ' + rep.replace(/\s+/g, ' ').slice(0, 60));

  // 2. page de garde d'un livre jamais ouvert
  await page.click('.card[data-b="vesper"]');
  await page.waitForSelector('#vCover.on');
  ok((await page.textContent('#gTitle')).includes('Le Contrat de Vesper'), 'page de garde : titre');
  ok(/10 chapitres · /.test(await page.textContent('#gLab')), 'page de garde : temps de lecture sans le texte — ' + (await page.textContent('#gLab')));
  ok(donnees().length === 0, 'page de garde : toujours aucun morceau téléchargé');

  // 3. lecture du premier chapitre
  await page.click('#readBtn');
  await page.waitForFunction(() => document.querySelectorAll('#chapBody p[data-i]').length > 3, null, { timeout: 8000 });
  const premier = await page.textContent('#chapBody p[data-i="0"]');
  ok(premier.length > 20, 'lecture : texte affiché — « ' + premier.slice(0, 50) + '… »');
  const auRendu = donnees().length;
  ok(auRendu === 1 && /data-vesper-p1\.json\?v=[0-9a-f]{8}/.test(donnees()[0]), 'lecture : un seul morceau demandé au rendu, versionné : ' + donnees()[0]);
  await page.waitForTimeout(1500);
  ok(donnees().length === 1, 'chapitre seulement ouvert : le reste du livre n\'est pas téléchargé (' + donnees().length + ')');
  await page.evaluate(() => { window.scrollTo(0, document.documentElement.scrollHeight); dispatchEvent(new Event('scroll')); });
  await page.waitForFunction(() => performance.getEntriesByType('resource').filter(r => /data-vesper-p2/.test(r.name)).length > 0, null, { timeout: 8000 });
  ok(donnees().length === 2, 'chapitre lu en entier : le reste du livre est préchargé (' + donnees().length + ' morceaux)');

  // 4. coupures de scène : Braises ch. 4 en porte 7
  await page.goto(BASE + '#/lire/braises/4');
  await page.waitForFunction(() => document.querySelectorAll('#chapBody .scene').length > 0, null, { timeout: 8000 });
  ok((await page.$$('#chapBody .scene')).length === 7, 'coupures de scène rendues depuis le morceau (7 attendues)');
  ok(/Ch\. 4 · Les hachures/.test(await page.textContent('#barTitle')), 'titre de barre');

  // 4 bis. frontière de morceau : ch. 7 (p2) → Précédent → ch. 6 (p1, jamais chargé) → Suivant ×2 → ch. 8
  await page.goto(BASE + '#/lire/braises/7');
  await page.waitForFunction(() => /Chapitre 7\b/.test(document.querySelector('#chapNum').textContent) && document.querySelectorAll('#chapBody p[data-i]').length > 3, null, { timeout: 8000 });
  const avantPrec = erreurs.length;
  await page.click('#prevBtn');
  await page.waitForFunction(() => /Chapitre 6\b/.test(document.querySelector('#chapNum').textContent) && /^Le clerc/.test(document.querySelector('#chapBody p[data-i="0"]').textContent), null, { timeout: 8000 });
  ok(true, 'Précédent à travers une frontière de morceau : le chapitre 6 est chargé puis rendu');
  await page.click('#nextBtn'); await page.waitForFunction(() => /Chapitre 7\b/.test(document.querySelector('#chapNum').textContent));
  await page.click('#nextBtn');
  await page.waitForFunction(() => /Chapitre 8\b/.test(document.querySelector('#chapNum').textContent) && document.querySelectorAll('#chapBody p[data-i]').length > 3, null, { timeout: 8000 });
  ok(erreurs.length === avantPrec, 'Suivant ×2 : chapitre 8 rendu, aucune erreur de page');

  // 5. chapitre à suffixe
  await page.goto(BASE + '#/lire/braises/40');
  await page.waitForFunction(() => /39 bis/.test(document.querySelector('#chapNum').textContent), null, { timeout: 8000 });
  ok((await page.textContent('#chapTitle')) === 'Ce qu\'il reste à faire', 'chapitre 39 bis à l\'adresse 40');

  // 6. service worker et hors ligne
  await page.goto(BASE);
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 8000 }).catch(() => {});
  await page.reload(); await page.waitForFunction(() => document.querySelectorAll('.card').length === 5);
  const cles = await page.evaluate(() => caches.keys());
  ok(cles.includes('liseuse-v7') && cles.length === 1, 'service worker : cache liseuse-v7 seul (' + cles.join(', ') + ')');
  const enCache = await page.evaluate(async () => (await (await caches.open('liseuse-v7')).keys()).map(r => new URL(r.url).pathname + new URL(r.url).search));
  ok(enCache.some(u => /catalogue\.json/.test(u)) && enCache.some(u => /couvertures\/braises\.svg/.test(u)) && !enCache.some(u => /data-verre/.test(u)),
     'précache : catalogue et couverture déclarée oui, livre jamais lu non (' + enCache.filter(u => /data-/.test(u)).length + ' morceaux en cache)');
  await page.goto(BASE + '#/lire/vesper/1');
  await page.waitForFunction(() => document.querySelectorAll('#chapBody p[data-i]').length > 3);
  await page.waitForTimeout(1500);
  srv.kill(); await new Promise(r => setTimeout(r, 500));   // hors ligne réel : le service worker aussi
  ok(await fetch(BASE + 'catalogue.json').then(() => false).catch(() => true), 'serveur arrêté : la suite se joue réellement hors ligne');
  const avantHL = erreurs.length;
  await page.goto(BASE);
  await page.waitForFunction(() => document.querySelectorAll('.card').length === 5, null, { timeout: 8000 });
  ok(true, 'hors ligne : bibliothèque servie par le cache');
  await page.goto(BASE + '#/lire/vesper/2');
  await page.waitForFunction(() => document.querySelectorAll('#chapBody p[data-i]').length > 3, null, { timeout: 8000 });
  ok(true, 'hors ligne : chapitre d\'un livre déjà lu servi par le cache');
  await page.goto(BASE + '#/lire/verre/1');
  try {
    await page.waitForFunction(() => /n'a pas pu être chargé/.test(document.querySelector('#chapBody').textContent), null, { timeout: 8000 });
  } catch (e) {
    console.log('  corps du chapitre au moment du délai : ' + JSON.stringify((await page.textContent('#chapBody')).slice(0, 120)));
    throw e;
  }
  ok(await page.isVisible('#chapBody button'), 'hors ligne : livre jamais lu → message et bouton Réessayer, pas d\'écran mort');
  const bruit = /ERR_INTERNET_DISCONNECTED|ERR_CERT_AUTHORITY_INVALID|ERR_NAME_NOT_RESOLVED|ERR_FAILED|fonts\.g/;
  const errHL = erreurs.slice(avantHL).filter(e => !bruit.test(e));


  const errEnLigne = erreurs.slice(0, avantHL).filter(e => !bruit.test(e));
  ok(errEnLigne.length === 0 && errHL.length === 0, 'aucune erreur de console ni de page' + (errEnLigne.concat(errHL).length ? ' — ' + errEnLigne.concat(errHL).join(' | ') : ''));
  await browser.close();
})().catch(e => { console.error('ÉCHEC du test :', e.message); process.exit(1); });
