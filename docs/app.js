const BOOKS = [
{
"id": "castellano",
"titre": "Le Prix du Silence, Don Castellano",
"auteur": "Écrit avec Claude",
"genres": [
"Romance mafieuse",
"Vengeance",
"Drame",
"Suspense"
],
"annee": "2026",
"couleur": "#6d1f2c",
"statut": "Terminé",
"resume": "Livia Sarti est la consigliere de la famille Castellano et, depuis trois ans, l'épouse secrète de son Don. Une balle sur le quai nord, un appel auquel il répond sans savoir que c'est elle, et tout s'écroule. Elle rend les clés, demande le divorce devant vingt-deux couverts, et s'allie à la famille rivale. Sept ans pour comprendre qu'on n'attend pas qu'on écrive votre nom quelque part : on l'écrit.",
"chapitres": [],
"couv": true,
"maj": "2026-09-18"
},
{
"id": "lune",
"titre": "La Part de Lune",
"serie": "Les Deux Collines — tome 1",
"auteur": "Écrit avec Claude",
"genres": [
"Urban fantasy",
"Romance paranormale",
"Loups & Lycans",
"Âmes sœurs",
"Série"
],
"annee": "2026",
"couleur": "#1c2445",
"statut": "À venir",
"resume": "Lyon, aujourd'hui. Sous les traboules, deux meutes se partagent les collines, et des femmes appelées Lieuses constatent les liens que personne n'a choisis. Maël, aide-soignante de nuit, est frappée par un lien d'âmes sœurs le soir où un Alpha lui amène un loup qui n'en est pas un — et rejetée par lui devant le Concile trois jours plus tard. Ce qu'on ne lui a pas dit : le Rejet est irrévocable pour celui qui le prononce. Pas pour celle qui le reçoit.",
"chapitres": [],
"couv": true
},
{
"id": "vesper",
"titre": "Le Contrat de Vesper",
"auteur": "Écrit avec Claude",
"genres": [
"Dark romance",
"Science-fiction",
"Futuriste",
"Obsession"
],
"annee": "2026",
"couleur": "#2b2b33",
"statut": "En cours",
"resume": "Vesper, 2049. Chaque citoyen porte un score, et le score se propage : un cousin condamné, une facture impayée, et Ilya tombe à 412 en servant un café. Un homme à 940 lui propose de porter son risque pendant un an, chez lui, selon un contrat de trente-deux pages qui ne dit pas ce qu'il attend d'elle. Il ne la touche pas. Il la regarde. Et dans trois pièces fermées, dix cartons portent les noms de celles qui l'ont précédée. Avertissements : rapport de pouvoir déséquilibré, surveillance, obsession.",
"chapitres": [],
"couv": true,
"maj": "2026-09-12"
},
{
"id": "braises",
"titre": "La Saison des Braises",
"serie": "Les Trois Cents Lieues — tome 1",
"auteur": "Écrit avec Claude",
"genres": [
"Romance sensuelle",
"Fantasy",
"Enemies to lovers",
"Slow burn",
"Série"
],
"annee": "2026",
"couleur": "#8a3a1f",
"statut": "En cours",
"resume": "Ysée Marrec ne dessine que ce qu'elle a vu, et la carte du Nord se termine en blanc : trois cents lieues au-delà de la Ligne des Cendres, là où la terre brûle depuis quatre-vingts ans. Pour la traverser, la Guilde lui donne un seul guide — Cael, un Braise, un homme que le feu a touché sans le tuer et qui ne connaît pas le froid. Ce qu'on ne lui a pas dit : la Ligne ne laisse passer que ceux qu'un Braise porte dans sa chaleur. Assez près. Pendant trois jours.",
"chapitres": [],
"couv": true,
"maj": "2026-09-19"
},
{
"id": "verre",
"titre": "La Dette de Verre",
"auteur": "Écrit avec Claude",
"genres": [
"Romance",
"Héritage",
"Secret de famille",
"Drame"
],
"annee": "2026",
"couleur": "#1f4a52",
"statut": "En cours",
"resume": "Directrice générale du groupe hôtelier Valadares, Nour Belkacem hérite de trente-quatre pour cent des parts — à condition d'être encore en poste le jour de la mort du patriarche. Le fils revenu d'exil veut sa révocation. Une lettre laissée sous scellés lui apprend pourquoi ce legs n'était pas un cadeau, mais une dette : en 1997, Henrique Valadares a ruiné son père. À Lisbonne, tout le monde a de bonnes raisons.",
"chapitres": [],
"couv": true,
"maj": "2026-09-12"
}
];
const SEPARATEURS = {"braises": {"4": [5, 16, 25, 35, 44, 51, 56], "6": [6, 12, 22, 40, 51], "20": [3, 17, 23, 35, 45, 56], "29": [10, 14, 26, 31, 52], "35": [34, 47], "36": [3, 11, 26, 36], "37": [5, 11, 30, 41, 54, 71], "38": [6, 20, 40, 55, 68], "39": [14, 20, 40, 47], "39 bis": [7, 20, 36], "40": [4, 31, 38, 49, 62, 73, 78], "40 bis": [6, 13, 19, 30, 37, 41], "41": [8, 27, 51, 77, 86], "42": [3, 12, 24, 38, 56, 61], "43": [3, 16, 24, 33, 43, 71, 76, 94, 106], "44": [4, 21, 36, 58, 63, 71], "45": [5, 36, 45, 49, 74, 81], "46": [6, 13, 19, 30, 40, 50], "47": [5, 17, 23, 30, 41, 56], "48": [5, 19, 24, 50, 52, 62, 67], "49": [2, 14, 26, 36, 43, 73, 87, 118, 124, 151], "50": [9, 20, 38, 42, 59, 69, 74]}};
// Les textes arrivent par des balises <script> séparées, une par morceau.
// Un morceau peut manquer à l'appel : après un changement de découpage, le
// navigateur d'un lecteur déjà venu garde un index.html en cache qui réclame
// un fichier désormais supprimé. On assemble donc chaque livre morceau par
// morceau, sans laisser une absence emporter toute la bibliothèque : le livre
// concerné s'affiche « Bientôt disponible », les autres restent lisibles.
function texte(...morceaux) {
  const chapitres = [];
  for (const m of morceaux) {
    try {
      const lot = m();
      if (Array.isArray(lot)) chapitres.push(...lot);
    } catch (e) {
      console.warn('Liseuse : un fichier de texte manque à l\'appel —', e.message);
    }
  }
  return chapitres;
}

BOOKS.find(b => b.id === 'castellano').chapitres = texte(() => CASTELLANO_P1, () => CASTELLANO_P2, () => CASTELLANO_P3, () => CASTELLANO_P4);
BOOKS.find(b => b.id === 'vesper').chapitres = texte(() => DATA_VESPER);
BOOKS.find(b => b.id === 'braises').chapitres = texte(() => BRAISES_P1, () => BRAISES_P2, () => BRAISES_P3, () => BRAISES_P4, () => BRAISES_P5, () => BRAISES_P6, () => BRAISES_P7, () => BRAISES_P8, () => BRAISES_P9);
BOOKS.find(b => b.id === 'verre').chapitres = texte(() => DATA_VERRE);

const PERSONNAGES = {
  castellano: [
    { nom:"Livia Sarti", role:"Narratrice principale", texte:"Consigliere de la famille Castellano pendant six ans et, depuis trois ans, l'épouse secrète de Salvatore. Une balle sous la clavicule le 17 mars, un appel auquel il répond sans savoir que c'est elle : elle rend les clés et demande le divorce devant vingt-deux couverts." },
    { nom:"Salvatore Castellano", role:"Narrateur — le Don", texte:"Dirige la famille sans savoir lire un bilan. Épouse Livia en secret par peur de ce qu'il aurait à perdre au grand jour, puis met onze mois à formuler la seule phrase qu'elle lui avait demandée." },
    { nom:"Damiano Rocchi", role:"Narrateur — famille rivale", texte:"Héritier des Rocchi, associé de Livia à cinquante-cinquante. L'a croisée dix ans plus tôt à un colloque à Milan sans lui demander son nom. A financé, sans savoir qui s'y trouverait, l'opération du quai nord." },
    { nom:"Matteo Rocchi", role:"Patriarche des Rocchi", texte:"A perdu son fils aîné en 2003, enlevé par les Ferraro. A attendu vingt-trois ans non pour se venger, mais pour obtenir une preuve. C'est lui qui propose à Livia une maison à elle plutôt qu'une place dans la sienne." },
    { nom:"Serena Vitale", role:"Fiancée officielle de Salvatore", texte:"Payée depuis quatre ans par les Ferraro pour éteindre la dette de son père. A organisé un anniversaire le 17 mars pour éloigner Salvatore du quai. Apporte à Livia quatre ans de rapports, et meurt trois jours plus tard." },
    { nom:"Enzo", role:"Assistant de Livia", texte:"Entré dans la maison à dix-neuf ans, n'a jamais pris une décision : il transmet. A communiqué les horaires du quai nord sans savoir, puis entre dans un commissariat en sachant ce que cela lui coûte." },
    { nom:"Bruno Castellano", role:"Oncle de Salvatore", texte:"Soixante et un ans, a enterré le père de Salvatore et vu arriver les Ferraro en 2003. Le seul à dire tout haut que la maison tenait grâce à Livia." },
    { nom:"Madame Castellano", role:"Mère de Salvatore", texte:"A tenu la maison pendant les douze années de fuite de son mari. Signe l'entrée des Ferraro trois semaines avant l'emprunt, et fait passer le message qu'il faut « régler la question » Serena." },
    { nom:"Gianfranco Ferraro", role:"Antagoniste", texte:"Conseil en investissement, prête onze millions aux Castellano pour les tenir. Mis en examen le 4 juin, quitte le pays le 6 avec un passeport qui n'est pas le sien." },
    { nom:"Le père de Livia", role:"Famille", texte:"A gardé le port en 2003 plutôt que de sauver le fils de Matteo Rocchi, et en est mort un peu chaque jour pendant vingt-trois ans. Enlevé à son tour, il ne répond pas cette fois." },
    { nom:"Commissaire Renzi", role:"Police", texte:"Ne croit pas une seconde à la culpabilité de Salvatore : un homme qui organise un homicide n'invente pas un alibi qu'il refuse de nommer." },
    { nom:"Chiara Belloni", role:"Auditrice", texte:"Apprend à Salvatore à lire un bilan, deux soirs par semaine. Avait travaillé pour Livia en 2022." }
  ],
  vesper: [
    { nom:"Ilya Marchetti", role:"Narratrice principale", texte:"Vingt-sept ans, serveuse. Son score tombe à 412 un mardi à onze heures quatorze, par propagation : un cousin condamné, une amie qui a manifesté, une facture impayée par sa mère." },
    { nom:"Aurel Sarn", role:"Narrateur — le garant", texte:"Score de 940, garant depuis huit ans. Onze personnes portées, dix dossiers classés dans trois pièces fermées. Il ne les touche jamais : il les regarde, et il garde." },
    { nom:"Nadia Marchetti", role:"Mère d'Ilya", texte:"Ingénieure au Bureau des Scores de 2041 à 2046, autrice de la règle de propagation qui fera tomber sa propre fille. A passé ses deux dernières années à essayer de casser ce qu'elle avait construit, et a caché son correctif dans son dossier médical." },
    { nom:"Verrien", role:"Agent du Bureau", texte:"Sourit bien. Propose 850 points et une stabilité « définitive » — l'article 44 précise que le portage d'État est irrévocable pour la personne portée." },
    { nom:"Hedda", role:"Employée de maison", texte:"Ne parle pas, sauf une fois. C'est elle qui prévient Ilya sur ce qui est arrivé à la précédente." },
    { nom:"Mina", role:"La précédente", texte:"Vingt-trois ans, restée sept mois. A trouvé son carton au sixième mois et lu ce qu'Aurel avait noté : rien de sale, des choses justes. Elle a préféré 380 à un homme qui savait qu'elle avait arrêté de chanter." }
  ],
  braises: [
    { nom:"Ysée Marrec", role:"Narratrice principale", texte:"Vingt-quatre ans, pupille de la Guilde des Cartographes depuis l'âge de sept ans. Ne dessine que ce qu'elle a vu, et tient un second carnet — « le blanc » — pour tout ce que la Guilde ne lui demande pas de dessiner." },
    { nom:"Cael Dorne", role:"Narrateur — le Braise", texte:"Vingt-sept ans, dix-neuf ans de four. Le feu est entré en lui à la rupture des Fours et n'en est jamais ressorti : il ne craint pas la chaleur, mais il brûle de l'intérieur. Vendu à la Guilde pour douze cents couronnes, chiffré en quatre cents charges de sel." },
    { nom:"Aldric Vael", role:"Doyen de la Guilde", texte:"Soixante et un ans. A dressé les cartes des campagnes du Nord il y a vingt-deux ans — celles dont les hachures mesuraient des gens et dont les croix marquaient les écoles de forge." },
    { nom:"Halden Serrande", role:"Marchand de sel", texte:"Propose quatre mille couronnes pour que la carte du Nord reste incomplète : trois gisements au-delà de la Ligne ruineraient sa maison. Refuse honnêtement de trouver sa raison plus laide qu'une autre." },
    { nom:"Vaugrin", role:"Braise, mort avant le récit", texte:"Tenait le four un. Mort à quarante-quatre ans sur un banc de la cour. Laisse une plaque de fer gravée à la main : la porte nord de Ghar, que personne n'avait jamais dessinée." },
    { nom:"Torve", role:"Contremaître", texte:"Ignore les ordres depuis trente ans, ce qui est sa manière à lui d'être un homme. Transmet à Cael l'héritage de Vaugrin." }
  ],
  verre: [
    { nom:"Nour Belkacem", role:"Narratrice principale", texte:"Directrice générale du groupe Valadares, entrée comme assistante à vingt-trois ans. Hérite de trente-quatre pour cent des parts, à condition d'être encore en poste au jour du décès." },
    { nom:"Rafael Valadares", role:"Narrateur — le fils", texte:"Quarante ans, absent de l'entreprise depuis douze ans. A monté une société de conseil en refusant d'apprendre à lire les registres de ses propres véhicules — le reproche exact que son père lui faisait en 2014." },
    { nom:"Henrique Valadares", role:"Le patriarche, mort au premier chapitre", texte:"A racheté en 1997 un immeuble rue da Boavista au quart de sa valeur, en déclenchant lui-même la procédure. La famille s'appelait Belkacem. Il l'a su en 2016 et a préféré promouvoir plutôt que dire." },
    { nom:"Teresa Moura", role:"Directrice financière", texte:"Son plan de cession des trois hôtels de l'Algarve a été refusé par Nour en quarante minutes devant tout le conseil. Dîne avec Duarte Pinheiro depuis un an et demi." },
    { nom:"Duarte Pinheiro", role:"Associé de Rafael", texte:"A monté le véhicule d'acquisition qui rachèterait l'Algarve, au nom d'une société que Rafael préside sans la lire." },
    { nom:"Karim Belkacem", role:"Père de Nour", texte:"Menuisier. A vendu l'immeuble familial en 1997 à un homme qui lui expliquait qu'il n'aurait pas d'autre offre. Mort en 2000, à cinquante-trois ans." }
  ],
  lune: []
};

