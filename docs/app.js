const BOOKS = [{"id": "castellano", "titre": "Le Prix du Silence, Don Castellano", "auteur": "Écrit avec Claude", "genres": ["Romance mafieuse", "Vengeance", "Drame", "Suspense"], "annee": "2026", "couleur": "#6d1f2c", "statut": "Terminé", "resume": "Livia Sarti est la consigliere de la famille Castellano et, depuis trois ans, l'épouse secrète de son Don. Une balle sur le quai nord, un appel auquel il répond sans savoir que c'est elle, et tout s'écroule. Elle rend les clés, demande le divorce devant vingt-deux couverts, et s'allie à la famille rivale. Sept ans pour comprendre qu'on n'attend pas qu'on écrive votre nom quelque part : on l'écrit.", "chapitres": [], "couv": true}, {"id": "lune", "titre": "La Part de Lune", "serie": "Les Deux Collines — tome 1", "auteur": "Écrit avec Claude", "genres": ["Urban fantasy", "Romance paranormale", "Loups & Lycans", "Âmes sœurs", "Série"], "annee": "2026", "couleur": "#1c2445", "statut": "À venir", "resume": "Lyon, aujourd'hui. Sous les traboules, deux meutes se partagent les collines, et des femmes appelées Lieuses constatent les liens que personne n'a choisis. Maël, aide-soignante de nuit, est frappée par un lien d'âmes sœurs le soir où un Alpha lui amène un loup qui n'en est pas un — et rejetée par lui devant le Concile trois jours plus tard. Ce qu'on ne lui a pas dit : le Rejet est irrévocable pour celui qui le prononce. Pas pour celle qui le reçoit.", "chapitres": [], "couv": true}, {"id": "vesper", "titre": "Le Contrat de Vesper", "auteur": "Écrit avec Claude", "genres": ["Dark romance", "Science-fiction", "Futuriste", "Obsession"], "annee": "2026", "couleur": "#2b2b33", "statut": "En cours", "resume": "Vesper, 2049. Chaque citoyen porte un score, et le score se propage : un cousin condamné, une facture impayée, et Ilya tombe à 412 en servant un café. Un homme à 940 lui propose de porter son risque pendant un an, chez lui, selon un contrat de trente-deux pages qui ne dit pas ce qu'il attend d'elle. Il ne la touche pas. Il la regarde. Et dans trois pièces fermées, dix cartons portent les noms de celles qui l'ont précédée. Avertissements : rapport de pouvoir déséquilibré, surveillance, obsession.", "chapitres": [], "couv": true}, {"id": "braises", "titre": "La Saison des Braises", "serie": "Les Trois Cents Lieues — tome 1", "auteur": "Écrit avec Claude", "genres": ["Romance sensuelle", "Fantasy", "Enemies to lovers", "Slow burn", "Série"], "annee": "2026", "couleur": "#8a3a1f", "statut": "En cours", "resume": "Ysée Marrec ne dessine que ce qu'elle a vu, et la carte du Nord se termine en blanc : trois cents lieues au-delà de la Ligne des Cendres, là où la terre brûle depuis quatre-vingts ans. Pour la traverser, la Guilde lui donne un seul guide — Cael, un Braise, un homme que le feu a touché sans le tuer et qui ne connaît pas le froid. Ce qu'on ne lui a pas dit : la Ligne ne laisse passer que ceux qu'un Braise porte dans sa chaleur. Assez près. Pendant trois jours.", "chapitres": [], "couv": true}, {"id": "verre", "titre": "La Dette de Verre", "auteur": "Écrit avec Claude", "genres": ["Romance", "Héritage", "Secret de famille", "Drame"], "annee": "2026", "couleur": "#1f4a52", "statut": "En cours", "resume": "Directrice générale du groupe hôtelier Valadares, Nour Belkacem hérite de trente-quatre pour cent des parts — à condition d'être encore en poste le jour de la mort du patriarche. Le fils revenu d'exil veut sa révocation. Une lettre laissée sous scellés lui apprend pourquoi ce legs n'était pas un cadeau, mais une dette : en 1997, Henrique Valadares a ruiné son père. À Lisbonne, tout le monde a de bonnes raisons.", "chapitres": [], "couv": true}];
BOOKS.find(b => b.id === 'castellano').chapitres = CASTELLANO_P1.concat(CASTELLANO_P2, CASTELLANO_P3, CASTELLANO_P4);
BOOKS.find(b => b.id === 'vesper').chapitres = DATA_VESPER;
BOOKS.find(b => b.id === 'braises').chapitres = DATA_BRAISES;
BOOKS.find(b => b.id === 'verre').chapitres = DATA_VERRE;

