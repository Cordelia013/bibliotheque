# Architecture de la liseuse

Ce document décrit le moteur de lecture de `docs/` pour qu'il puisse être repris, redéveloppé et
distribué indépendamment des textes qu'il sert ici. Il fait foi sur le contrat entre le
générateur et l'application.

## 1. Deux moitiés qui ne se touchent pas

| Moitié | Fichiers | Qui l'écrit |
|---|---|---|
| **Le moteur** | `docs/index.html`, `docs/app.js`, `docs/sw.js`, `docs/manifest.json`, icônes | à la main, comme du code |
| **Le contenu** | `docs/catalogue.json`, `docs/data-<id>-pN.json`, couvertures | `maj_bibliotheque.py`, depuis `chapitres/`, `couvertures/`, `personnages.json` |

Le moteur ne contient aucun titre, aucun texte, aucune fiche. Le contenu ne contient aucun
code. Un seul point de contact subsiste : le bloc `<div id="couvertures" hidden>` d'`index.html`,
dans lequel le générateur injecte les couvertures SVG — parce que le dépôt ne peut publier que
du texte.

Pour réutiliser le moteur avec d'autres livres : produire un `catalogue.json` et des morceaux
conformes à la section 2, déposer le tout dans un dossier statique, servir. Aucun serveur
applicatif, aucune dépendance de construction.

## 2. Le contrat de données

### `catalogue.json`

```json
{
  "format": 3,
  "genere": "2026-09-20",
  "livres": [
    {
      "id": "braises",
      "titre": "La Saison des Braises",
      "serie": "Les Trois Cents Lieues — tome 1",
      "auteur": "…",
      "genres": ["Romance sensuelle", "Fantasy"],
      "annee": "2026",
      "couleur": "#8a3a1f",
      "statut": "En cours",
      "resume": "…",
      "couv": true,
      "couvImage": "couvertures/braises.svg",
      "maj": "2026-09-19",
      "chapitres": [ { "n": 1, "t": "Ce qu'on n'a pas vu", "pov": "Ysée", "mots": 812 }, … ],
      "morceaux":  [ { "url": "data-braises-p1.json?v=1a2b3c4d", "de": 0, "a": 5 }, … ],
      "personnages": [ { "nom": "…", "role": "…", "texte": "…" } ],
      "parties": [ { "titre": "Acte I", "debut": 1 } ]
    }
  ]
}
```

- `format` — version du contrat. Le moteur avertit dans la console si elle ne correspond pas à
  la sienne (`FORMAT_CATALOGUE`), et tente quand même.
- `genere` — date du dernier changement de texte, tous livres confondus. Relancer le générateur
  un autre jour sans rien changer ne réécrit pas le catalogue.
- `id` — identifiant stable, `[a-z0-9-]`. Il sert de clé au stockage local et aux adresses ;
  **le changer perd la progression des lecteurs**.
- `chapitres` — l'**index** : tout ce qu'il faut pour afficher la bibliothèque, la page de garde
  et le sommaire sans un mot du texte. `n` est un entier ou un texte (« 39 bis »). `mots` sert
  au temps de lecture.
- `morceaux` — les fichiers de texte, avec les indices (dans `chapitres`) du premier et du
  dernier chapitre qu'ils couvrent. L'`url` est relative au dossier servi et porte une version :
  **une adresse donnée ne change jamais de contenu**.
- `couv` — vrai si `index.html` porte une couverture SVG pour ce livre. `couvImage` — chemin
  d'une couverture en image, prioritaire ; en cas d'échec de chargement, la SVG reprend.
- `maj` — date de dernier changement de texte, ou `null`. Affichée sur les livres en cours.
- `parties` — facultatif : regroupe le sommaire en actes.

### `data-<id>-pN.json`

Un tableau de chapitres, dans l'ordre de l'index :

```json
[
  { "n": 1, "t": "Ce qu'on n'a pas vu", "pov": "Ysée",
    "p": ["Paragraphe…", "Paragraphe…"],
    "s": [5, 16] }
]
```

- `p` — les paragraphes, texte brut. Un paragraphe commençant par un tiret est une réplique.
- `s` — les indices des paragraphes **après** lesquels tombe une coupure de scène. Ils voyagent
  avec les paragraphes qu'ils indexent : c'est ce qui garantit qu'ils ne viendront jamais d'une
  autre publication que le texte.

Le moteur vérifie `n` à la réception et pose `p` et `s` sur l'entrée d'index correspondante.

## 3. Ce que la liseuse télécharge

| Moment | Requêtes |
|---|---|
| Première visite | `index.html`, `app.js`, `catalogue.json`, polices, couvertures affichées |
| Ouverture d'un livre | rien de plus : la page de garde et le sommaire viennent de l'index |
| Lecture d'un chapitre | le morceau qui le contient, une fois |
| Pendant la lecture | le morceau suivant tout de suite ; le reste du livre une fois un premier chapitre lu en entier, quand le navigateur est oisif — **sauf** si l'appareil demande l'économie de données (`navigator.connection.saveData`) |

Avant cette architecture, la page chargeait le texte intégral de tous les livres (531 Ko, 173 Ko
compressés) avant d'afficher quoi que ce soit, et le service worker les retéléchargeait tous à
l'installation.