const app = document.getElementById('app'), $ = id => document.getElementById(id);
const KEY = 'liseuse:v2';
const THEMES = ['clair','sepia','nuit'];
// Direction D : échelles réglées sur Literata, dont l'œil est bien plus grand que
// celui de Cormorant Garamond. Les index stockés chez les lecteurs restent valides.
const TAILLES = [15.5, 16.5, 18, 20, 22.5];      // px
const INTERLIGNES = [1.56, 1.67, 1.78, 1.9, 2.05];
/* Nombres à la française : virgule décimale, espace insécable avant l'unité. */
function nombre(x){ return String(x).replace('.', ','); }

/* Couvertures en image. Un livre bascule sur son image dès qu'il est déclaré ici ;
   si le fichier manque ou ne se charge pas, couvRepli() rend la main à la
   couverture SVG d'index.html. Les fichiers sont des SVG qui enveloppent une image
   WebP 480 × 720 : l'API de publication du dépôt n'accepte que du texte. */
const COUV_IMAGE = {
  braises: 'couvertures/braises.svg',
  castellano: 'couvertures/castellano.svg'
};
const ALIGNES = ['gauche','justifie'];
let S = { theme:'clair', taille:2, inter:2, align:'gauche', dernier:null, visite:0, livres:{} };
let visitePrec = 0;
let vue = 'lib', livre = null, ready = false, filtre = null;

function etat(id){
  if (!S.livres[id]) S.livres[id] = { chap:0, scroll:0, bookmarks:[], vus:[] };
  return S.livres[id];
}
const ICONES = {
  retour:   '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6"/></svg>',
  signet:   '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 3.5h8v13l-4-3-4 3z"/></svg>',
  theme:    '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path class="plein" d="M10 3a7 7 0 0 0 0 14z"/></svg>',
  sommaire: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M4 10h12M4 14h8"/></svg>',
  fermer:   '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15"/></svg>'
};
function toast(m){ const t=$('toast'); t.textContent=m; t.classList.add('show');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),1900); }

/* ---- contraste : un accent de livre lisible sur le fond du thème courant ----
   Les cinq couleurs de livre sont sombres. Sur le papier clair elles passent
   largement ; sur le fond nuit elles tombent entre 1,20 et 2,33, là où la norme
   demande 4,5 pour du texte. On monte donc la clarté sans toucher à la teinte,
   jusqu'à atteindre le seuil, en prenant pour référence le fond du tiroir, qui
   est toujours le plus défavorable des deux fonds du thème. */
function _canal(c){ c /= 255; return c <= .04045 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); }
function _rgb(hex){ const h = String(hex).trim().replace('#','');
  const n = h.length === 3 ? h.split('').map(x=>x+x).join('') : h;
  return [parseInt(n.slice(0,2),16), parseInt(n.slice(2,4),16), parseInt(n.slice(4,6),16)]; }
function luminance(hex){ const [r,g,b] = _rgb(hex);
  return .2126*_canal(r) + .7152*_canal(g) + .0722*_canal(b); }
function contraste(a, b){ const x = luminance(a), y = luminance(b);
  return (Math.max(x,y) + .05) / (Math.min(x,y) + .05); }
function _versHsl(hex){ let [r,g,b] = _rgb(hex).map(v=>v/255);
  const mx = Math.max(r,g,b), mn = Math.min(r,g,b), l = (mx+mn)/2;
  if (mx === mn) return [0, 0, l];
  const d = mx-mn, s = l > .5 ? d/(2-mx-mn) : d/(mx+mn);
  let h; if (mx===r) h = ((g-b)/d + (g<b ? 6 : 0)); else if (mx===g) h = (b-r)/d + 2; else h = (r-g)/d + 4;
  return [h/6, s, l]; }
function _versHex(h, s, l){
  const f = n => { const k = (n + h*12) % 12, a = s*Math.min(l, 1-l);
    const v = l - a*Math.max(-1, Math.min(k-3, 9-k, 1));
    return Math.round(255*v).toString(16).padStart(2,'0'); };
  return '#' + f(0) + f(8) + f(4); }
function accentLisible(couleur, fond, cible){
  cible = cible || 4.5;
  try {
    if (contraste(couleur, fond) >= cible) return couleur;
    const eclaircir = luminance(fond) < .4;
    let [h, s, l] = _versHsl(couleur);
    s = Math.min(1, s * 1.15);
    for (let i = 1; i <= 100; i++){
      const l2 = eclaircir ? Math.min(1, l + i/100) : Math.max(0, l - i/100);
      const c = _versHex(h, s, l2);
      if (contraste(c, fond) >= cible) return c;
    }
    return eclaircir ? '#ffffff' : '#000000';
  } catch(e){ return couleur; }
}

let accentCourant = '#6d1f2c';
function poserAccent(couleur){
  if (couleur) accentCourant = couleur;
  app.style.setProperty('--accent', accentCourant);
  let fond = '';
  try { fond = getComputedStyle(app).getPropertyValue('--paper-deep').trim(); } catch(e){}
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(fond)) fond = S.theme === 'nuit' ? '#191D30' : (S.theme === 'sepia' ? '#EADFC9' : '#F1F2F6');
  app.style.setProperty('--accent-texte', eloignerDuRose(accentLisible(accentCourant, fond), fond));
}
/* En Nuit, un accent de livre éclairci pour rester lisible peut tomber dans la
   famille du rose, réservé à ce que la lectrice a marqué (Castellano : #db5a6f
   contre #F08BA4). Sa teinte est alors ramenée vers le rouge franc, à contraste
   égal ou supérieur. */
function eloignerDuRose(hex, fond){
  try {
    if (S.theme !== 'nuit') return hex;
    const [h, s, l] = _versHsl(hex), deg = h * 360;
    if (deg < 315 && deg > 2) return hex;
    for (let i = 0; i <= 40; i++){
      const c = _versHex(2/360, Math.min(1, s), Math.min(1, l + i/100));
      if (contraste(c, fond) >= 4.5) return c;
    }
    return hex;
  } catch(e){ return hex; }
}

/* La hauteur de la barre supérieure dépend du remplissage d'encoche : on la
   mesure plutôt que de la supposer, pour que le filet de progression s'y colle. */
function mesurerBarre(){
  const b = document.querySelector('.bar'); if (!b) return;
  app.style.setProperty('--barh', Math.round(b.getBoundingClientRect().height) + 'px');
}

/* ---- polices de la direction D ----
   Fraunces pour les titres, Literata pour tout le reste. Chargées ici plutôt que
   dans index.html, qui ne sert qu'aux couvertures SVG et garde Cormorant et Jost. */
(function chargerPolices(){
  if (document.getElementById('policesD')) return;
  const l = document.createElement('link');
  l.id = 'policesD'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400..700,0..100,0..1;1,9..144,400..700,0..100,0..1&family=Literata:ital,opsz,wght@0,7..72,300..700;1,7..72,300..700&display=swap';
  document.head.appendChild(l);
})();

