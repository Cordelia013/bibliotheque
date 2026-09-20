# Liseuse — règles de design

État au 19 septembre 2026. La **direction D · Veilleuse** est validée par l'autrice
et appliquée. Historique : passe de design (`8e622ed`), itération 2 (`7e2bb65`),
corrections d'accessibilité (`815f71d`), coupures de scène (`2ba93ed`), puis la
direction D avec les couvertures en image.

---

## Direction D · Veilleuse — la charte

Validée le 19 septembre 2026 après comparaison de quatre directions (A · L'Atelier,
B · La Page, C · La Collection, D · Veilleuse). Choisie pour sa typographie (reprise
de B) et son univers reconnaissable ; le beige de B a été écarté, et la direction a
été étendue du seul mode sombre à trois thèmes à la demande de l'autrice.

### Ce qui ne bouge jamais

- **L'aplat ambre** `#FFB25C` sur encre `#2A1A08` — contraste **9,42:1**, identique
  dans les trois thèmes. Il porte la carte « chapitre suivant », le bouton
  principal, le badge NOUVEAU, l'onglet et la pastille actifs. Un seul aplat par
  écran : le bouton de thème n'est plus rempli.
- **Deux familles, et deux seulement** : **Fraunces** pour les titres
  (`font-variation-settings: 'SOFT' 40, 'WONK' 1`), **Literata** pour tout le
  reste. Chargées par `app.js` (`chargerPolices()`), pas par `index.html`.
- **Le halo ambré** en tête de l'écran de lecture : `#app.lecture::before`, fixé à
  la fenêtre, qui commence sous la barre (`--barh`) et s'éteint sur 190 px.

Cormorant Garamond et Jost restent chargées par `index.html` : **les couvertures
SVG gardent leur propre dessin.** Ne pas y toucher.

### Les trois thèmes

Identifiants internes inchangés (`clair`, `sepia`, `nuit`), écrits dans le stockage
local des lecteurs. Noms affichés : Jour, Papier, Nuit.

| Jeton | **Jour** (`clair`) | **Papier** (`sepia`) | **Nuit** (`nuit`) |
|---|---|---|---|
| `--paper` | `#FCFCFD` | `#F3EADA` | `#0F1220` |
| `--paper-deep` | `#F1F2F6` | `#EADFC9` | `#191D30` |
| `--ink` | `#14151C` | `#23201A` | `#F2F1EE` |
| `--muted` | `#5A5D6B` | `#615A4C` | `#9B9FB3` |
| `--ambre-texte` | `#8F5410` | `#8A5310` | `#FFB25C` |
| `--rose` | `#A8305A` | `#A33256` | `#F08BA4` |
| `--rule` | `#E2E3EA` | `#E0D3BB` | `#2E3349` |
| `--rule-fort` | `#83868F` | `#857B66` | `#767C99` |

`--rule-fort` dessine les commandes (3:1 au moins) ; `--rule` reste au filet de
séparation.

### Les trois couleurs et ce qu'elles disent

- **L'ambre est la voix de la liseuse** : barre de progression, étiquette de
  chapitre, initiale d'ouverture, points de coupure de scène, chapitre en cours dans
  le sommaire, carte « chapitre suivant », bouton principal, onglet actif.
- **La couleur du livre reste au livre** : couverture, jauges (`.cbar i`, `.gbar i`),
  pourcentage de la page de garde (`.gpct`), filet gauche de la carte « Reprendre »,
  qui prend la couleur du livre repris (`--livre`, posé par `renderReprise()`).
- **Le rose est au lecteur** : icône de marque-page active, filet des notes, et le
  passage marqué dans le texte (`p.marque`, posée par `marquerPassages()`).

### Formes et échelles

- Angles : 8 px sur les commandes, 10 px sur les cartes et le bouton principal,
  20 px sur les pastilles, 14 px sur la feuille du bas, 4 px sur les couvertures.