const app = document.getElementById('app'), $ = id => document.getElementById(id);
const KEY = 'liseuse:v2';
const THEMES = ['clair','sepia','nuit'];
const TAILLES = [17, 18.5, 20, 23, 26];      // px
const INTERLIGNES = [1.5, 1.62, 1.72, 1.85, 2];
let S = { theme:'clair', taille:2, inter:2, dernier:null, livres:{} };
let vue = 'lib', livre = null, ready = false, filtre = null;

function etat(id){
  if (!S.livres[id]) S.livres[id] = { chap:0, scroll:0, bookmarks:[], vus:[] };
  return S.livres[id];
}
function toast(m){ const t=$('toast'); t.textContent=m; t.classList.add('show');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),1900); }

/* ---- styles injectés (thème sépia + réglages de lecture) ---- */
(function injecterStyles(){
  const s = document.createElement('style');
  s.textContent = `
  #app.sepia { --ink:#4a3b2c; --paper:#f4ecd8; --paper-deep:#eadfc4;
    --brass:#9a7b3f; --muted:#7d6a52; --rule:#ddceae; }
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
  .bmacts { display:flex; gap:14px; }`;
  document.head.appendChild(s);
})();

function appliquerTheme(){
  THEMES.forEach(t => app.classList.toggle(t, S.theme === t));
  app.classList.toggle('night', S.theme === 'nuit');   // compat règles existantes
  $('nightBtn').classList.toggle('on', S.theme !== 'clair');
  $('nightBtn').title = 'Thème : ' + S.theme;
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = S.theme==='nuit' ? '#14161a' : (S.theme==='sepia' ? '#f4ecd8' : '#f0ece4');
}
function appliquerLecture(){
  app.style.setProperty('--taille', TAILLES[S.taille] + 'px');
  app.style.setProperty('--inter', INTERLIGNES[S.inter]);
  const vt = $('valTaille'), vi = $('valInter');
  if (vt) vt.textContent = TAILLES[S.taille] + 'px';
  if (vi) vi.textContent = INTERLIGNES[S.inter].toFixed(2);
  ['tMoins','tPlus','iMoins','iPlus'].forEach(id => { const b=$(id); if(!b) return;
    b.disabled = (id==='tMoins' && S.taille===0) || (id==='tPlus' && S.taille===TAILLES.length-1)
              || (id==='iMoins' && S.inter===0)  || (id==='iPlus' && S.inter===INTERLIGNES.length-1); });
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
    }
    if (S.night !== undefined) { if (!S.theme || S.theme==='clair') S.theme = S.night ? 'nuit' : 'clair'; delete S.night; }
    if (!THEMES.includes(S.theme)) S.theme = 'clair';
    if (typeof S.taille !== 'number' || !TAILLES[S.taille]) S.taille = 2;
    if (typeof S.inter !== 'number' || !INTERLIGNES[S.inter]) S.inter = 2;
    localStorage.setItem('liseuse:test','1'); localStorage.removeItem('liseuse:test');
    $('statusNote').textContent = 'Progression, réglages et marque-pages enregistrés sur cet appareil.';
  } catch(e){ $('statusNote').textContent = 'Sauvegarde indisponible (navigation privée ?) : rien ne sera conservé.'; }
  ready = true;
}
function save(){ if(!ready) return; try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

/* ---- temps de lecture ---- */
function motsDe(c){ return c.p.join(' ').split(/\s+/).length; }
function minutesDe(c){ return Math.max(1, Math.round(motsDe(c)/220)); }
function duree(min){ if (min < 60) return min + ' min';
  const h = Math.floor(min/60), r = min%60; return r ? h+' h '+r : h+' h'; }

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
function couverture(b, petit){
  if (b.couv) { const s = svgDe(b.id);
    if (s) return `<div class="cover" style="padding:0;background:#0b0f1e">${s}</div>`; }
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
  box.innerHTML = `<small>Reprendre ma lecture</small><b>${b.titre}</b>
    <em>Chapitre ${c.n} · ${c.t} · ${duree(minutesDe(c))}</em>`;
  box.onclick = () => { livre = b; app.style.setProperty('--accent', b.couleur); aller('read', true); };
}

function renderLib(){
  $('libCount').textContent = BOOKS.length + (BOOKS.length>1 ? ' livres' : ' livre');
  renderReprise();
  $('chips').innerHTML = tousGenres().map(g=>`<button class="chip ${filtre===g?'on':''}" data-g="${g}">${g}</button>`).join('');
  [...$('chips').querySelectorAll('[data-g]')].forEach(c=>{
    c.onclick = () => { filtre = (filtre===c.dataset.g ? null : c.dataset.g); renderLib(); };
  });
  const q = $('search').value.trim().toLowerCase();
  const res = BOOKS.filter(b=>{
    const okG = !filtre || b.genres.includes(filtre);
    const hay = (b.titre+' '+b.auteur+' '+b.genres.join(' ')+' '+b.resume).toLowerCase();
    return okG && (!q || hay.includes(q));
  });
  $('noRes').style.display = res.length ? 'none' : '';
  $('grid').innerHTML = res.map(b=>{
    const p = pct(b);
    return `<button class="card" data-b="${b.id}">${couverture(b)}
      <div class="cmeta"><b>${b.titre}</b>${b.serie ? `<div class="cpct" style="margin-top:3px">${b.serie}</div>` : ''}
        <div class="cbar"><i style="width:${p}%"></i></div>
        <div class="cpct">${p} % lu · ${b.statut}</div></div></button>`;
  }).join('');
  [...$('grid').querySelectorAll('[data-b]')].forEach(c=>{
    c.onclick = () => ouvrirLivre(c.dataset.b);
  });
}
$('search').oninput = renderLib;

/* ---- page de garde ---- */
function ouvrirLivre(id){
  livre = BOOKS.find(b=>b.id===id);
  app.style.setProperty('--accent', livre.couleur);
  const e = etat(id), p = pct(livre);
  $('gCover').innerHTML = couverture(livre);
  $('gTitle').textContent = livre.titre;
  $('gAuth').textContent = (livre.serie ? livre.serie.toUpperCase() + '  ·  ' : '') + livre.auteur.toUpperCase();
  $('gChips').innerHTML = [livre.statut, ...livre.genres].map(g=>`<span>${g}</span>`).join('');
  $('gRes').textContent = livre.resume;
  $('gPct').textContent = p + ' %';
  $('gBar').style.width = p + '%';
  const restant = livre.chapitres.reduce((t,c,i) => t + (e.vus.includes(i) ? 0 : minutesDe(c)), 0);
  $('gLab').textContent = !livre.chapitres.length ? 'En préparation · aucun chapitre publié'
    : p===0 ? livre.chapitres.length + ' chapitres · ' + duree(restant) + ' de lecture'
    : (p===100 ? 'Terminé · ' + livre.chapitres.length + ' chapitres'
    : 'Chapitre ' + livre.chapitres[e.chap].n + ' sur ' + livre.chapitres.length + ' · ' + duree(restant) + ' restantes');
  const vide = !livre.chapitres.length;
  $('readBtn').textContent = vide ? 'Bientôt disponible' : (p===0 ? 'Commencer la lecture' : 'Reprendre au chapitre ' + livre.chapitres[e.chap].n);
  $('readBtn').disabled = vide; $('readBtn').style.opacity = vide ? '.45' : '';
  $('tocBtn').style.display = vide ? 'none' : '';
  $('resetBtn').style.display = p===0 ? 'none' : '';
  aller('cover');
}

function aller(v, restore){
  vue = v;
  $('vLib').classList.toggle('on', v==='lib');
  $('vCover').classList.toggle('on', v==='cover');
  $('vRead').classList.toggle('on', v==='read');
  $('backBtn').style.display = v==='lib' ? 'none' : '';
  $('menuBtn').style.display = v==='read' ? '' : 'none';
  $('bmBtn').style.display = v==='read' ? '' : 'none';
  $('barTitle').textContent = v==='lib' ? 'Bibliothèque'
    : (v==='cover' ? livre.titre : 'Ch. ' + (livre.chapitres[etat(livre.id).chap]||{n:''}).n);
  if (v==='read') renderChap(restore); else { $('progBar').style.width = '0'; window.scrollTo(0,0); }
  if (v==='lib') { livre = null; app.style.setProperty('--accent', '#6d1f2c'); renderLib(); }
}

/* ---- lecture ---- */
function renderChap(restore){
  const e = etat(livre.id), c = livre.chapitres[e.chap];
  $('chapNum').textContent = 'Chapitre ' + c.n + '  ·  ' + duree(minutesDe(c));
  $('chapTitle').textContent = c.t;
  $('chapPov').textContent = 'Point de vue — ' + c.pov;
  $('chapBody').innerHTML = c.p.map((t,i)=>`<p data-i="${i}">${t}</p>`).join('');
  $('barTitle').textContent = 'Ch. ' + c.n + ' · ' + c.t;
  $('prevBtn').disabled = e.chap===0;
  $('nextBtn').disabled = e.chap===livre.chapitres.length-1;
  if (!e.vus.includes(e.chap)) e.vus.push(e.chap);
  S.dernier = { id: livre.id, date: Date.now() };
  save();
  buildChaps(); buildBms(); updateBm();
  window.scrollTo(0, restore ? (e.scroll||0) : 0);
  updateProgress();
}
function updateProgress(){
  if (vue!=='read') return;
  const e = etat(livre.id);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const dans = h>0 ? Math.min(window.scrollY/h,1) : 0;
  $('progBar').style.width = ((e.chap+dans)/livre.chapitres.length*100).toFixed(1) + '%';
}
function paraCourant(){
  const ps = [...document.querySelectorAll('#chapBody p')], mid = innerHeight*0.3;
  let best = 0; ps.forEach((p,i)=>{ if (p.getBoundingClientRect().top<=mid) best=i; }); return best;
}
function updateBm(){ const e=etat(livre.id); $('bmBtn').classList.toggle('on', e.bookmarks.some(b=>b.chap===e.chap)); }
function toggleBm(){
  const e = etat(livre.id), para = paraCourant();
  const i = e.bookmarks.findIndex(b=>b.chap===e.chap && b.para===para);
  if (i>-1){ e.bookmarks.splice(i,1); toast('Marque-page retiré'); }
  else {
    const t = livre.chapitres[e.chap].p[para]||'';
    let note = '';
    try { note = (prompt('Note pour ce marque-page (facultatif) :', '') || '').trim(); } catch(err){}
    e.bookmarks.push({ chap:e.chap, para, note, extrait:t.slice(0,90)+(t.length>90?'…':''),
      date:new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) });
    e.bookmarks.sort((a,b)=>a.chap-b.chap||a.para-b.para);
    toast(note ? 'Marque-page et note enregistrés' : 'Marque-page posé — chapitre ' + livre.chapitres[e.chap].n);
  }
  updateBm(); buildBms(); save();
}
function buildChaps(){
  const e = etat(livre.id);
  $('dTitle').textContent = livre.titre;
  $('paneChaps').innerHTML = livre.chapitres.map((c,i)=>
    `<button class="chapline ${i===e.chap?'current':''}" data-go="${i}">
      <em>Chapitre ${c.n} · ${c.pov} · ${duree(minutesDe(c))}${e.vus.includes(i)?' · lu':''}</em>${c.t}</button>`).join('');
  [...$('paneChaps').querySelectorAll('[data-go]')].forEach(b=>{
    b.onclick = () => { e.chap = +b.dataset.go; e.scroll = 0; save(); fermer(); aller('read', false); };
  });
}
function buildBms(){
  const e = etat(livre.id), pane = $('paneBms');
  if (!e.bookmarks.length){ pane.innerHTML = '<p class="empty">Aucun marque-page. Touchez ✦ en haut pour marquer le passage où vous êtes.</p>'; return; }
  pane.innerHTML = e.bookmarks.map((b,i)=>
    `<div><button class="bmrow" data-bm="${i}"><small>Chapitre ${livre.chapitres[b.chap].n} · ${b.date}</small>
      <span>« ${b.extrait} »</span>${b.note ? `<span class="bmnote">${b.note}</span>` : ''}</button>
      <div class="bmacts"><button class="del" data-note="${i}">${b.note ? 'Modifier la note' : 'Ajouter une note'}</button>
      <button class="del" data-del="${i}">Supprimer</button></div></div>`).join('');
  [...pane.querySelectorAll('[data-bm]')].forEach(x=>{
    x.onclick = () => { const bm = e.bookmarks[+x.dataset.bm]; e.chap = bm.chap; save(); fermer(); aller('read', false);
      setTimeout(()=>{ const p = document.querySelector(`#chapBody p[data-i="${bm.para}"]`);
        if (p) p.scrollIntoView({behavior:'smooth',block:'center'}); }, 60); };
  });
  [...pane.querySelectorAll('[data-note]')].forEach(x=>{
    x.onclick = () => { const bm = e.bookmarks[+x.dataset.note];
      let n = null; try { n = prompt('Note pour ce marque-page :', bm.note || ''); } catch(err){}
      if (n === null) return;
      bm.note = n.trim(); buildBms(); save(); toast(bm.note ? 'Note enregistrée' : 'Note supprimée'); };
  });
  [...pane.querySelectorAll('[data-del]')].forEach(x=>{
    x.onclick = () => { e.bookmarks.splice(+x.dataset.del,1); buildBms(); updateBm(); save(); toast('Marque-page supprimé'); };
  });
}