/* ---- styles injectés (thème sépia + réglages de lecture) ---- */
(function injecterStyles(){
  const s = document.createElement('style');
  s.textContent = `
  #app .body p { font-size: var(--taille, 20px); line-height: var(--inter, 1.72); }
  @media (max-width: 520px){ #app .body p { font-size: var(--taille, 18.5px); } }
  .reglages { border-bottom: 1px solid var(--rule); padding-bottom: 16px; margin-bottom: 4px; }
  .reglages h4 { font-family:'Jost'; font-size:11px; letter-spacing:.14em; color:var(--muted);
    font-weight:400; margin:0 0 10px; text-transform:uppercase; }
  .rline { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
  .rline > span { font-size:12px; color:var(--muted); flex:1; letter-spacing:.04em; }
  .rbtn { width:40px; height:36px; border:1px solid var(--rule); background:none; color:var(--ink);
    font-family:inherit; font-size:14px; border-radius:2px; cursor:pointer; display:grid; place-items:center; }
  .rbtn:disabled { opacity:.3; cursor:default; }
  .rval { min-width:42px; text-align:center; font-size:12px; color:var(--muted); }
  .reprise { display:block; width:100%; text-align:left; background:var(--paper-deep);
    border:1px solid var(--rule); border-left:3px solid var(--accent); border-radius:2px;
    padding:14px 16px; margin-bottom:24px; cursor:pointer; color:var(--ink); font-family:inherit; }
  .reprise small { display:block; font-size:11px; letter-spacing:.13em; color:var(--muted);
    text-transform:uppercase; margin-bottom:5px; }
  .reprise b { font-family:'Cormorant Garamond', serif; font-size:18px; font-weight:600; display:block; line-height:1.25; }
  .reprise em { font-style:normal; font-size:12px; color:var(--muted); display:block; margin-top:4px; }
  .bmnote { display:block; font-family:'Jost'; font-size:12px; color:var(--ink);
    border-left:2px solid var(--brass); padding-left:8px; margin-top:6px; line-height:1.45; }
  .bmacts { display:flex; gap:14px; }
  .tabs { flex-wrap: wrap; }
  .prow { border-bottom:1px solid var(--rule); padding:14px 0; }
  .prow b { font-family:'Cormorant Garamond', serif; font-size:17px; font-weight:600; display:block; }
  .prow small { font-family:'Jost'; font-size:11px; letter-spacing:.12em; color:var(--muted);
    text-transform:uppercase; display:block; margin:3px 0 6px; }
  .prow p { font-size:13px; line-height:1.55; color:var(--ink); margin:0; }
  .neuf { display:inline-block; background:var(--accent); color:#f2ede3; font-size:9px;
    letter-spacing:.12em; padding:2px 6px; border-radius:2px; margin-left:6px; vertical-align:2px; }

  /* ————— Passe de design du 18 septembre 2026 —————
     Toutes les règles portent le sélecteur #app : la feuille de style d'origine
     est écrite dans le corps de la page, donc plus tard dans l'ordre du document.
     L'identifiant est ce qui permet à ces règles de l'emporter. */

  /* Contraste. L'accent d'un livre est une couleur sombre : posé en texte sur le
     fond nuit, il tombait entre 1,20 et 2,33 pour 4,5 exigés. --accent-texte est
     recalculé à l'exécution, à teinte constante. Les gris de légende passaient
     eux aussi sous le seuil sur le fond du tiroir en clair et en sépia. */
  #app { --accent-texte: var(--accent); }
  #app.clair { --muted:#686156; }
  #app.sepia { --ink:#4a3b2c; --paper:#f4ecd8; --paper-deep:#eadfc4;
    --brass:#9a7b3f; --muted:#72604b; --rule:#ddceae; }
  #app .pov, #app .chapline.current, #app .gpct { color: var(--accent-texte); }
  #app .del:hover, #app .ghost.discret:hover { color: var(--accent-texte); }
  #app .icon:focus-visible, #app button:focus-visible, #app input:focus-visible {
    outline: 2px solid var(--ink); outline-offset: 2px; }

  /* La ligne de progression se cale sous la hauteur réelle de la barre, mesurée
     au chargement : la valeur figée de 61 px laissait passer le texte dessous,
     et davantage encore sur un écran à encoche. */
  #app .progress { top: var(--barh, 65px); }

  /* Lecture. La lettrine flottante est remplacée par une initiale haussée dans la
     ligne : les chapitres s'ouvrent presque tous sur une phrase de vingt à
     soixante signes, qu'une lettrine de trois lignes débordait. Les répliques
     prennent un retrait pendant — le tiret cadratin sort dans la marge et la
     colonne de texte reste droite — et ne se justifient jamais. */
  #app .body p { text-wrap: pretty; text-align: var(--align, left);
    hyphens: var(--cesure, manual); -webkit-hyphens: var(--cesure, manual); }
  #app .body p::first-letter { font-size: inherit; float: none; padding: 0;
    line-height: inherit; font-weight: inherit; color: inherit; }
  #app .body p.ouverture { font-size: 1.1em; }
  #app .body p.ouverture .cap { font-size: 1.5em; line-height: 1; font-weight: 600;
    color: var(--accent-texte); }
  #app .body p.dlg { text-indent: -.75em; padding-left: .75em; text-align: left; hyphens: manual; }
  /* Coupure de scène : les lignes « --- » du manuscrit, que les fichiers de texte
     ne portent pas. Leur position vient de SEPARATEURS, écrit par le générateur.
     Le filet est centré sur la colonne de texte, pas sur la page. */
  #app .body .scene { max-width: 34em; margin: 2.2em 0; text-align: center; line-height: 0; }
  #app .body .scene::before { content:''; display:inline-block; width:44px; height:1px;
    background: var(--brass); opacity:.8; vertical-align: middle; }
  #app .pov { padding-bottom: 18px; margin-bottom: 26px; position: relative; }
  #app .pov::after { content:''; position:absolute; left:0; bottom:0;
    width:46px; height:1px; background: var(--brass); }

  /* Bibliothèque. Vingt pastilles de genre occupaient cinq lignes sur un
     téléphone et repoussaient les couvertures sous la ligne de flottaison. */
  #app .chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
    mask-image: linear-gradient(90deg, #000 calc(100% - 30px), transparent);
    -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 30px), transparent); }
  #app .chips.fin { mask-image: none; -webkit-mask-image: none; }
  #app .chips::-webkit-scrollbar { display: none; }
  #app .chip { flex: none; white-space: nowrap; }
  @media (min-width: 760px) {
    #app .chips { flex-wrap: wrap; overflow: visible; mask-image: none; -webkit-mask-image: none; }
  }

  /* Page de garde : effacer sa progression ne se présente plus comme l'égal
     d'ouvrir le sommaire. */
  #app .ghost.discret { border: none; color: var(--muted); font-size: 12.5px;
    letter-spacing: .04em; padding: 12px; margin-top: 2px; }

  /* Tiroir : l'onglet actif était signalé par une nuance de gris. */
  #app .tab { padding: 10px 6px; font-size: 11.5px; letter-spacing: .03em; white-space: nowrap; }
  #app .tab.on { background: var(--ink); border-color: var(--ink); color: var(--paper); }
  #app .drawer { box-shadow: -18px 0 44px rgba(0,0,0,.18); }
  #app .rbtn.large { width: auto; min-width: 104px; padding: 0 12px;
    font-size: 12px; letter-spacing: .04em; }

  /* ————— Itération 2, 18 septembre 2026 ————— */

  /* Barre : icônes dessinées, cibles de 44 px, retrait en mode immersif. */
  #app .icon { width: 44px; height: 44px; }
  #app .icon svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.5;
    stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
  #app .icon svg .plein, #app .icon.on svg path { fill: currentColor; }
  #app .bar { transition: transform .2s cubic-bezier(.4,0,.2,1); }
  #app .progress { transition: top .2s cubic-bezier(.4,0,.2,1); }
  #app.immersif .bar { transform: translateY(-100%); }
  #app.immersif .progress { top: 0; }

  /* Bibliothèque. */
  #app .cmeta .cetat { margin-top: 6px; }
  #app .cbar + .cetat { margin-top: 5px; }
  #app .effacer, #app .lien { background: none; border: none; padding: 10px 0; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: .04em; color: var(--accent-texte);
    text-decoration: underline; text-underline-offset: 3px; }
  #app #noRes .effacer { display: block; font-style: normal; }

  /* Page de garde : résumé aligné à gauche, coupé à six lignes. */
  #app .gres { text-align: left; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 6;
    -webkit-box-orient: vertical; overflow: hidden; }
  #app .gres.ouvert { display: block; -webkit-line-clamp: unset; overflow: visible; }
  #app #gResPlus { display: block; margin: 0 0 26px; }

  /* Fin de chapitre. */
  #app .finlab { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin: 0 0 12px; }
  #app .navbtn.suite { display: flex; flex-direction: column; gap: 6px; width: 100%; text-align: left;
    padding: 18px 18px 20px; margin-bottom: 10px; background: var(--accent); border: none; color: #f2ede3; }
  #app .navbtn.suite:hover { border: none; filter: brightness(1.1); }
  #app .navbtn.suite small { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; opacity: .85; }
  #app .navbtn.suite b { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; line-height: 1.15; }
  #app .navbtn.suite em { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 16px; opacity: .9; }
  #app .finlivre { margin-bottom: 14px; }
  #app .finlivre b { display: block; font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; }
  #app .finlivre p { font-size: 14px; line-height: 1.55; color: var(--muted); margin: 6px 0 0; }
  #app .finlivre .ghost { width: auto; padding: 12px 16px; }

  /* Tiroir : réglages résumés, actes repliables, chapitre en cours. */
  #app .rresume { display: flex; justify-content: space-between; align-items: center; gap: 10px; width: 100%;
    text-align: left; background: none; border: 1px solid var(--rule); border-radius: 2px; padding: 10px 12px;
    color: var(--ink); font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: .03em; cursor: pointer; }
  #app .rresume small { display: block; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 3px; }
  #app .rresume .rmod { color: var(--muted); flex: none; }
  #app #rDetail { padding-top: 12px; }
  #app .reglages { padding-bottom: 12px; }
  #app .chapline.current { box-shadow: inset 3px 0 0 var(--accent-texte); padding-left: 14px; }
  #app .chapline.current::before { content: none; }
  #app .ptete { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%;
    text-align: left; background: none; border: none; border-bottom: 1px solid var(--rule); padding: 14px 0;
    color: var(--ink); cursor: pointer; font-family: 'Jost', sans-serif; }
  #app .ptete b { display: block; font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 600; }
  #app .ptete small { display: block; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
  #app .ptete svg { width: 16px; height: 16px; flex: none; fill: none; stroke: var(--muted); stroke-width: 1.5;
    stroke-linecap: round; stroke-linejoin: round; transition: transform .2s; }
  #app .ptete[aria-expanded="true"] svg { transform: rotate(180deg); }

  /* Feuille du bas. */
  #app .fscrim { position: fixed; inset: 0; background: rgba(10,10,12,.55); z-index: 54; opacity: 0;
    pointer-events: none; transition: opacity .2s; }
  #app .fscrim.open { opacity: 1; pointer-events: auto; }
  #app .feuille { position: fixed; left: 0; right: 0; bottom: 0; margin: 0 auto; max-width: 520px; max-height: 85vh;
    overflow-y: auto; z-index: 55; box-sizing: border-box; background: var(--paper); color: var(--ink);
    border-top: 1px solid var(--rule); border-radius: 8px 8px 0 0; box-shadow: 0 -12px 40px rgba(0,0,0,.2);
    padding: 10px 20px max(28px, env(safe-area-inset-bottom)); transform: translateY(105%);
    visibility: hidden; transition: transform .22s cubic-bezier(.4,0,.2,1), visibility 0s .22s; }
  #app .feuille.open { transform: none; visibility: visible; transition: transform .22s cubic-bezier(.4,0,.2,1); }
  #app .fpoignee { width: 36px; height: 4px; border-radius: 2px; background: var(--rule); margin: 0 auto 10px; }
  #app .fhead { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
  #app .fhead h3 { margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; line-height: 1.2; }
  #app .fsous { margin: 4px 0 0; font-size: 11px; letter-spacing: .13em; text-transform: uppercase; color: var(--muted); }
  #app .fcitation { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 18px; line-height: 1.5; margin: 0 0 16px; }
  #app .flabel { display: block; font-size: 13px; margin-bottom: 6px; }
  #app .flabel span { color: var(--muted); }
  #app .feuille textarea { width: 100%; box-sizing: border-box; resize: none; padding: 12px 14px;
    background: var(--paper-deep); border: 1px solid var(--rule); border-radius: 2px; color: var(--ink);
    font-family: 'Jost', sans-serif; font-size: 16px; line-height: 1.45; }
  #app .feuille textarea::placeholder { color: var(--muted); }
  #app .feuille textarea:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  #app .fcompte { text-align: right; font-size: 11px; color: var(--muted); margin: 4px 0 14px; }
  #app .ftexte { font-size: 15px; line-height: 1.55; margin: 0 0 18px; }
  #app .feuille .ghost.discret { display: block; width: auto; margin: 6px auto 0; }

  @media (prefers-reduced-motion: reduce) {
    #app .bar, #app .progress, #app .feuille, #app .feuille.open, #app .fscrim, #app .ptete svg { transition: none; }
  }

  /* ————— Direction D · Veilleuse, validée le 19 septembre 2026 —————
     Sélecteur html #app : ces règles redéfinissent des jetons et des familles que
     la feuille d'origine pose sur #app lui-même. */

  /* Ce qui ne bouge jamais : l'aplat ambre sur encre (9,42:1), identique dans
     les trois thèmes. */
  html #app { --ambre: #FFB25C; --ambre-encre: #2A1A08; --mesure: 33em;
    --f-titre: 'Fraunces', Georgia, serif; --f-texte: 'Literata', Georgia, serif;
    font-family: var(--f-texte); }
  /* Les trois thèmes. Identifiants internes inchangés : clair, sepia, nuit. */
  html #app.clair { --paper:#FCFCFD; --paper-deep:#F1F2F6; --ink:#14151C; --muted:#5A5D6B;
    --ambre-texte:#8F5410; --rose:#A8305A; --rule:#E2E3EA; --rule-fort:#83868F; --brass:#8F5410;
    --halo: rgba(255,178,92,.16); }
  html #app.sepia { --paper:#F3EADA; --paper-deep:#EADFC9; --ink:#23201A; --muted:#615A4C;
    --ambre-texte:#8A5310; --rose:#A33256; --rule:#E0D3BB; --rule-fort:#857B66; --brass:#8A5310;
    --halo: rgba(255,178,92,.20); }
  html #app.nuit { --paper:#0F1220; --paper-deep:#191D30; --ink:#F2F1EE; --muted:#9B9FB3;
    --ambre-texte:#FFB25C; --rose:#F08BA4; --rule:#2E3349; --rule-fort:#767C99; --brass:#FFB25C;
    --halo: rgba(255,178,92,.13); }

  /* Deux familles, et deux seulement. */
  html #app button, html #app input, html #app textarea,
  html #app .chapline em, html #app .bmrow small, html #app .del, html #app .bmnote,
  html #app .prow small, html #app .reglages h4, html #app .effacer, html #app .lien,
  html #app .rresume, html #app .ptete, html #app .feuille textarea, html #app .chapline,
  html #app .bmrow, html #app .empty, html #app .gres, html #app .body p, html #app .pov,
  html #app .fcitation, html #app .navbtn.suite em { font-family: var(--f-texte); }
  html #app .libhead, html #app .gtitle, html #app h2, html #app .dhead, html #app .bar .title,
  html #app .cmeta b, html #app .reprise b, html #app .navbtn.suite b, html #app .finlivre b,
  html #app .fhead h3, html #app .ptete b, html #app .prow b {
    font-family: var(--f-titre); font-variation-settings: 'SOFT' 40, 'WONK' 1; font-weight: 600; }
  html #app .libhead { letter-spacing: -.02em; }
  html #app .bar .title { font-size: 16px; font-weight: 500; }

  /* Formes : angles arrondis, commandes dessinées en --rule-fort (3:1 au moins). */
  html #app .icon, html #app .rbtn, html #app .tab, html #app .search, html #app .ghost,
  html #app .navbtn, html #app .rresume, html #app .feuille textarea { border-radius: 8px; border-color: var(--rule-fort); }
  html #app .ghost.discret, html #app .navbtn.suite { border: none; }
  html #app .chip, html #app .gchips span { border-color: var(--rule-fort); border-radius: 20px; }
  html #app .reprise, html #app .primary, html #app .navbtn.suite { border-radius: 10px; }
  html #app .cover { border-radius: 4px; }
  html #app .feuille { border-radius: 14px 14px 0 0; }
  html #app .icon:hover, html #app .navbtn:hover:not(:disabled) { border-color: var(--ink); }

  /* L'ambre, voix de la liseuse : aplat sur encre partout où il remplit. */
  html #app .primary, html #app .navbtn.suite, html #app .neuf, html #app .tab.on, html #app .chip.on {
    background: var(--ambre); color: var(--ambre-encre); border-color: var(--ambre); }
  html #app .primary { font-weight: 600; letter-spacing: .02em; }
  html #app .navbtn.suite:hover, html #app .primary:hover:not(:disabled) { filter: brightness(1.05); }
  html #app .progress i { background: var(--ambre); }
  html #app .chapnum { color: var(--ambre-texte); font-size: 11px; font-weight: 600;
    letter-spacing: .2em; text-transform: uppercase; }
  html #app .body p.ouverture .cap, html #app .chapline.current { color: var(--ambre-texte); }
  html #app .chapline.current { box-shadow: inset 3px 0 0 var(--ambre-texte); }
  /* Le bouton de thème n'est plus rempli : un seul aplat par écran. */
  html #app #nightBtn.on { background: none; color: var(--ink); border-color: var(--rule-fort); }

  /* La couleur du livre reste au livre. */
  html #app .cbar i, html #app .gbar i { background: var(--accent-texte); }
  html #app .gpct { color: var(--accent-texte); }
  html #app .reprise { border-color: var(--rule); border-left: 4px solid var(--livre, var(--accent)); }

  /* Le rose est au lecteur : ce qu'il a marqué. */
  html #app #bmBtn.on { background: none; color: var(--rose); border-color: var(--rose); }
  html #app .bmnote { border-left-color: var(--rose); }
  html #app .body p.marque { position: relative; }
  html #app .body p.marque::before { content: ''; position: absolute; left: -12px; top: .3em; bottom: .3em;
    width: 3px; border-radius: 2px; background: var(--rose); }

  /* Le halo ambré en tête de l'écran de lecture, accroché à la fenêtre, sous la barre. */
  html #app.lecture::before { content: ''; position: fixed; left: 0; right: 0; top: var(--barh, 65px);
    height: 190px; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse 70% 100% at 50% 0, var(--halo), transparent 100%);
    transition: top .2s cubic-bezier(.4,0,.2,1); }
  html #app.lecture.immersif::before { top: 0; }
  html #app.lecture #vRead .wrap { position: relative; z-index: 1; }

  /* Texte : corps et colonne réglés sur Literata. */
  html #app .body p { max-width: var(--mesure); }
  html #app .body p.ouverture { font-size: calc(var(--taille, 18px) * 1.1); }
  html #app .body p.ouverture .cap { font-family: var(--f-titre); font-variation-settings: 'SOFT' 40, 'WONK' 1; }
  html #app .pov { font-style: italic; color: var(--muted); font-size: 14px; padding-bottom: 0; margin-bottom: 30px; }
  html #app .pov::after { content: none; }
  html #app h2 { line-height: 1.15; }
  /* Coupure de scène : trois points ambrés, centrés sur la colonne de texte. */
  html #app .body .scene { max-width: var(--mesure); line-height: 1; }
  html #app .body .scene::before { content: '·  ·  ·'; width: auto; height: auto; background: none;
    color: var(--ambre-texte); opacity: 1; font-size: 20px; letter-spacing: .1em; white-space: pre; }

  /* Bibliothèque : les cartes s'alignent en haut, quelle que soit la longueur du titre. */
  html #app .grid { align-items: start; }
  html #app .cover.image { padding: 0; background: var(--paper-deep); }
  html #app .cover.image::after { content: none; }
  html #app .cover.image img { display: block; width: 100%; height: 100%; object-fit: cover; }

  /* Tiroir : onglets à 44 px. */
  html #app .tab { min-height: 44px; }
  html #app .rbtn { width: 44px; height: 44px; }
  html #app .rbtn.large { width: auto; }
  html #app .drawer { box-shadow: -18px 0 44px rgba(0,0,0,.22); }

  @media (prefers-reduced-motion: reduce) { html #app.lecture::before { transition: none; } }

  /* ————— Contre-audit du 19 septembre 2026 : lots A, C, D ————— */

  /* A · Panneau « Affichage » : le texte reste visible au-dessus pendant le réglage. */
  html #app .fscrim.leger { background: transparent; }
  html #app .feuille.reglage { max-height: 60vh; }
  html #app .rtheme { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 0 0 14px; }
  html #app .rtheme button { min-height: 44px; border-radius: 8px; border: 1px solid var(--rule-fort);
    background: none; color: var(--ink); font-size: 13px; cursor: pointer; }
  html #app .rtheme button[aria-pressed="true"] { border: 2px solid var(--ambre-texte); color: var(--ambre-texte); font-weight: 600; }
  html #app .rtheme .pastille { display: inline-block; width: 12px; height: 12px; border-radius: 50%;
    margin-right: 7px; vertical-align: -1px; border: 1px solid var(--rule-fort); }
  html #app .feuille .rline { margin-bottom: 10px; }
  html #app .rresume .rmod { color: var(--ambre-texte); }

  /* A · Carte « Reprendre » : où l'on en est, d'un coup d'œil. */
  html #app .reprise .cbar { margin-top: 10px; height: 3px; border-radius: 2px; overflow: hidden; }
  html #app .reprise .cbar i { background: var(--livre, var(--accent-texte)); }
  html #app .cbar { border-radius: 2px; overflow: hidden; }

  /* A · Nouveaux chapitres : dit en ambre, sans aplat. */
  html #app .nouveaux { display: block; margin-top: 4px; font-size: 11.5px; font-weight: 600;
    letter-spacing: .02em; color: var(--ambre-texte); }

  /* C · Page de garde : un seul axe, l'action avant le résumé. */
  html #app #vCover .gcover { margin-left: 0; }
  html #app .gtitle, html #app .gauth { text-align: left; }
  html #app .gauth { letter-spacing: .08em; margin-bottom: 6px; }
  html #app .gmeta { color: var(--muted); font-size: 12.5px; margin: 0 0 16px; }
  html #app .gchips { justify-content: flex-start; margin-bottom: 22px; }
  html #app #vCover.commence .gstat { border-top: none; padding-top: 0; margin-bottom: 14px; }
  html #app #vCover.commence #tocBtn { margin-bottom: 26px; }
  html #app .gpct small { font-family: var(--f-texte); font-size: 14px; font-weight: 400; color: var(--muted); margin-left: 6px; }

  /* C · Fin de livre : le « FIN » du manuscrit posé comme une coupure. */
  html #app .body p.finmanuscrit { text-align: center; max-width: var(--mesure); margin-top: 2.4em;
    letter-spacing: .3em; font-size: 13px; font-weight: 600; color: var(--ambre-texte); }
  html #app .finlivre .primary { width: 100%; margin-top: 14px; }

  /* C · Sommaire : une coche discrète plutôt que « · lu » à chaque ligne. */
  html #app .chapline.lu em::after { content: '✓'; margin-left: 8px; color: var(--ambre-texte); letter-spacing: 0; }
  html #app .vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  /* D · Bibliothèque : en-tête allégé, genres sur une rangée, grille élargie. */
  html #app .libhead, html #app .libsub { display: none; }
  html #app #vLib .wrap { padding-top: 22px; }
  @media (min-width: 760px) {
    html #app .chips { flex-wrap: nowrap; overflow-x: auto;
      mask-image: linear-gradient(90deg, #000 calc(100% - 30px), transparent);
      -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 30px), transparent); }
    html #app .chips.fin { mask-image: none; -webkit-mask-image: none; }
  }
  @media (min-width: 900px) {
    html #app #vLib .wrap { max-width: 1040px; }
    html #app #vLib .grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 30px 22px; }
  }

  /* D · Colonne de lecture : autour de 65 signes avec Literata. */
  html #app { --mesure: 30em; }

  /* ————— Page de garde, audit du 19 septembre ————— */
  html #app .gtitle { margin-bottom: 2px; }
  html #app .gsous { font-family: var(--f-titre); font-variation-settings: 'SOFT' 40, 'WONK' 1;
    font-style: italic; font-weight: 400; font-size: 20px; line-height: 1.25; margin: 0 0 14px; color: var(--ink); }
  html #app .gres { margin-left: 0; margin-right: 0; }
  html #app .gstat.seul { border: none; padding: 0; margin-bottom: 14px; }
  html #app .gstat.seul .glab { margin-top: 0; }
  html #app .glab { font-size: 12px; letter-spacing: .06em; }
  html #app .gchips span { font-size: 12px; }
  html #app #vCover #tocBtn { margin-bottom: 26px; }`;
  document.head.appendChild(s);
})();