## 4. Le service worker

- **Précache** à l'installation : la coquille — page, script, manifeste, icônes — puis le
  catalogue, lu au passage pour mettre en cache les couvertures en image qu'il déclare. Le
  service worker ne nomme aucun livre.
- **Réseau d'abord** pour la coquille : une publication est visible au rechargement suivant ; le
  cache sert de repli hors ligne.
- **Cache d'abord, définitif** pour les morceaux : leur adresse est versionnée par le contenu.
  Quand un catalogue frais arrive, les morceaux qu'il ne cite plus sont retirés du cache.
- **Cache d'abord, rafraîchi en silence** pour les images.
- `VERSION` ne change que si le code devient incompatible avec ce que d'anciens caches
  pourraient servir. Une publication de texte ne la change pas.

Conséquence pour la lecture hors ligne : un livre dont on a lu un chapitre se retrouve entier
en cache (préchargement à l'oisiveté) ; un livre seulement ouvert ne l'est pas. C'est un choix : la
bibliothèque coûte au premier visiteur ce qu'il lit, pas ce qu'elle contient.

## 5. Le stockage local

Clé `liseuse:v2` dans `localStorage`, un seul objet :

```json
{ "theme": "clair|sepia|nuit", "taille": 2, "inter": 2, "align": "gauche|justifie",
  "dernier": { "id": "braises", "date": 0 }, "visite": 0,
  "connus": { "braises": 52 },
  "livres": { "braises": { "chap": 12, "scroll": 1480, "vus": [0, 1, …],
                           "bookmarks": [ { "chap": 3, "para": 8, "note": "", "extrait": "…", "date": "…" } ] } } }
```

`chap` et `para` sont des **indices** dans `chapitres` et dans `p`. Une position hors du livre —
chapitre retiré — est ramenée au dernier chapitre publié à la lecture de l'état ; un marque-page
qui pointe hors du livre est abandonné. Une renumérotation des chapitres décale toutes les
positions : c'est la limite d'un stockage par indices, à garder en tête avant d'insérer ou de
fusionner des chapitres dans un livre déjà lu. Le stockage est
lié à l'origine : changer d'adresse remet la progression à zéro pour le lecteur.

## 6. Ce qu'il resterait à faire pour une version publique

Par ordre d'importance.

1. **Choisir une licence pour le moteur.** Le dépôt réserve tous droits sur les textes et les
   illustrations et ne dit rien du code. Une version distribuable doit trancher : licence libre
   sur `docs/*.js` et `index.html`, contenu à part.
2. **Sortir les polices du réseau.** `index.html` importe deux familles depuis Google Fonts —
   plusieurs fichiers par visite, non mis en cache par le service worker (origine tierce) et
   dépendants d'un tiers. Les héberger en sous-ensemble WOFF2 dans `docs/` diviserait le poids
   restant de la première visite et rendrait la coquille entièrement hors ligne. Décision de
   design : la typographie fait partie de la direction validée (`plans/liseuse-design.md`).
3. **Séparer le style du moteur.** Les styles sont dans `index.html` et dans `app.js` (injectés).
   Une feuille `liseuse.css` à part rendrait le thème remplaçable sans toucher au code.
4. **Rendre le texte du moteur traduisible.** Les libellés (« Reprendre ma lecture »,
   « Chapitre suivant ») sont en dur dans `app.js`.
5. **Tests.** `scripts/fumee_liseuse.js` joue le parcours d'un lecteur dans un vrai navigateur
   (bibliothèque, page de garde, lecture, coupures, hors ligne, poids téléchargé). Il demande
   Playwright, seule dépendance non standard du dépôt, et n'est pas branché sur une
   intégration continue.
6. **Rendre l'italique.** Le générateur retire les marques `*…*` et `**…**` des paragraphes
   depuis l'origine ; les manuscrits en font grand usage (près de deux cents passages dans
   *La Saison des Braises*). Les conserver suppose de les transporter dans les morceaux —
   sous une forme neutre, par exemple des balises `<em>` après échappement — et de les rendre
   dans le moteur comme dans les EPUB, où `page_chapitre` échappe aujourd'hui tout le texte.
7. **Échapper le texte.** Le moteur insère chaque paragraphe tel quel dans le HTML
   (`renderChap`). Les manuscrits ne contiennent ni `<` ni entité — seulement quelques `&`
   isolés, que les navigateurs tolèrent —, mais un jour un chapitre en contiendra. À traiter
   avec le point précédent : échapper d'abord, marquer l'italique ensuite.
8. **Décider du sort des fiches personnages.** Elles vivent dans `personnages.json` à la
   racine, écrites à la main, recopiées dans le catalogue. Une version publique pourrait les
   tirer d'un fichier par livre à côté des chapitres.

## 7. Ce qui ne change pas d'une publication à l'autre

- Les identifiants de livres et l'ordre des chapitres (donc la progression des lecteurs).
- Le nom des morceaux (`data-<id>-pN.json`) : seule la version dans l'adresse bouge.
- `index.html` hors bloc des couvertures, `app.js`, `sw.js`.