/* ---- contrôles ---- */
function ouvrir(){ $('drawer').classList.add('open'); $('scrim').classList.add('open'); }
function fermer(){ $('drawer').classList.remove('open'); $('scrim').classList.remove('open'); }
$('menuBtn').onclick = ouvrir; $('closeBtn').onclick = fermer; $('scrim').onclick = fermer;
$('tocBtn').onclick = () => { buildChaps(); buildBms(); ouvrir(); };
$('bmBtn').onclick = toggleBm;
$('backBtn').onclick = () => { if (vue==='read') ouvrirLivre(livre.id); else aller('lib'); };
$('readBtn').onclick = () => aller('read', true);
$('resetBtn').onclick = () => {
  if (!confirm('Effacer votre progression et vos marque-pages pour ce livre ?')) return;
  S.livres[livre.id] = { chap:0, scroll:0, bookmarks:[], vus:[] };
  if (S.dernier && S.dernier.id === livre.id) S.dernier = null;
  save(); ouvrirLivre(livre.id); toast('Progression réinitialisée');
};
$('nightBtn').onclick = () => {
  S.theme = THEMES[(THEMES.indexOf(S.theme)+1) % THEMES.length];
  appliquerTheme(); save();
  toast('Thème ' + (S.theme==='clair' ? 'clair' : S.theme==='sepia' ? 'sépia' : 'nuit'));
};
$('prevBtn').onclick = () => { const e=etat(livre.id); if(e.chap>0){ e.chap--; e.scroll=0; save(); renderChap(false); } };
$('nextBtn').onclick = () => { const e=etat(livre.id); if(e.chap<livre.chapitres.length-1){ e.chap++; e.scroll=0; save(); renderChap(false); } };
$('tabChaps').onclick = () => { $('tabChaps').classList.add('on'); $('tabBms').classList.remove('on');
  $('paneChaps').style.display=''; $('paneBms').style.display='none'; };