function appliquerTheme(){
  THEMES.forEach(t => app.classList.toggle(t, S.theme === t));
  app.classList.toggle('night', S.theme === 'nuit');   // compat règles existantes
  $('nightBtn').classList.remove('on');
  $('nightBtn').removeAttribute('title');
  $('nightBtn').setAttribute('aria-label', 'Affichage : thème ' + nomTheme(S.theme) + ', taille et interligne');
  $('nightBtn').setAttribute('aria-haspopup', 'dialog');
  resumerReglages();
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = S.theme==='nuit' ? '#0F1220' : (S.theme==='sepia' ? '#F3EADA' : '#FCFCFD');
  poserAccent();   // le fond a changé : l'accent de texte se recalcule
}
function appliquerLecture(){
  app.style.setProperty('--taille', TAILLES[S.taille] + 'px');
  app.style.setProperty('--inter', INTERLIGNES[S.inter]);
  const justifie = S.align === 'justifie';
  app.style.setProperty('--align', justifie ? 'justify' : 'left');
  app.style.setProperty('--cesure', justifie ? 'auto' : 'manual');
  const ba = $('alignBtn');
  if (ba) { ba.textContent = justifie ? 'Justifié' : 'À gauche';
    ba.setAttribute('aria-label', 'Alignement du texte : ' + ba.textContent); }
  resumerReglages();
  const vt = $('valTaille'), vi = $('valInter');
  if (vt) vt.textContent = nombre(TAILLES[S.taille]) + ' px';
  if (vi) vi.textContent = nombre(INTERLIGNES[S.inter].toFixed(2));
  ['tMoins','tPlus','iMoins','iPlus'].forEach(id => { const b=$(id); if(!b) return;
    b.disabled = (id==='tMoins' && S.taille===0) || (id==='tPlus' && S.taille===TAILLES.length-1)
              || (id==='iMoins' && S.inter===0)  || (id==='iPlus' && S.inter===INTERLIGNES.length-1); });
}

function resumerReglages(){
  const r = $('rTexte'); if (!r) return;
  r.textContent = nomTheme(S.theme).replace(/^./, x => x.toUpperCase()) + ' · ' + nombre(TAILLES[S.taille]) + ' px · interligne '
    + nombre(INTERLIGNES[S.inter]) + ' · ' + (S.align === 'justifie' ? 'justifié' : 'à gauche');
}