- Corps : `TAILLES = [15.5, 16.5, 18, 20, 22.5]`, défaut 18 px.
  Interlignes : `[1.56, 1.67, 1.78, 1.9, 2.05]`, défaut 1,78.
- Colonne de texte : `--mesure: 30em` depuis le contre-audit (33 em auparavant).
- Cibles tactiles : 44 px partout, onglets du tiroir et boutons de réglage compris.
- Nombres : virgule décimale et espace insécable avant l'unité (`nombre()`).

---

## Couvertures en image

Un fichier par livre, JPEG 600 × 900, dans `docs/couvertures/`. `COUV_IMAGE` associe
un identifiant de livre à son fichier ; un livre déclaré bascule sur son image, les
autres gardent leur SVG. Si le fichier manque ou ne se charge pas, `couvRepli()`
rend la main au SVG d'origine. Pas de filet de tranche (`.cover::after`) sur une
image. Chargement différé ; les fichiers entrent dans le précache du service worker
(`liseuse-v5`).

Déclarés : `braises`, `castellano`. **Fichiers à déposer** : tant qu'ils manquent,
ces deux livres s'affichent avec leur SVG.

## Contre-audit du 19 septembre (commit `159eeb0`)

- **Panneau « Affichage »** : le bouton rond de la barre et la ligne « Affichage »
  du tiroir ouvrent une feuille basse sur fond transparent (`.fscrim.leger`,
  `.feuille.reglage`) : thème, taille, interligne, alignement. Les contrôles
  (`#rDetail`) vivent hors du DOM entre deux ouvertures (`panneauReglages`).
- **Livre commencé** (`commence()`) : toucher sa couverture ouvre le chapitre en
  cours ; la page de garde passe progression et action avant le résumé
  (`#vCover.commence`).
- **Nouveaux chapitres** : `S.connus[id]` garde le nombre de chapitres connus à la
  dernière ouverture du livre (`connaitre()`) ; la fiche affiche la différence
  (`nouveaux()`), en ambre, sans aplat. Le badge NOUVEAU et `estNouveau()` sont
  retirés.
- **Une seule mesure d'avancement** sur les fiches et la carte « Reprendre » : la
  position (« Chapitre 12 sur 52 » et sa jauge). Le pourcentage lu reste sur la
  page de garde, suivi de « lu ».
- **Fin de livre** : dernier paragraphe « FIN » en `p.finmanuscrit` ; pas de ligne
  d'état au dernier chapitre ; retour à la bibliothèque en bouton principal.
- **Sommaire** : `chapline.lu` porte une coche ; « lu » reste lisible par les
  lecteurs d'écran (`.vh`).
- **Bibliothèque** : titre et compteur masqués (la barre dit déjà
  « Bibliothèque ») ; genres sur une rangée à toutes les largeurs, défilables à la
  molette ; `.wrap` à 1 040 px au-delà de 900 px.
- **Colonne de lecture** : `--mesure: 30em`, à confirmer avec Literata chargée.
- **Note** : extrait coupé sur un mot ; compteur à partir de 200 signes.

Reste ouvert (lot B) : recherche plein texte, vue « Mes notes ».

---

## Où écrire

La feuille de style d'origine est dans `docs/index.html`, **à l'intérieur du corps
de la page**. Toute règle ajoutée par `docs/app.js` est injectée dans `<head>` : à
spécificité égale, celle du corps l'emporte. **Les règles injectées portent donc le
sélecteur `#app`**, et **`html #app`** pour la direction D, qui redéfinit des jetons
posés sur `#app` lui-même.

Une modification de design se fait dans `app.js` seul ; `index.html` (44 Ko, presque
tout en couvertures SVG) ne se republie pas. Les nouveaux éléments d'interface se
créent dans `monterUI()`. Les données du générateur s'écrivent aussi dans `app.js`,
sur leur propre ligne (`BOOKS`, `SEPARATEURS`).

