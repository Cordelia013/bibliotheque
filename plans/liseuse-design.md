# Liseuse — règles de design

État au 19 septembre 2026, après la passe de design (commit `8e622ed`), l'itération 2
(commit `7e2bb65`) et les corrections d'accessibilité qui la suivent.

## Où écrire

La feuille de style d'origine est dans `docs/index.html`, **à l'intérieur du corps
de la page**. Toute règle ajoutée par `docs/app.js` est injectée dans `<head>`,
donc plus tôt dans l'ordre du document : à spécificité égale, c'est celle du corps
qui l'emporte. **Les règles injectées doivent donc porter le sélecteur `#app`.**

Conséquence pratique : une modification de design se fait dans `app.js` seul
plutôt que dans `index.html`, qui pèse 42 Ko dont la quasi-totalité en couvertures
SVG. Les nouveaux éléments d'interface se créent dans `monterUI()`.

## Couleurs

Chaque livre a sa couleur (`couleur` dans `BOOKS`), posée sur `--accent`. Les cinq
sont sombres, ce qui convient au papier clair et pas du tout au fond nuit :
mesurées, elles y donnaient **1,20 à 2,33** de contraste là où la norme demande 4,5
pour du texte.

`--accent-texte` est donc calculé à l'exécution par `poserAccent()` : la clarté
monte par paliers d'un centième, à teinte constante et saturation relevée de 15 %,
jusqu'à atteindre 4,5 contre `--paper-deep`, qui est toujours le plus défavorable
des deux fonds d'un thème. Braises passe ainsi de `#8a3a1f` à `#df6035` en mode nuit.

**Règle** : `--accent` pour les aplats (barre de progression, bouton principal,
carte « chapitre suivant », badge NOUVEAU), `--accent-texte` dès qu'il s'agit de
texte ou d'un signe fin.

Les gris de légende passaient eux aussi sous le seuil sur le fond du tiroir :
`--muted` corrigé en `#686156` (clair, 4,57) et `#72604b` (sépia, 4,54). Le mode
nuit était déjà conforme.

## Texte

- **Ouverture de chapitre** : pas de lettrine flottante. Les chapitres de ce corpus
  s'ouvrent presque tous sur une phrase de vingt à soixante signes — une lettrine
  de trois lignes déborde sous un paragraphe qui n'en fait que deux, et
  `::first-letter` emportait l'apostrophe (« J' » en corps 3). L'initiale est
  haussée dans la ligne, dans un `<span class="cap">` construit en JavaScript, et
  le paragraphe d'ouverture est grossi de 10 %.
- **Répliques** : tout paragraphe commençant par un tiret cadratin reçoit la classe
  `dlg` — retrait pendant de 0,75 em, jamais justifié, jamais de césure.
- **Alignement** : réglage du lecteur, à gauche par défaut, justifié avec césure en
  option. Stocké dans `S.align`.
- **Point de vue** : italique, `--accent-texte`, filet laiton de 46 px dessous.

## Mesures plutôt que constantes

La ligne de progression suit `--barh`, hauteur de la barre mesurée au chargement,
au redimensionnement, à la rotation et une fois les polices chargées. En mode
immersif, elle remonte à `top: 0`.

## Comportements (itération 2)

- **Progression** : un chapitre entre dans `vus` à 90 % de sa hauteur, ou quand on
  passe au suivant par la carte de fin — plus à l'ouverture. Les progressions
  enregistrées avant le 18 septembre restent surévaluées.
- **Couvertures** : identifiants SVG préfixés à chaque insertion (`idsUniques()`).
- **Feuille du bas** : un seul composant (`ouvrirFeuille()` / `fermerFeuille()`)
  pour la note de marque-page et la confirmation « Recommencer ce livre ». Aucun
  `prompt()` ni `confirm()`. Les notes sont échappées à l'affichage (`esc()`).
- **Adresses** : `#/`, `#/livre/{id}`, `#/lire/{id}/{n}` ; tiroir et feuilles
  occupent une entrée d'historique, le retour arrière les referme d'abord.
- **Barre** : icônes SVG (`ICONES`), cibles de 44 px, noms qui disent l'action ;
  masquée en mode immersif (classe `immersif` sur `#app`) quand on descend dans le
  texte, rendue quand on remonte, qu'on touche le texte, en haut et en fin de
  chapitre.
- **Navigation entre chapitres** : carte « chapitre suivant » (titre, durée, point
  de vue), flèches du clavier, balayage latéral net (80 px au moins, en moins de
  600 ms, nettement plus horizontal que vertical). « À suivre » ou « Fin » au
  dernier chapitre publié.
- **Statuts affichés** (`statutLisible()`) : Roman complet, En cours d'écriture,
  À paraître — les données `BOOKS` gardent Terminé, En cours, À venir.
- **Sommaire** : ouvert sur le chapitre en cours, réglages résumés sur une ligne.
  Clé facultative `parties: [{ titre, debut }]` dans `BOOKS` pour grouper en actes
  repliables ; aucun livre ne la porte encore.
- **Zoom** : la balise viewport est réécrite depuis `app.js` sans
  `maximum-scale=1` ; effet sur iPhone non vérifié.

## Accessibilité

- Tiroir et feuilles : `role="dialog"` (ou `alertdialog`), `aria-modal`, focus
  gardé à l'intérieur, rendu au bouton d'origine à la fermeture, Échap pour fermer.
- Onglets du tiroir : `role="tab"`, un seul dans l'ordre de tabulation, flèches
  gauche et droite, Début et Fin pour passer de l'un à l'autre.
- Messages de confirmation : `#toast` en `role="status"`, annoncés sans prendre
  le focus.
- Contour de focus : 2 px `--ink`, décalé de 2 px.

## Défaut connu, non corrigé

**Les séparateurs de scène disparaissent de la liseuse.** `maj_bibliotheque.py`
filtre les lignes `---` en construisant les paragraphes. Le chapitre 29 des Braises
en compte cinq dans le manuscrit et zéro dans les données publiées.

Le corriger demande d'émettre un marqueur dans le générateur, de le rendre dans
`app.js`, puis de **republier les quinze fichiers de données** — l'API GitHub
exigeant le contenu complet de chaque fichier, c'est une opération longue et
sensible à l'erreur de transcription. À décider séparément.