function load(){
  try {
    const brut = localStorage.getItem(KEY);
    if (brut) Object.assign(S, JSON.parse(brut));
    else {
      try { const old = localStorage.getItem('castellano:etat');
        if (old){ const o = JSON.parse(old);
          if (o.night) S.theme = 'nuit';
          S.livres.castellano = { chap:o.chap||0, scroll:o.scroll||0, bookmarks:o.bookmarks||[], vus:[] };
          for (let i=0;i<=(o.chap||0);i++) S.livres.castellano.vus.push(i);
        }
      } catch(e){}
      // Première visite : on part du réglage du système plutôt que du clair d'office.
      try { if (S.theme === 'clair' && window.matchMedia
              && matchMedia('(prefers-color-scheme: dark)').matches) S.theme = 'nuit'; } catch(e){}
    }
    if (S.night !== undefined) { if (!S.theme || S.theme==='clair') S.theme = S.night ? 'nuit' : 'clair'; delete S.night; }
    if (!THEMES.includes(S.theme)) S.theme = 'clair';
    if (typeof S.taille !== 'number' || !TAILLES[S.taille]) S.taille = 2;
    if (typeof S.inter !== 'number' || !INTERLIGNES[S.inter]) S.inter = 2;
    if (!ALIGNES.includes(S.align)) S.align = 'gauche';
    localStorage.setItem('liseuse:test','1'); localStorage.removeItem('liseuse:test');
    $('statusNote').textContent = 'Progression, réglages et marque-pages enregistrés sur cet appareil.';
  } catch(e){ $('statusNote').textContent = 'Votre progression ne peut pas être enregistrée sur cet appareil (navigation privée ou stockage bloqué).'; }
  ready = true;
}
function save(){ if(!ready) return; try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

/* ---- temps de lecture ---- */
function motsDe(c){ return c.p.join(' ').split(/\s+/).length; }
function minutesDe(c){ return Math.max(1, Math.round(motsDe(c)/220)); }
function duree(min){ if (min < 60) return min + ' min';
  const h = Math.floor(min/60), r = min%60; return r ? h+' h '+String(r).padStart(2,'0') : h+' h'; }

/* ---- dates ---- */
function dateCourte(iso){
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return '';
  return d.toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' });
}
/* « NOUVEAU » s'allumait sur la date de régénération du fichier, même sans un mot
   de neuf. On compte désormais les chapitres parus depuis la dernière fois que le
   livre a été ouvert : S.connus garde, par livre, le nombre de chapitres vus alors. */
function nouveaux(b){
  if (!S.connus) S.connus = {};
  if (typeof S.connus[b.id] !== 'number') { S.connus[b.id] = b.chapitres.length; return 0; }
  return Math.max(0, b.chapitres.length - S.connus[b.id]);
}
function connaitre(b){ if (!S.connus) S.connus = {}; S.connus[b.id] = b.chapitres.length; save(); }
function commence(b){ const e = S.livres[b.id];
  return !!(e && b.chapitres.length && ((e.vus && e.vus.length) || e.chap > 0 || e.scroll > 0)); }

/* « En cours » et « Terminé » désignent l'écriture du livre, mais se lisaient comme
   l'état de la lecture : on les dit autrement à l'affichage, sans toucher aux données. */
function statutLisible(s){
  return ({ 'Terminé':'Roman complet', 'En cours':"En cours d'écriture", 'À venir':'À paraître' })[s] || s;
}
function esc(t){ return String(t == null ? '' : t).replace(/[&<>"']/g,
  c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]); }

/* ---- pourcentage lu ---- */
function pct(b){
  const e = S.livres[b.id]; if (!e || !e.vus) return 0;
  if (!b.chapitres.length) return 0;
  return Math.round(e.vus.length / b.chapitres.length * 100);
}
function svgDe(id){
  const t = document.querySelector(`#couvertures template[data-livre="${id}"]`);
  return t ? t.innerHTML : '';
}
/* Chaque insertion d'une couverture reçoit ses propres identifiants SVG. Sans cela,
   la couverture de la page de garde et celle de la grille (masquée) portaient les
   mêmes id de dégradés : les url(#…) visaient la copie masquée et la page de
   garde s'affichait sans ciel, sans braises, sans fissures. */
let nCouv = 0;
function idsUniques(svg){
  const k = 'c' + (++nCouv) + '-';
  return svg.replace(/\bid="([^"]+)"/g, (m, i) => `id="${k}${i}"`)
            .replace(/url\(#([^)]+)\)/g, (m, i) => `url(#${k}${i})`)
            .replace(/href="#([^"]+)"/g, (m, i) => `href="#${k}${i}"`);
}
/* Une image qui ne se charge pas rend la main au SVG d'origine. */
function couvRepli(img){
  const box = img.closest('.cover'), id = img.dataset.livre;
  const s = svgDe(id); if (!box) return;
  box.classList.remove('image');
  box.style.background = '#0b0f1e';
  box.innerHTML = s ? idsUniques(s) : '';
}
function couverture(b, petit){
  if (COUV_IMAGE[b.id]) return `<div class="cover image"><img src="${COUV_IMAGE[b.id]}" alt="" width="600" height="900"`
    + ` loading="lazy" decoding="async" data-livre="${b.id}" onerror="couvRepli(this)"></div>`;
  if (b.couv) { const s = svgDe(b.id);
    if (s) return `<div class="cover" style="padding:0;background:#0b0f1e">${idsUniques(s)}</div>`; }
  return `<div class="cover" style="background:linear-gradient(150deg,${b.couleur},#14161a)">
     <div class="ca">${b.genres[0].toUpperCase()}</div>
     <div><div class="ct">${b.titre}</div>
     <div class="ca" style="margin-top:8px">${b.annee}</div></div></div>`;
}

/* ---- bibliothèque ---- */
function tousGenres(){ const s=new Set(); BOOKS.forEach(b=>b.genres.forEach(g=>s.add(g))); return [...s].sort(); }

function renderReprise(){
  const box = $('reprise');
  const d = S.dernier, b = d && BOOKS.find(x => x.id === d.id);
  if (!b || !b.chapitres.length) { box.style.display = 'none'; return; }
  const e = etat(b.id), c = b.chapitres[e.chap];
  if (!c) { box.style.display = 'none'; return; }
  box.style.display = '';
  box.style.setProperty('--livre', b.couleur);
  const pos = Math.round((e.chap + 1) / b.chapitres.length * 100);
  box.innerHTML = `<small>Reprendre ma lecture</small><b>${b.titre}</b>
    <em>Chapitre ${c.n} sur ${b.chapitres.length} · ${c.t}</em>
    <div class="cbar" aria-hidden="true"><i style="width:${pos}%"></i></div>`;
  box.onclick = () => { livre = b; poserAccent(b.couleur); connaitre(b); aller('read', true); };
}

function renderLib(){
  $('libCount').textContent = BOOKS.length + (BOOKS.length>1 ? ' livres' : ' livre');
  renderReprise();
  $('chips').innerHTML = tousGenres().map(g=>`<button class="chip ${filtre===g?'on':''}" data-g="${g}">${g}</button>`).join('');
  [...$('chips').querySelectorAll('[data-g]')].forEach(c=>{
    c.onclick = () => { filtre = (filtre===c.dataset.g ? null : c.dataset.g); renderLib(); };
  });
  // Le dégradé de bord droit disparaît quand la rangée est arrivée au bout.
  const ch = $('chips');
  const bord = () => ch.classList.toggle('fin', ch.scrollLeft + ch.clientWidth >= ch.scrollWidth - 2);
  ch.onscroll = bord; bord();
  ch.onwheel = ev => { if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX) && ch.scrollWidth > ch.clientWidth) {
    ch.scrollLeft += ev.deltaY; ev.preventDefault(); } };
  const q = $('search').value.trim().toLowerCase();
  const res = BOOKS.filter(b=>{
    const okG = !filtre || b.genres.includes(filtre);
    const hay = (b.titre+' '+b.auteur+' '+b.genres.join(' ')+' '+b.resume).toLowerCase();
    return okG && (!q || hay.includes(q));
  });
  const nr = $('noRes');
  nr.style.display = res.length ? 'none' : '';
  if (!res.length) {
    nr.innerHTML = '';
    nr.appendChild(document.createTextNode(q
      ? 'Aucun livre ne correspond à « ' + $('search').value.trim() + ' ».'
      : 'Aucun livre ne correspond à ce genre.'));
    const eff = document.createElement('button');
    eff.className = 'effacer'; eff.type = 'button';
    eff.textContent = q ? 'Effacer la recherche' : 'Voir tous les livres';
    eff.onclick = () => { $('search').value = ''; filtre = null; renderLib(); $('search').focus(); };
    nr.appendChild(eff);
  }
  $('grid').innerHTML = res.map(b=>{
    const p = pct(b), e = S.livres[b.id];
    // Une seule mesure d'avancement sur la fiche : la position dans le livre.
    const debut = commence(b), nv = nouveaux(b);
    const pos = debut ? Math.round((e.chap + 1) / b.chapitres.length * 100) : 0;
    const etatLecture = !b.chapitres.length ? 'Aucun chapitre publié'
      : !debut ? b.chapitres.length + ' chapitres · ' + duree(b.chapitres.reduce((t,c)=>t+minutesDe(c),0))
      : p >= 100 ? 'Lu en entier'
      : 'Chapitre ' + (b.chapitres[e.chap] || b.chapitres[0]).n + ' sur ' + b.chapitres.length;
    return `<button class="card" data-b="${b.id}">${couverture(b)}
      <div class="cmeta"><b>${b.titre}</b>${nv ? `<span class="nouveaux">${nv === 1 ? '1 nouveau chapitre' : nv + ' nouveaux chapitres'}</span>` : ''}${b.serie ? `<div class="cpct" style="margin-top:3px">${b.serie}</div>` : ''}
        ${debut && p < 100 ? `<div class="cbar"><i style="width:${pos}%"></i></div>` : ''}
        <div class="cpct cetat">${etatLecture}</div>
        <div class="cpct">${statutLisible(b.statut)}</div></div></button>`;
  }).join('');
  // Un livre commencé s'ouvre sur son chapitre en cours ; la page de garde reste à
  // un geste, par le bouton retour de la lecture. Un livre jamais ouvert, lui,
  // passe par sa page de garde.
  [...$('grid').querySelectorAll('[data-b]')].forEach(c=>{
    const b = BOOKS.find(x => x.id === c.dataset.b);
    if (commence(b)) c.setAttribute('aria-label', b.titre + ' — reprendre au chapitre ' + b.chapitres[etat(b.id).chap].n);
    c.onclick = () => {
      if (!commence(b)) { ouvrirLivre(b.id); return; }
      livre = b; poserAccent(b.couleur); connaitre(b); aller('read', true);
    };
  });
}
$('search').oninput = renderLib;

/* ---- page de garde ---- */
function ouvrirLivre(id){
  livre = BOOKS.find(b=>b.id===id);
  poserAccent(livre.couleur);
  const e = etat(id), p = pct(livre);
  $('gCover').innerHTML = couverture(livre);
  // « Le Prix du Silence, Don Castellano » : un titre et un sous-titre, comme sur
  // la couverture. La virgule les sépare ; sans virgule, le titre reste entier.
  const k = livre.titre.indexOf(', ');
  $('gTitle').textContent = k > 0 ? livre.titre.slice(0, k) : livre.titre;
  $('gSous').textContent = k > 0 ? livre.titre.slice(k + 2) : '';
  $('gSous').style.display = k > 0 ? '' : 'none';
  connaitre(livre);
  $('gAuth').textContent = livre.serie || livre.auteur;
  // La date de mise à jour n'a d'intérêt que pour un livre qui s'écrit encore.
  $('gMeta').textContent = [livre.serie ? livre.auteur : '', statutLisible(livre.statut),
    livre.maj && livre.statut !== 'Terminé' ? 'mis à jour le ' + dateCourte(livre.maj) : ''].filter(Boolean).join(' · ');
  $('gChips').innerHTML = livre.genres.map(g=>`<span>${esc(g)}</span>`).join('');
  // Livre commencé : la progression et l'action passent avant le résumé.
  const v = $('vCover'), w = v.querySelector('.wrap'), deja = commence(livre);
  v.classList.toggle('commence', deja);
  // Dans tous les états, l'action vient avant le résumé et les genres restent sous
  // le titre qu'ils qualifient.
  const ordre = ['gCover','gTitle','gSous','gAuth','gMeta','gChips','gStat','readBtn','tocBtn','gRes','gResPlus','resetBtn'];
  ordre.forEach(id => { const x = $(id); if (x) w.appendChild(x); });
  $('gRes').textContent = livre.resume;
  $('gRes').classList.remove('ouvert');
  const plus = $('gResPlus');
  if (plus) { plus.textContent = 'Lire tout le résumé'; plus.setAttribute('aria-expanded','false');
    requestAnimationFrame(() => { plus.style.display =
      $('gRes').scrollHeight > $('gRes').clientHeight + 2 ? '' : 'none'; }); }
  // « 0 % » en grand n'apprend rien avant la première page.
  $('gPct').innerHTML = p + ' %<small>lu</small>';
  $('gPct').style.display = p === 0 ? 'none' : '';
  $('gBar').parentElement.style.display = p === 0 ? 'none' : '';
  $('gBar').style.width = p + '%';
  const restant = livre.chapitres.reduce((t,c,i) => t + (e.vus.includes(i) ? 0 : minutesDe(c)), 0);
  $('gLab').textContent = !livre.chapitres.length ? 'Aucun chapitre publié pour l\'instant.'
    : p===0 ? livre.chapitres.length + ' chapitres · ' + duree(restant) + ' de lecture'
    : (p===100 ? 'Lu en entier · ' + livre.chapitres.length + ' chapitres'
    : 'Chapitre ' + livre.chapitres[e.chap].n + ' sur ' + livre.chapitres.length + ' · ' + duree(restant) + ' restantes');
  const vide = !livre.chapitres.length;
  $('gStat').classList.toggle('seul', p === 0);
  // Livre lu en entier : on propose de le relire, sans rien effacer.
  relire = p >= 100;
  $('readBtn').textContent = vide ? 'Bientôt disponible' : (p===0 ? 'Commencer la lecture'
    : relire ? 'Relire depuis le début' : 'Reprendre au chapitre ' + livre.chapitres[e.chap].n);
  const nbm = e.bookmarks.length;
  $('tocBtn').textContent = nbm ? 'Sommaire · ' + nbm + (nbm > 1 ? ' marque-pages' : ' marque-page') : 'Sommaire';
  $('readBtn').disabled = vide; $('readBtn').style.opacity = vide ? '.45' : '';
  $('tocBtn').style.display = vide ? 'none' : '';
  $('resetBtn').style.display = p===0 ? 'none' : '';
  aller('cover');
}

/* ---- adresses : une par écran ----
   Le retour arrière du téléphone quittait la liseuse depuis n'importe quel écran.
   Chaque écran a désormais son adresse (#/, #/livre/braises, #/lire/braises/12),
   et le tiroir comme les feuilles occupent une entrée d'historique : le retour
   arrière les referme avant de changer d'écran. */
