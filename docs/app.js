const BOOKS = [{"id": "castellano", "titre": "Le Prix du Silence, Don Castellano", "auteur": "Écrit avec Claude", "genres": ["Romance mafieuse", "Vengeance", "Drame", "Suspense"], "annee": "2026", "couleur": "#6d1f2c", "statut": "Terminé", "resume": "Livia Sarti est la consigliere de la famille Castellano et, depuis trois ans, l'épouse secrète de son Don. Une balle sur le quai nord, un appel auquel il répond sans savoir que c'est elle, et tout s'écroule. Elle rend les clés, demande le divorce devant vingt-deux couverts, et s'allie à la famille rivale. Sept ans pour comprendre qu'on n'attend pas qu'on écrive votre nom quelque part : on l'écrit.", "chapitres": [], "couv": true}, {"id": "lune", "titre": "La Part de Lune", "serie": "Les Deux Collines — tome 1", "auteur": "Écrit avec Claude", "genres": ["Urban fantasy", "Romance paranormale", "Loups & Lycans", "Âmes sœurs", "Série"], "annee": "2026", "couleur": "#1c2445", "statut": "À venir", "resume": "Lyon, aujourd'hui. Sous les traboules, deux meutes se partagent les collines, et des femmes appelées Lieuses constatent les liens que personne n'a choisis. Maël, aide-soignante de nuit, est frappée par un lien d'âmes sœurs le soir où un Alpha lui amène un loup qui n'en est pas un — et rejetée par lui devant le Concile trois jours plus tard. Ce qu'on ne lui a pas dit : le Rejet est irrévocable pour celui qui le prononce. Pas pour celle qui le reçoit.", "chapitres": [], "couv": true}, {"id": "vesper", "titre": "Le Contrat de Vesper", "auteur": "Écrit avec Claude", "genres": ["Dark romance", "Science-fiction", "Futuriste", "Obsession"], "annee": "2026", "couleur": "#2b2b33", "statut": "En cours", "resume": "Vesper, 2049. Chaque citoyen porte un score, et le score se propage : un cousin condamné, une facture impayée, et Ilya tombe à 412 en servant un café. Un homme à 940 lui propose de porter son risque pendant un an, chez lui, selon un contrat de trente-deux pages qui ne dit pas ce qu'il attend d'elle. Il ne la touche pas. Il la regarde. Et dans trois pièces fermées, dix cartons portent les noms de celles qui l'ont précédée. Avertissements : rapport de pouvoir déséquilibré, surveillance, obsession.", "chapitres": [], "couv": true}, {"id": "braises", "titre": "La Saison des Braises", "serie": "Les Trois Cents Lieues — tome 1", "auteur": "Écrit avec Claude", "genres": ["Romance sensuelle", "Fantasy", "Enemies to lovers", "Slow burn", "Série"], "annee": "2026", "couleur": "#8a3a1f", "statut": "En cours", "resume": "Ysée Marrec ne dessine que ce qu'elle a vu, et la carte du Nord se termine en blanc : trois cents lieues au-delà de la Ligne des Cendres, là où la terre brûle depuis quatre-vingts ans. Pour la traverser, la Guilde lui donne un seul guide — Cael, un Braise, un homme que le feu a touché sans le tuer et qui ne connaît pas le froid. Ce qu'on ne lui a pas dit : la Ligne ne laisse passer que ceux qu'un Braise porte dans sa chaleur. Assez près. Pendant trois jours.", "chapitres": [], "couv": true}, {"id": "verre", "titre": "La Dette de Verre", "auteur": "Écrit avec Claude", "genres": ["Romance", "Héritage", "Secret de famille", "Drame"], "annee": "2026", "couleur": "#1f4a52", "statut": "En cours", "resume": "Directrice générale du groupe hôtelier Valadares, Nour Belkacem hérite de trente-quatre pour cent des parts — à condition d'être encore en poste le jour de la mort du patriarche. Le fils revenu d'exil veut sa révocation. Une lettre laissée sous scellés lui apprend pourquoi ce legs n'était pas un cadeau, mais une dette : en 1997, Henrique Valadares a ruiné son père. À Lisbonne, tout le monde a de bonnes raisons.", "chapitres": [], "couv": true}];
BOOKS.find(b => b.id === 'castellano').chapitres = CASTELLANO_P1.concat(CASTELLANO_P2, CASTELLANO_P3, CASTELLANO_P4);
BOOKS.find(b => b.id === 'vesper').chapitres = DATA_VESPER;
BOOKS.find(b => b.id === 'braises').chapitres = DATA_BRAISES;
BOOKS.find(b => b.id === 'verre').chapitres = DATA_VERRE;

const app = document.getElementById('app'), $ = id => document.getElementById(id);
const KEY = 'liseuse:v2';
let S = { night:false, livres:{} };   // livres[id] = {chap, scroll, bookmarks[], vus[]}
let vue = 'lib', livre = null, ready = false, filtre = null;

function etat(id){
  if (!S.livres[id]) S.livres[id] = { chap:0, scroll:0, bookmarks:[], vus:[] };
  return S.livres[id];
}
function toast(m){ const t=$('toast'); t.textContent=m; t.classList.add('show');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),1900); }