$('tabBms').onclick = () => { $('tabBms').classList.add('on'); $('tabChaps').classList.remove('on');
  $('paneBms').style.display=''; $('paneChaps').style.display='none'; };

/* ---- éléments ajoutés au DOM ---- */
(function monterUI(){
  // carte « Reprendre » en tête de bibliothèque
  const box = document.createElement('button');
  box.className = 'reprise'; box.id = 'reprise'; box.style.display = 'none';
  $('libCount').insertAdjacentElement('afterend', box);

  // réglages de lecture en tête du tiroir
  const r = document.createElement('div');
  r.className = 'reglages';
  r.innerHTML = `<h4>Confort de lecture</h4>
    <div class="rline"><span>Taille du texte</span>
      <button class="rbtn" id="tMoins">A−</button>
      <span class="rval" id="valTaille"></span>
      <button class="rbtn" id="tPlus">A+</button></div>
    <div class="rline"><span>Interligne</span>
      <button class="rbtn" id="iMoins">−</button>
      <span class="rval" id="valInter"></span>
      <button class="rbtn" id="iPlus">+</button></div>`;
  document.querySelector('.tabs').insertAdjacentElement('beforebegin', r);

  $('tMoins').onclick = () => { if (S.taille>0){ S.taille--; appliquerLecture(); save(); } };
  $('tPlus').onclick  = () => { if (S.taille<TAILLES.length-1){ S.taille++; appliquerLecture(); save(); } };
  $('iMoins').onclick = () => { if (S.inter>0){ S.inter--; appliquerLecture(); save(); } };
  $('iPlus').onclick  = () => { if (S.inter<INTERLIGNES.length-1){ S.inter++; appliquerLecture(); save(); } };
})();

let tmr;
addEventListener('scroll', () => {
  if (vue!=='read') return;
  updateProgress(); updateBm();
  etat(livre.id).scroll = scrollY;
  clearTimeout(tmr); tmr = setTimeout(save, 600);
}, {passive:true});
addEventListener('keydown', e => {
  if (vue==='read'){ if(e.key==='ArrowRight') $('nextBtn').click(); if(e.key==='ArrowLeft') $('prevBtn').click(); }
  if (e.key==='Escape') fermer();
});

load(); appliquerTheme(); appliquerLecture(); renderLib();