let depuisHistorique = false, ignorerPop = false;
function adresse(v){
  if (v === 'cover') return '#/livre/' + livre.id;
  if (v === 'read') return '#/lire/' + livre.id + '/' + (etat(livre.id).chap + 1);
  return '#/';
}
function parentDe(v){ return v === 'read' ? '#/livre/' + livre.id : '#/'; }
function inscrire(v, remplacer){
  if (depuisHistorique) return;
  const h = adresse(v), st = history.state || {};
  try {
    if (!st.liseuse) history.replaceState({ liseuse:1, h, prec:null }, '', h);
    else if (remplacer) history.replaceState({ liseuse:1, h, prec:st.prec }, '', h);
    else if (st.ov) history.replaceState({ liseuse:1, h, prec:st.h }, '', h);
    else if (st.h !== h) history.pushState({ liseuse:1, h, prec:st.h }, '', h);
  } catch(e){}
}
function ouvrirEntree(){
  try { const st = history.state || {};
    if (st.ov) return;
    history.pushState({ liseuse:1, ov:1, h:st.h || location.hash || '#/', prec:st.prec || null }, '', location.href);
  } catch(e){}
}
function quitterEntree(){
  try { if (history.state && history.state.ov) { ignorerPop = true; history.back(); } } catch(e){}
}
function router(){
  const m = location.hash.match(/^#\/(livre|lire)\/([a-z0-9-]+)(?:\/(\d+))?/);
  const b = m && BOOKS.find(x => x.id === m[2]);
  depuisHistorique = true;
  try {
    if (!b) { aller('lib'); return; }
    if (m[1] === 'livre' || !b.chapitres.length) { ouvrirLivre(b.id); return; }
    const e = etat(b.id);
    const n = Math.min(Math.max(1, +m[3] || e.chap + 1), b.chapitres.length);
    livre = b; poserAccent(b.couleur);
    const meme = e.chap === n - 1;
    e.chap = n - 1; if (!meme) e.scroll = 0; save();
    aller('read', meme);
  } finally { depuisHistorique = false; }
}
addEventListener('popstate', () => {
  if (ignorerPop) { ignorerPop = false; return; }
  if (feuilleOuverte()) { fermerFeuille(true); return; }
  if ($('drawer').classList.contains('open')) { fermer(true); return; }
  router();
});

function aller(v, restore){
  vue = v;
  $('vLib').classList.toggle('on', v==='lib');
  $('vCover').classList.toggle('on', v==='cover');
  $('vRead').classList.toggle('on', v==='read');
  $('backBtn').style.display = v==='lib' ? 'none' : '';
  $('backBtn').setAttribute('aria-label', v==='read' ? 'Retour au livre' : 'Retour à la bibliothèque');
  $('menuBtn').style.display = v==='read' ? '' : 'none';
  $('bmBtn').style.display = v==='read' ? '' : 'none';
  app.classList.remove('immersif');
  app.classList.toggle('lecture', v==='read');
  $('barTitle').textContent = v==='lib' ? 'Bibliothèque'
    : (v==='cover' ? '' : 'Ch. ' + (livre.chapitres[etat(livre.id).chap]||{n:''}).n);
  inscrire(v);
  if (v==='read') renderChap(restore); else { $('progBar').style.width = '0'; window.scrollTo(0,0); }
  if (v==='lib') { livre = null; poserAccent('#6d1f2c'); renderLib(); }
}

/* ---- lecture ---- */
function renderChap(restore){
  const e = etat(livre.id), c = livre.chapitres[e.chap];
  $('chapNum').textContent = 'Chapitre ' + c.n + '  ·  ' + duree(minutesDe(c));
  $('chapTitle').textContent = c.t;
  $('chapPov').textContent = 'Point de vue — ' + c.pov;
  // Une réplique commence par un tiret cadratin : retrait pendant, pas de lettrine.
  // Les coupures de scène sont données par SEPARATEURS sous la forme des indices
  // des paragraphes après lesquels elles tombent.
  const coupures = (typeof SEPARATEURS === 'object' && SEPARATEURS
    && SEPARATEURS[livre.id] && SEPARATEURS[livre.id][String(c.n)]) || [];
  $('chapBody').innerHTML = c.p.map((t,i)=>{
    const dlg = /^\s*[—–-]/.test(t) ? ' class="dlg"'
      : (i === c.p.length - 1 && /^\s*fin\.?\s*$/i.test(t) ? ' class="finmanuscrit"' : '');
    const fin = coupures.indexOf(i) > -1 ? '<div class="scene" aria-hidden="true"></div>' : '';
    return `<p data-i="${i}"${dlg}>${t}</p>` + fin;
  }).join('');
  // Ouverture de chapitre. La lettrine flottante ne convenait pas à ce manuscrit :
  // elle emportait l'apostrophe (« J' » en corps 3) et, les chapitres s'ouvrant
  // presque tous sur une phrase courte — de vingt à soixante signes —, elle
  // débordait sous un paragraphe de deux lignes. À la place, l'initiale est
  // simplement haussée dans la ligne et le paragraphe d'ouverture légèrement grossi.
  const prem = $('chapBody').querySelector('p');
  if (prem && !prem.classList.contains('dlg')) {
    const t = prem.textContent.trim();
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ]/.test(t)) {
      prem.classList.add('ouverture');
      prem.textContent = t.slice(1);
      prem.insertAdjacentHTML('afterbegin', '<span class="cap"></span>');
      prem.firstChild.textContent = t.charAt(0);
    }
  }
  $('barTitle').textContent = 'Ch. ' + c.n + ' · ' + c.t;
  // Un chapitre ne compte plus comme lu à l'ouverture, mais à 90 % de sa hauteur
  // (voir updateProgress) : parcourir le sommaire gonflait le pourcentage.
  S.dernier = { id: livre.id, date: Date.now() };
  save();
  inscrire('read', true);
  construireFin();
  buildChaps(); buildBms(); buildPers();
  window.scrollTo(0, restore ? (e.scroll||0) : 0);
  dernierY = window.scrollY;
  updateProgress(); updateBm();
}
function marquerLu(){
  if (vue !== 'read' || !livre) return;
  const e = etat(livre.id);
  if (e.vus.includes(e.chap)) return;
  e.vus.push(e.chap); save(); majFinLabel(); buildChaps();
}
function updateProgress(){
  if (vue!=='read') return;
  const e = etat(livre.id);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const dans = h>0 ? Math.min(window.scrollY/h,1) : 1;
  $('progBar').style.width = ((e.chap+dans)/livre.chapitres.length*100).toFixed(1) + '%';
  if (dans >= .9) marquerLu();
}

/* ---- fin de chapitre ----
   « Suivant → » n'annonçait rien, et au dernier chapitre le bouton se grisait sans
   un mot. Le bouton suivant devient une carte qui présente le chapitre à venir ;
   le dernier chapitre publié dit « À suivre » ou « Fin ». */
function majFinLabel(){
  const l = $('finLab'); if (!l || !livre) return;
  const c = livre.chapitres[etat(livre.id).chap];
  l.textContent = 'Fin du chapitre ' + c.n;
  // Au dernier chapitre, le bloc de fin parle seul : pas de pourcentage qui le contredise.
  l.style.display = livre.chapitres[etat(livre.id).chap + 1] ? '' : 'none';
}
function c0(b, i){ const p = b.chapitres[i].p; return String(p[p.length - 1] || ''); }
function construireFin(){
  const e = etat(livre.id), i = e.chap;
  const suiv = livre.chapitres[i+1], prec = livre.chapitres[i-1];
  majFinLabel();
  const nb = $('nextBtn'), pb = $('prevBtn'), fl = $('finLivre');
  if (suiv) {
    nb.style.display = ''; nb.disabled = false;
    nb.innerHTML = `<small>Chapitre suivant · ${duree(minutesDe(suiv))}</small>`
      + `<b>${esc(suiv.n)} — ${esc(suiv.t)}</b><em>Point de vue — ${esc(suiv.pov)}</em>`;
    nb.setAttribute('aria-label', 'Chapitre suivant : ' + suiv.n + ', ' + suiv.t);
    fl.style.display = 'none'; fl.innerHTML = '';
  } else {
    nb.style.display = 'none'; nb.disabled = true;
    const fini = livre.statut === 'Terminé';
    const finTexte = /^\s*fin\.?\s*$/i.test(c0(livre, i));
    fl.innerHTML = fini
      ? `${finTexte ? '' : '<b>Fin</b>'}<p>Vous avez terminé <i>${esc(livre.titre)}</i>.</p>`
      : `<b>À suivre</b><p>Vous êtes à jour. Les prochains chapitres apparaîtront ici dès leur publication.</p>`;
    const r = document.createElement('button');
    r.className = 'primary'; r.type = 'button'; r.textContent = 'Retour à la bibliothèque';
    r.onclick = () => { marquerLu(); aller('lib'); };
    fl.appendChild(r); fl.style.display = '';
  }
  pb.textContent = prec ? '← Chapitre ' + prec.n : '← Précédent';
  pb.disabled = !prec;
}

function paraCourant(){
  const ps = [...document.querySelectorAll('#chapBody p')], mid = innerHeight*0.3;
  let best = 0; ps.forEach((p,i)=>{ if (p.getBoundingClientRect().top<=mid) best=i; }); return best;
}
/* L'icône s'allumait s'il existait un marque-page n'importe où dans le chapitre,
   mais ne retirait que celui du paragraphe courant : son état suit désormais le
   paragraphe courant, comme l'action qu'elle déclenche. */
function updateBm(){
  if (!livre || vue !== 'read') return;
  const e = etat(livre.id), para = paraCourant();
  const on = e.bookmarks.some(b => b.chap===e.chap && b.para===para);
  marquerPassages();
  const bt = $('bmBtn');
  bt.classList.toggle('on', on);
  bt.setAttribute('aria-pressed', on ? 'true' : 'false');
  bt.setAttribute('aria-label', on ? 'Retirer le marque-page de ce passage' : 'Marquer ce passage');
}
/* Le passage marqué porte un filet rose dans la marge, là où on l'a laissé. */
function marquerPassages(){
  if (!livre) return;
  const e = etat(livre.id);
  const ici = new Set(e.bookmarks.filter(b => b.chap === e.chap).map(b => b.para));
  document.querySelectorAll('#chapBody p[data-i]').forEach(p =>
    p.classList.toggle('marque', ici.has(+p.dataset.i)));
}
function toggleBm(){
  const e = etat(livre.id), para = paraCourant();
  const i = e.bookmarks.findIndex(b=>b.chap===e.chap && b.para===para);
  if (i>-1){ e.bookmarks.splice(i,1); updateBm(); buildBms(); save(); toast('Marque-page retiré'); return; }
  const t = (livre.chapitres[e.chap].p[para]||'').replace(/<[^>]+>/g, '');
  // L'extrait s'arrête sur une fin de mot, pas au milieu.
  let ex = t;
  if (t.length > 90) { ex = t.slice(0, 90); const k = ex.lastIndexOf(' '); ex = (k > 50 ? ex.slice(0, k) : ex).replace(/[\s,;:—–-]+$/, '') + '…'; }
  const bm = { chap:e.chap, para, note:'', extrait:ex,
    date:new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) };
  e.bookmarks.push(bm);
  e.bookmarks.sort((a,b)=>a.chap-b.chap||a.para-b.para);
  updateBm(); buildBms(); save();
  feuilleNote(bm, true);
}

/* ---- feuilles ----
   prompt() et confirm() sortaient de la liseuse : boîtes système impossibles à
   styler, et annuler la note créait quand même le marque-page. Une feuille qui
   monte du bas les remplace, dans les couleurs du thème. */
let feuilleAuFermer = null, focusAvantFeuille = null;
function feuilleOuverte(){ const f = $('feuille'); return !!(f && f.classList.contains('open')); }
function ouvrirFeuille(o){
  const f = $('feuille');
  focusAvantFeuille = document.activeElement;
  f.setAttribute('role', o.role || 'dialog');
  f.removeAttribute('aria-describedby');
  $('fTitre').textContent = o.titre;
  $('fSous').textContent = o.sous || '';
  $('fSous').style.display = o.sous ? '' : 'none';
  $('fCorps').innerHTML = o.corps;
  feuilleAuFermer = o.auFermer || null;
  f.removeAttribute('inert'); f.setAttribute('aria-hidden','false');
  f.classList.add('open'); $('fScrim').classList.add('open');
  app.classList.remove('immersif');
  ouvrirEntree();
  setTimeout(() => { const x = o.focus && $(o.focus); try { (x || $('fFermer')).focus(); } catch(e){} }, 40);
}
function fermerFeuille(silencieux, sansRappel){
  const f = $('feuille'); if (!f || !f.classList.contains('open')) return;
  f.classList.remove('open', 'reglage'); $('fScrim').classList.remove('open', 'leger');
  if (f.contains(document.activeElement)) { try { document.activeElement.blur(); } catch(e){} }
  f.setAttribute('inert',''); f.setAttribute('aria-hidden','true');
  const cb = feuilleAuFermer; feuilleAuFermer = null;
  if (!sansRappel && cb) cb();
  if (focusAvantFeuille && document.contains(focusAvantFeuille)) { try { focusAvantFeuille.focus(); } catch(e){} }
  if (!silencieux) quitterEntree();
}
function feuilleNote(bm, nouveau){
  const c = livre.chapitres[bm.chap];
  ouvrirFeuille({
    titre: nouveau ? 'Passage marqué' : 'Note du marque-page',
    sous: 'Chapitre ' + c.n + '  ·  ' + c.t,
    corps: `<p class="fcitation">« ${esc(bm.extrait)} »</p>
      <label class="flabel" for="fNote">Note <span>(facultatif)</span></label>
      <textarea id="fNote" rows="3" maxlength="280" placeholder="Une remarque, une question pour plus tard…">${esc(bm.note || '')}</textarea>
      <p class="fcompte" id="fCompte" aria-live="polite"></p>
      <button class="primary" type="button" id="fOk">Enregistrer</button>
      <button class="ghost discret" type="button" id="fSuppr">Retirer le marque-page</button>`,
    focus: nouveau ? null : 'fNote',
    auFermer: () => { if (nouveau) toast('Marque-page enregistré'); }
  });
  const ta = $('fNote'), cpt = $('fCompte');
  // Le compteur n'apparaît qu'à l'approche de la limite.
  const maj = () => { cpt.textContent = ta.value.length >= 200 ? ta.value.length + ' / 280' : ''; };
  ta.oninput = maj; maj();
  $('fOk').onclick = () => {
    const avant = bm.note || '';
    bm.note = ta.value.trim(); save(); buildBms();
    fermerFeuille(false, true);
    toast(bm.note ? 'Note enregistrée' : (nouveau ? 'Marque-page enregistré' : (avant ? 'Note supprimée' : 'Marque-page enregistré')));
  };
  $('fSuppr').onclick = () => {
    const e = etat(livre.id), k = e.bookmarks.indexOf(bm);
    if (k > -1) e.bookmarks.splice(k, 1);
    save(); buildBms(); updateBm();
    fermerFeuille(false, true);
    toast('Marque-page retiré');
  };
}