function load(){
  try {
    const brut = localStorage.getItem(KEY);
    if (brut) Object.assign(S, JSON.parse(brut));
    else {
      try { const old = localStorage.getItem('castellano:etat');
        if (old){ const o = JSON.parse(old);
          S.night = !!o.night;
          S.livres.castellano = { chap:o.chap||0, scroll:o.scroll||0, bookmarks:o.bookmarks||[], vus:[] };
          for (let i=0;i<=(o.chap||0);i++) S.livres.castellano.vus.push(i);
        }
      } catch(e){}
    }
    localStorage.setItem('liseuse:test', '1'); localStorage.removeItem('liseuse:test');
    $('statusNote').textContent = 'Progression et marque-pages enregistrés automatiquement sur cet appareil.';
  } catch(e){ $('statusNote').textContent = 'Sauvegarde indisponible (navigation privée ?) : la progression ne sera pas conservée.'; }
  ready = true;
}
function save(){ if(!ready) return; try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

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

function renderLib(){
  $('libCount').textContent = BOOKS.length + (BOOKS.length>1 ? ' livres' : ' livre');
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
  $('gLab').textContent = !livre.chapitres.length ? 'En préparation · aucun chapitre publié'
    : p===0 ? 'Jamais ouvert · ' + livre.chapitres.length + ' chapitres'
    : (p===100 ? 'Terminé · ' + livre.chapitres.length + ' chapitres'
    : 'Lu · reprise au chapitre ' + livre.chapitres[e.chap].n + ' sur ' + livre.chapitres.length);
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
  $('chapNum').textContent = 'Chapitre ' + c.n;
  $('chapTitle').textContent = c.t;
  $('chapPov').textContent = 'Point de vue — ' + c.pov;
  $('chapBody').innerHTML = c.p.map((t,i)=>`<p data-i="${i}">${t}</p>`).join('');
  $('barTitle').textContent = 'Ch. ' + c.n + ' · ' + c.t;
  $('prevBtn').disabled = e.chap===0;
  $('nextBtn').disabled = e.chap===livre.chapitres.length-1;
  if (!e.vus.includes(e.chap)) { e.vus.push(e.chap); save(); }
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
    e.bookmarks.push({ chap:e.chap, para, extrait:t.slice(0,90)+(t.length>90?'…':''),
      date:new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) });
    e.bookmarks.sort((a,b)=>a.chap-b.chap||a.para-b.para);
    toast('Marque-page posé — chapitre ' + livre.chapitres[e.chap].n);
  }
  updateBm(); buildBms(); save();
}
function buildChaps(){
  const e = etat(livre.id);
  $('dTitle').textContent = livre.titre;
  $('paneChaps').innerHTML = livre.chapitres.map((c,i)=>
    `<button class="chapline ${i===e.chap?'current':''}" data-go="${i}">
      <em>Chapitre ${c.n} · ${c.pov}${e.vus.includes(i)?' · lu':''}</em>${c.t}</button>`).join('');
  [...$('paneChaps').querySelectorAll('[data-go]')].forEach(b=>{
    b.onclick = () => { e.chap = +b.dataset.go; e.scroll = 0; save(); fermer(); aller('read', false); };
  });
}
function buildBms(){
  const e = etat(livre.id), pane = $('paneBms');
  if (!e.bookmarks.length){ pane.innerHTML = '<p class="empty">Aucun marque-page. Touchez ✦ en haut pour marquer le passage où vous êtes.</p>'; return; }
  pane.innerHTML = e.bookmarks.map((b,i)=>
    `<div><button class="bmrow" data-bm="${i}"><small>Chapitre ${livre.chapitres[b.chap].n} · ${b.date}</small>
      <span>« ${b.extrait} »</span></button><button class="del" data-del="${i}">Supprimer</button></div>`).join('');
  [...pane.querySelectorAll('[data-bm]')].forEach(x=>{
    x.onclick = () => { const bm = e.bookmarks[+x.dataset.bm]; e.chap = bm.chap; save(); fermer(); aller('read', false);
      setTimeout(()=>{ const p = document.querySelector(`#chapBody p[data-i="${bm.para}"]`);
        if (p) p.scrollIntoView({behavior:'smooth',block:'center'}); }, 60); };
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
  S.livres[livre.id] = { chap:0, scroll:0, bookmarks:[], vus:[] }; save(); ouvrirLivre(livre.id); toast('Progression réinitialisée');
};
$('nightBtn').onclick = () => { S.night = !S.night; app.classList.toggle('night', S.night);
  $('nightBtn').classList.toggle('on', S.night); save(); };
$('prevBtn').onclick = () => { const e=etat(livre.id); if(e.chap>0){ e.chap--; e.scroll=0; save(); renderChap(false); } };
$('nextBtn').onclick = () => { const e=etat(livre.id); if(e.chap<livre.chapitres.length-1){ e.chap++; e.scroll=0; save(); renderChap(false); } };
$('tabChaps').onclick = () => { $('tabChaps').classList.add('on'); $('tabBms').classList.remove('on');
  $('paneChaps').style.display=''; $('paneBms').style.display='none'; };
$('tabBms').onclick = () => { $('tabBms').classList.add('on'); $('tabChaps').classList.remove('on');
  $('paneBms').style.display=''; $('paneChaps').style.display='none'; };

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

load(); app.classList.toggle('night', !!S.night);
$('nightBtn').classList.toggle('on', !!S.night); renderLib();