## Couleurs — mécanique

`--accent` porte la couleur du livre. `--accent-texte` est calculé par
`poserAccent()` pour atteindre 4,5 contre `--paper-deep` ; il ne sert plus qu'à ce
que la direction D laisse au livre.

## Texte

- **Ouverture de chapitre** : initiale haussée dans la ligne (`<span class="cap">`),
  en ambre et en Fraunces ; paragraphe d'ouverture à `calc(var(--taille) * 1.1)`.
- **Répliques** : classe `dlg`, retrait pendant de 0,75 em, jamais justifiées.
- **Coupures de scène** : table `SEPARATEURS` écrite par le générateur ;
  `<div class="scene" aria-hidden="true">` rendu en trois points ambrés centrés sur
  la colonne.
- **Alignement** : à gauche par défaut, justifié avec césure en option (`S.align`).
- **Étiquette de chapitre** : ambre, capitales, 11 px, interlettrage 0,2 em.
- **Point de vue** : italique, gris de légende, 14 px, sans filet.

## Comportements (itération 2)

- Progression : un chapitre entre dans `vus` à 90 % de sa hauteur, ou par la carte
  de fin.
- Couvertures SVG : identifiants préfixés à chaque insertion (`idsUniques()`).
- Feuille du bas : `ouvrirFeuille()` / `fermerFeuille()` pour la note et la
  confirmation « Recommencer ce livre ».
- Adresses : `#/`, `#/livre/{id}`, `#/lire/{id}/{n}`.
- Barre masquée en mode immersif (`immersif` sur `#app`) ; classe `lecture` en vue
  de lecture, qui porte le halo.
- Navigation : carte « chapitre suivant », flèches, balayage latéral net.
- Statuts affichés : Roman complet, En cours d'écriture, À paraître.
- Sommaire ouvert sur le chapitre en cours ; clé facultative `parties`.

## Accessibilité

- Tiroir et feuilles : `role="dialog"`/`alertdialog`, `aria-modal`, focus gardé,
  rendu à la fermeture, Échap.
- Onglets : `role="tab"`, flèches, Début et Fin ; 44 px de haut.
- `#toast` en `role="status"`.
- Contour de focus : 2 px `--ink`, décalé de 2 px.

## Points ouverts

- **Polices hors ligne** : Fraunces et Literata viennent de Google Fonts, non mises
  en cache ; hors connexion, repli sur Georgia.
- **Mesure de colonne** à confirmer avec la police réellement chargée : les
  vérifications ont été faites sans accès à Google Fonts.
- **Couvertures** : `braises.jpg` et `castellano.jpg` à déposer ; Vesper, Verre et
  Lune non traités.


---

## Texte à la demande — 20 septembre 2026

Décision appliquée : la liseuse ne charge plus le texte intégral des cinq livres au démarrage.
Elle charge `catalogue.json` — métadonnées et index des chapitres —, puis un morceau de six
chapitres quand on lit un chapitre qu'il contient. Le service worker ne précache que la coquille.

Ce que ça change pour le lecteur : la première visite coûte la page, le script et le catalogue
au lieu de 531 Ko de texte (173 Ko compressés) ; un livre dont on a lu un chapitre se retrouve
entier en cache par préchargement à l'oisiveté, sauf si l'appareil demande l'économie de
données ; un livre seulement ouvert n'est pas disponible hors ligne. La progression, les marque-pages et les réglages sont
intacts (même clé, mêmes indices).

Ce que ça change pour l'autrice : rien à faire d'autre que relancer le script. Plus de balise
dans `index.html`, plus d'affectation dans `app.js`, plus de liste dans `sw.js`. Les coupures de
scène voyagent avec le texte. La divergence de format entre les fichiers publiés et le script
est levée : le script écrit lui-même le JSON lisible, un paragraphe par ligne.

Contrat et points ouverts pour une version publique : `ARCHITECTURE.md`.