/* ---- sommaire ----
   Une clé facultative `parties` dans BOOKS ([{ titre, debut }], debut = numéro
   du premier chapitre) regroupe les chapitres en actes repliables. Sans elle,
   la liste reste plate. */
function buildChaps(){
  const e = etat(livre.id);
  $('dTitle').textContent = livre.titre;
  const ligne = (c,i) => { const lu = i !== e.chap && e.vus.includes(i);
    return `<button class="chapline ${i===e.chap?'current':''}${lu?' lu':''}" data-go="${i}"${i===e.chap?' aria-current="true"':''}>
      <em>Chapitre ${esc(c.n)} · ${esc(c.pov)} · ${duree(minutesDe(c))}${i===e.chap ? ' · en cours' : ''}${lu ? '<span class="vh">, lu</span>' : ''}</em>${esc(c.t)}</button>`; };
  const parts = (Array.isArray(livre.parties) ? livre.parties : [])
    .filter(p => p && p.titre && +p.debut > 0)
    .map(p => ({ titre:p.titre, i:livre.chapitres.findIndex(c => parseInt(c.n, 10) >= +p.debut) }))
    .filter(p => p.i > -1);
  let html;
  if (!parts.length) html = livre.chapitres.map(ligne).join('');
  else {
    html = livre.chapitres.slice(0, parts[0].i).map(ligne).join('');
    parts.forEach((p, k) => {
      const fin = k+1 < parts.length ? parts[k+1].i : livre.chapitres.length;
      const idx = []; for (let j = p.i; j < fin; j++) idx.push(j);
      if (!idx.length) return;
      const ouvert = e.chap >= p.i && e.chap < fin;
      const lus = idx.filter(j => e.vus.includes(j)).length;
      html += `<div class="partie"><button class="ptete" type="button" aria-expanded="${ouvert}" aria-controls="partie${k}">
        <span><b>${esc(p.titre)}</b><small>Chapitres ${esc(livre.chapitres[p.i].n)} à ${esc(livre.chapitres[fin-1].n)} · ${lus} lu${lus>1?'s':''} sur ${idx.length}</small></span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg></button>
        <div class="pliste" id="partie${k}"${ouvert ? '' : ' hidden'}>${idx.map(j => ligne(livre.chapitres[j], j)).join('')}</div></div>`;
    });
  }
  $('paneChaps').innerHTML = html;
  [...$('paneChaps').querySelectorAll('.ptete')].forEach(t => {
    t.onclick = () => { const l = $(t.getAttribute('aria-controls')), o = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', o ? 'false' : 'true'); l.hidden = o; };
  });
  [...$('paneChaps').querySelectorAll('[data-go]')].forEach(b=>{
    b.onclick = () => { e.chap = +b.dataset.go; e.scroll = 0; save(); fermer(true); aller('read', false); };
  });
}
function buildBms(){
  const e = etat(livre.id), pane = $('paneBms');
  $('tabBms').textContent = 'Marque-pages' + (e.bookmarks.length ? ' (' + e.bookmarks.length + ')' : '');
  if (!e.bookmarks.length){ pane.innerHTML = '<p class="empty">Aucun marque-page pour ce livre. Pendant la lecture, affichez la barre d\'un toucher puis choisissez l\'icône marque-page.</p>'; return; }
  pane.innerHTML = e.bookmarks.map((b,i)=>
    `<div><button class="bmrow" data-bm="${i}"><small>Chapitre ${esc(livre.chapitres[b.chap].n)} · ${esc(b.date)}</small>
      <span>« ${esc(b.extrait)} »</span>${b.note ? `<span class="bmnote">${esc(b.note)}</span>` : ''}</button>
      <div class="bmacts"><button class="del" data-note="${i}">${b.note ? 'Modifier la note' : 'Ajouter une note'}</button>
      <button class="del" data-del="${i}">Supprimer</button></div></div>`).join('');
  [...pane.querySelectorAll('[data-bm]')].forEach(x=>{
    x.onclick = () => { const bm = e.bookmarks[+x.dataset.bm]; e.chap = bm.chap; save(); fermer(true); aller('read', false);
      setTimeout(()=>{ const p = document.querySelector(`#chapBody p[data-i="${bm.para}"]`);
        if (p) p.scrollIntoView({behavior:'smooth',block:'center'}); }, 60); };
  });
  [...pane.querySelectorAll('[data-note]')].forEach(x=>{
    x.onclick = () => feuilleNote(e.bookmarks[+x.dataset.note], false);
  });
  [...pane.querySelectorAll('[data-del]')].forEach(x=>{
    x.onclick = () => { e.bookmarks.splice(+x.dataset.del,1); buildBms(); updateBm(); save(); toast('Marque-page supprimé'); };
  });
}

/* ---- contrôles ---- */
/* Le tiroir restait dans l'ordre de tabulation une fois fermé : au clavier, on
   traversait tout le sommaire avant d'atteindre le texte. */
let focusAvant = null;
function ouvrir(){
  const d = $('drawer');
  focusAvant = document.activeElement;
  d.removeAttribute('inert'); d.setAttribute('aria-hidden','false');
  d.classList.add('open'); $('scrim').classList.add('open');
  app.classList.remove('immersif');
  ouvrirEntree();
  // Le sommaire s'ouvre sur le chapitre en cours, pas en haut de la liste.
  const cur = d.querySelector('.chapline.current');
  if (cur && cur.offsetParent) {
    let y = 0, n = cur; while (n && n !== d) { y += n.offsetTop; n = n.offsetParent; }
    d.scrollTop = Math.max(0, y - d.clientHeight / 2 + cur.offsetHeight / 2);
  }
  const premier = d.querySelector('button'); if (premier) premier.focus({ preventScroll:true });
}
function fermer(silencieux){
  const d = $('drawer');
  if (!d.classList.contains('open')) return;
  d.classList.remove('open'); $('scrim').classList.remove('open');
  if (focusAvant && document.contains(focusAvant) && !d.contains(focusAvant)) {
    try { focusAvant.focus(); } catch(e){}
  } else if (document.activeElement && d.contains(document.activeElement)) {
    try { document.activeElement.blur(); } catch(e){}
  }
  d.setAttribute('inert',''); d.setAttribute('aria-hidden','true');
  if (silencieux !== true) quitterEntree();
}
function ouvrirSommaire(){ buildChaps(); buildBms(); buildPers(); ouvrir(); }
$('menuBtn').onclick = ouvrirSommaire;
$('closeBtn').onclick = () => fermer(); $('scrim').onclick = () => fermer();
$('tocBtn').onclick = ouvrirSommaire;
$('bmBtn').onclick = toggleBm;
$('backBtn').onclick = () => {
  // Si l'écran précédent de l'historique est l'écran parent, on y revient par
  // l'historique plutôt que d'empiler une nouvelle entrée.
  const st = history.state || {};
  if (!st.ov && st.prec && st.prec === parentDe(vue)) { history.back(); return; }
  if (vue==='read') ouvrirLivre(livre.id); else aller('lib');
};
let relire = false;
$('readBtn').onclick = () => {
  if (relire) { const e = etat(livre.id); e.chap = 0; e.scroll = 0; save(); aller('read', false); return; }
  aller('read', true);
};
$('resetBtn').onclick = () => {
  const e = etat(livre.id), k = e.bookmarks.length, c = livre.chapitres[e.chap];
  const pos = 'Votre progression (chapitre ' + (c ? c.n : 1) + ' sur ' + livre.chapitres.length + ')';
  const texte = k
    ? pos + ' et ' + (k === 1 ? 'votre marque-page' : 'vos ' + k + ' marque-pages') + ' sur <i>' + esc(livre.titre) + '</i> seront effacés de cet appareil. Cette action est définitive.'
    : pos + ' sur <i>' + esc(livre.titre) + '</i> sera effacée de cet appareil. Cette action est définitive.';
  ouvrirFeuille({ titre:'Recommencer ce livre ?', role:'alertdialog', focus:'fNon',
    corps:`<p class="ftexte" id="fTexte">${texte}</p>
      <button class="primary" type="button" id="fOui">Tout effacer</button>
      <button class="ghost" type="button" id="fNon">Annuler</button>` });
  $('feuille').setAttribute('aria-describedby', 'fTexte');
  $('fNon').onclick = () => fermerFeuille();
  $('fOui').onclick = () => {
    const id = livre.id;
    S.livres[id] = { chap:0, scroll:0, bookmarks:[], vus:[] };
    if (S.dernier && S.dernier.id === id) S.dernier = null;
    save(); fermerFeuille(false, true); ouvrirLivre(id); toast('Progression effacée');
  };
};
function nomTheme(t){ return t==='clair' ? 'jour' : t==='sepia' ? 'papier' : 'nuit'; }
/* Panneau « Affichage » : thème, taille, interligne et alignement, dans une feuille
   basse sur fond transparent. Le texte reste visible au-dessus pendant le réglage ;
   dans le tiroir, il n'en restait que 47 px. */
let panneauReglages = null;
function ouvrirReglages(){
  if ($('drawer').classList.contains('open')) fermer(true);
  ouvrirFeuille({ titre:'Affichage', corps:'', focus:'thm-' + S.theme });
  $('feuille').classList.add('reglage'); $('fScrim').classList.add('leger');
  $('fCorps').appendChild(panneauReglages);
  majTheme(); appliquerLecture();
}
function majTheme(){
  document.querySelectorAll('.rtheme button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === S.theme ? 'true' : 'false'));
}
$('nightBtn').onclick = ouvrirReglages;
$('prevBtn').onclick = () => { const e=etat(livre.id); if(e.chap>0){ e.chap--; e.scroll=0; save(); renderChap(false); } };
$('nextBtn').onclick = () => { const e=etat(livre.id); if(e.chap<livre.chapitres.length-1){ marquerLu(); e.chap++; e.scroll=0; save(); renderChap(false); } };
function ongletActif(nom){
  [['tabChaps','paneChaps'],['tabBms','paneBms'],['tabPers','panePers']].forEach(([t,p])=>{
    const bt=$(t), pn=$(p); if(!bt||!pn) return;
    bt.classList.toggle('on', t===nom);
    bt.setAttribute('aria-selected', t===nom ? 'true' : 'false');
    bt.tabIndex = t===nom ? 0 : -1;
    pn.style.display = (t===nom) ? '' : 'none';
  });
}
$('tabChaps').onclick = () => ongletActif('tabChaps');
$('tabBms').onclick = () => ongletActif('tabBms');

function buildPers(){
  const pane = $('panePers'); if (!pane) return;
  const liste = (livre && PERSONNAGES[livre.id]) || [];
  if (!liste.length){ pane.innerHTML = '<p class="empty">Aucune fiche personnage pour ce livre.</p>'; return; }
  pane.innerHTML = liste.map(p =>
    `<div class="prow"><b>${p.nom}</b><small>${p.role}</small><p>${p.texte}</p></div>`).join('');
}

/* ---- mode immersif ----
   La barre se retire quand on descend dans le texte et revient dès qu'on remonte,
   qu'on touche le texte, en haut et en fin de chapitre. Le filet de progression
   reste en place. */
let dernierY = 0, cumulY = 0;
function gererImmersif(){
  if (vue !== 'read' || $('drawer').classList.contains('open') || feuilleOuverte()) {
    app.classList.remove('immersif'); dernierY = scrollY; return; }
  const y = scrollY, d = y - dernierY; dernierY = y;
  const h = document.documentElement.scrollHeight - innerHeight;
  if (y < 80 || y > h - 60) { app.classList.remove('immersif'); cumulY = 0; return; }
  if (d > 0) { cumulY = Math.max(0, cumulY) + d; if (cumulY > 24) app.classList.add('immersif'); }
  else if (d < 0) { cumulY = Math.min(0, cumulY) + d; if (cumulY < -8) app.classList.remove('immersif'); }
}

/* ---- éléments ajoutés au DOM ---- */
(function monterUI(){
  // carte « Reprendre » en tête de bibliothèque
  const box = document.createElement('button');
  box.className = 'reprise'; box.id = 'reprise'; box.style.display = 'none';
  $('libCount').insertAdjacentElement('afterend', box);

  // réglages de lecture en tête du tiroir, résumés sur une ligne tant qu'on ne
  // les ouvre pas : dépliés, ils repoussaient le sommaire de trois lignes.
  const r = document.createElement('div');
  r.className = 'reglages';
  r.innerHTML = `<button class="rresume" id="rResume" type="button" aria-haspopup="dialog">
      <span><small>Affichage</small><span id="rTexte"></span></span><span class="rmod" id="rMod">Régler</span></button>
    <div id="rDetail">
    <div class="rtheme" role="group" aria-label="Thème">
      <button type="button" id="thm-clair" data-t="clair"><span class="pastille" style="background:#FCFCFD"></span>Jour</button>
      <button type="button" id="thm-sepia" data-t="sepia"><span class="pastille" style="background:#F3EADA"></span>Papier</button>
      <button type="button" id="thm-nuit" data-t="nuit"><span class="pastille" style="background:#0F1220"></span>Nuit</button></div>
    <div class="rline"><span>Taille du texte</span>
      <button class="rbtn" id="tMoins" aria-label="Réduire le texte">A−</button>
      <span class="rval" id="valTaille"></span>
      <button class="rbtn" id="tPlus" aria-label="Agrandir le texte">A+</button></div>
    <div class="rline"><span>Interligne</span>
      <button class="rbtn" id="iMoins" aria-label="Réduire l'interligne">−</button>
      <span class="rval" id="valInter"></span>
      <button class="rbtn" id="iPlus" aria-label="Augmenter l'interligne">+</button></div>
    <div class="rline"><span>Alignement</span>
      <button class="rbtn large" id="alignBtn">À gauche</button></div></div>`;
  document.querySelector('.tabs').insertAdjacentElement('beforebegin', r);
  $('rResume').onclick = ouvrirReglages;

  // troisième onglet : personnages
  const bt = document.createElement('button');
  bt.className = 'tab'; bt.id = 'tabPers'; bt.textContent = 'Personnages';
  document.querySelector('.tabs').appendChild(bt);
  const pn = document.createElement('div');
  pn.id = 'panePers'; pn.style.display = 'none';
  $('paneBms').insertAdjacentElement('afterend', pn);
  bt.onclick = () => ongletActif('tabPers');
  const tl = document.querySelector('.tabs'); tl.setAttribute('role','tablist');
  [['tabChaps','paneChaps'],['tabBms','paneBms'],['tabPers','panePers']].forEach(([t,p]) => {
    $(t).setAttribute('role','tab'); $(t).setAttribute('aria-controls', p);
    $(t).setAttribute('aria-selected', $(t).classList.contains('on') ? 'true' : 'false');
    $(p).setAttribute('role','tabpanel');
  });

  $('tMoins').onclick = () => { if (S.taille>0){ S.taille--; appliquerLecture(); save(); } };
  $('tPlus').onclick  = () => { if (S.taille<TAILLES.length-1){ S.taille++; appliquerLecture(); save(); } };
  $('iMoins').onclick = () => { if (S.inter>0){ S.inter--; appliquerLecture(); save(); } };
  $('iPlus').onclick  = () => { if (S.inter<INTERLIGNES.length-1){ S.inter++; appliquerLecture(); save(); } };
  $('alignBtn').onclick = () => {
    S.align = S.align === 'justifie' ? 'gauche' : 'justifie';
    appliquerLecture(); save();
    toast(S.align === 'justifie' ? 'Texte justifié, avec césure' : 'Texte aligné à gauche');
  };
  document.querySelectorAll('.rtheme button').forEach(b => b.onclick = () => {
    S.theme = b.dataset.t; appliquerTheme(); majTheme(); save(); });
  // Les contrôles quittent le tiroir : ils vivent dans le panneau Affichage.
  panneauReglages = $('rDetail'); panneauReglages.remove();

  // Page de garde : une ligne de métadonnées, et un conteneur pour la progression.
  const gs = document.createElement('p'); gs.className = 'gsous'; gs.id = 'gSous';
  $('gTitle').insertAdjacentElement('afterend', gs);
  const gm = document.createElement('p'); gm.className = 'gmeta'; gm.id = 'gMeta';
  $('gAuth').insertAdjacentElement('afterend', gm);
  document.querySelector('#vCover .gstat').id = 'gStat';

  // Page de garde. Effacer sa progression est une action destructive : elle cesse
  // de ressembler à « Sommaire », et dit ce qu'elle fait.
  $('resetBtn').classList.add('discret');
  $('resetBtn').textContent = 'Recommencer ce livre';
  $('tocBtn').textContent = 'Sommaire';
  const plus = document.createElement('button');
  plus.id = 'gResPlus'; plus.type = 'button'; plus.className = 'lien';
  plus.setAttribute('aria-controls','gRes'); plus.setAttribute('aria-expanded','false');
  plus.textContent = 'Lire tout le résumé';
  $('gRes').insertAdjacentElement('afterend', plus);
  plus.onclick = () => { const o = $('gRes').classList.toggle('ouvert');
    plus.textContent = o ? 'Réduire le résumé' : 'Lire tout le résumé';
    plus.setAttribute('aria-expanded', o ? 'true' : 'false'); };

  // Bibliothèque : l'auteur est le même pour tous les livres ; la recherche porte
  // aussi sur les résumés, donc sur les noms des personnages.
  $('search').placeholder = 'Titre, genre, personnage…';
  $('search').setAttribute('aria-label', 'Rechercher un livre');

  // Fin de chapitre : ligne d'état, carte du chapitre suivant, bloc de fin de livre.
  const em = document.querySelector('.endmark'), nr = document.querySelector('.navrow');
  const fl = document.createElement('p'); fl.className = 'finlab'; fl.id = 'finLab';
  em.insertBefore(fl, em.firstChild);
  const fin = document.createElement('div'); fin.className = 'finlivre'; fin.id = 'finLivre'; fin.style.display = 'none';
  em.insertBefore(fin, nr);
  $('nextBtn').classList.add('suite');
  em.insertBefore($('nextBtn'), nr);
  const tf = document.createElement('button');
  tf.className = 'navbtn'; tf.id = 'tocFin'; tf.type = 'button'; tf.textContent = 'Sommaire';
  tf.onclick = ouvrirSommaire;
  nr.appendChild(tf);
  $('chapBody').addEventListener('click', () => {
    // Toucher le texte fait revenir ou repartir la barre, sauf pendant une sélection.
    const sel = window.getSelection && String(window.getSelection());
    if (sel || scrollY < 80) return;
    app.classList.toggle('immersif');
  });
  document.querySelector('.bar').addEventListener('focusin', () => app.classList.remove('immersif'));

  // Feuille du bas : note de marque-page et confirmation d'effacement.
  const fs = document.createElement('div'); fs.className = 'fscrim'; fs.id = 'fScrim';
  fs.onclick = () => fermerFeuille();
  const f = document.createElement('section');
  f.className = 'feuille'; f.id = 'feuille';
  f.setAttribute('role','dialog'); f.setAttribute('aria-modal','true');
  f.setAttribute('aria-labelledby','fTitre');
  f.setAttribute('inert',''); f.setAttribute('aria-hidden','true');
  f.innerHTML = `<div class="fpoignee" aria-hidden="true"></div>
    <div class="fhead"><div><h3 id="fTitre"></h3><p class="fsous" id="fSous"></p></div>
    <button class="icon" id="fFermer" type="button" aria-label="Fermer">${ICONES.fermer}</button></div>
    <div id="fCorps"></div>`;
  app.appendChild(fs); app.appendChild(f);
  $('fFermer').onclick = () => fermerFeuille();

  // Tiroir : hors de l'ordre de tabulation tant qu'il est fermé.
  const d = $('drawer');
  d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true');
  d.setAttribute('aria-label','Sommaire, marque-pages et réglages');
  d.setAttribute('inert',''); d.setAttribute('aria-hidden','true');

  // Icônes dessinées plutôt que des caractères (✦ ◐ ☰ ✕), dont le rendu dépend de
  // la police du système, et noms qui disent l'action.
  const icones = { backBtn:ICONES.retour, bmBtn:ICONES.signet, nightBtn:ICONES.theme,
                   menuBtn:ICONES.sommaire, closeBtn:ICONES.fermer };
  Object.keys(icones).forEach(id => { const b = $(id); if (b) { b.innerHTML = icones[id]; b.type = 'button'; } });
  const noms = { backBtn:'Retour à la bibliothèque', bmBtn:'Marquer ce passage',
                 menuBtn:'Ouvrir le sommaire', closeBtn:'Fermer le sommaire' };
  Object.keys(noms).forEach(id => { const b = $(id); if (b) { b.setAttribute('aria-label', noms[id]); b.removeAttribute('title'); } });

  // Onglets du tiroir : le rôle « tab » promet la navigation aux flèches.
  [['tabChaps','paneChaps'],['tabBms','paneBms'],['tabPers','panePers']].forEach(([t]) => {
    $(t).tabIndex = $(t).classList.contains('on') ? 0 : -1; });
  tl.addEventListener('keydown', ev => {
    const ids = ['tabChaps','tabBms','tabPers'], i = ids.indexOf(document.activeElement && document.activeElement.id);
    if (i < 0) return;
    let j = null;
    if (ev.key === 'ArrowRight') j = (i + 1) % ids.length;
    else if (ev.key === 'ArrowLeft') j = (i + ids.length - 1) % ids.length;
    else if (ev.key === 'Home') j = 0;
    else if (ev.key === 'End') j = ids.length - 1;
    if (j === null) return;
    ev.preventDefault(); ongletActif(ids[j]); $(ids[j]).focus();
  });

  // Les messages de confirmation n'étaient pas annoncés aux lecteurs d'écran.
  const to = $('toast');
  to.setAttribute('role','status'); to.setAttribute('aria-live','polite'); to.setAttribute('aria-atomic','true');

  // Balayage latéral dans le texte : vers la gauche, chapitre suivant ; vers la
  // droite, chapitre précédent. Geste net et rapide seulement, pour ne jamais
  // se confondre avec le défilement vertical ni avec une sélection.
  let tx = 0, ty = 0, tt = 0, tn = 0;
  $('chapBody').addEventListener('touchstart', ev => {
    tn = ev.touches.length; if (tn !== 1) return;
    tx = ev.touches[0].clientX; ty = ev.touches[0].clientY; tt = Date.now();
  }, {passive:true});
  $('chapBody').addEventListener('touchend', ev => {
    if (tn !== 1 || vue !== 'read' || feuilleOuverte() || $('drawer').classList.contains('open')) return;
    const t = ev.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Date.now() - tt > 600 || Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx) * .5) return;
    if (window.getSelection && String(window.getSelection())) return;
    const e = etat(livre.id);
    if (dx < 0 && e.chap < livre.chapitres.length - 1) $('nextBtn').click();
    else if (dx > 0 && e.chap > 0) $('prevBtn').click();
  }, {passive:true});

  // Le zoom était bloqué par maximum-scale=1. index.html ne se modifie pas (il
  // porte les couvertures) : on réécrit la balise d'ici.
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.setAttribute('content', 'width=device-width, initial-scale=1');
})();

/* Focus gardé dans la feuille ou le tiroir ouverts. */
function pieger(ev, zone){
  const f = [...zone.querySelectorAll('button:not([disabled]),textarea,input,[href],[tabindex]:not([tabindex="-1"])')]
    .filter(x => x.offsetParent !== null && !x.closest('[hidden]'));
  if (!f.length) return;
  const a = f[0], z = f[f.length-1];
  if (ev.shiftKey && document.activeElement === a) { ev.preventDefault(); z.focus(); }
  else if (!ev.shiftKey && document.activeElement === z) { ev.preventDefault(); a.focus(); }
  else if (!zone.contains(document.activeElement)) { ev.preventDefault(); a.focus(); }
}

let tmr;
addEventListener('scroll', () => {
  if (vue!=='read') return;
  updateProgress(); updateBm(); gererImmersif();
  etat(livre.id).scroll = scrollY;
  clearTimeout(tmr); tmr = setTimeout(save, 600);
}, {passive:true});
addEventListener('keydown', e => {
  const fo = feuilleOuverte(), dro = $('drawer').classList.contains('open');
  if (e.key === 'Tab') { if (fo) pieger(e, $('feuille')); else if (dro) pieger(e, $('drawer')); return; }
  if (e.key === 'Escape') { if (fo) fermerFeuille(); else if (dro) fermer(); return; }
  const cible = e.target && e.target.tagName;
  if (vue==='read' && !fo && !dro && cible !== 'INPUT' && cible !== 'TEXTAREA'){
    if(e.key==='ArrowRight') $('nextBtn').click(); if(e.key==='ArrowLeft') $('prevBtn').click(); }
});

addEventListener('resize', mesurerBarre, {passive:true});
addEventListener('orientationchange', () => setTimeout(mesurerBarre, 120));

load();
visitePrec = S.visite || 0;
appliquerTheme(); appliquerLecture(); mesurerBarre(); renderLib();
if (/^#\/(livre|lire)\//.test(location.hash)) router();
try { history.replaceState({ liseuse:1, h:(vue === 'lib' ? '#/' : location.hash), prec:null }, '', vue === 'lib' ? '#/' : location.hash); } catch(e){}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(mesurerBarre).catch(()=>{});
S.visite = Date.now(); save();
