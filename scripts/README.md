# Scripts

Trois scripts en Python standard, sans rien à installer, et un test de la liseuse qui demande
Playwright.

---

## Icônes de l'application

```bash
python3 scripts/generer_icones.py
```

Produit trois fichiers dans `docs/` :

| Fichier | Taille | Usage |
|---|---|---|
| `icone-192.png` | 192 px | manifeste, favicon |
| `icone-512.png` | 512 px | manifeste, écran de démarrage, icône adaptative |
| `apple-touch-icon.png` | 180 px | écran d'accueil iOS |

Motif : fond nuit, filet laiton, croissant de lune — repris de la couverture
de *La Part de Lune* et du filet qui encadre les cinq couvertures.

L'encodeur PNG est écrit à la main (`zlib` + `struct`). Pour modifier le
dessin, la fonction `dessiner()` décrit la composition en coordonnées
relatives à la taille : elle fonctionne donc à n'importe quelle résolution.

**Ces fichiers doivent être présents dans `docs/` pour que l'installation sur
l'écran d'accueil fonctionne.** Sans eux, le manifeste référence des images
absentes et le navigateur refuse la proposition d'installation.

---

## Fichiers EPUB

```bash
python3 scripts/generer_epub.py
```

Les fichiers sont écrits dans `docs/epub/` — un `.epub` par livre ayant au moins un chapitre.
Le script lit `docs/catalogue.json` et les morceaux de texte qu'il cite : ce que la liseuse lit
elle-même, sans liste de fichiers tenue à part. Les coupures de scène du manuscrit sont rendues.

Sortie attendue au 10 novembre 2026 :

```
  castellano   50 chapitres   224.7 Ko  docs/epub/castellano.epub
  vesper       10 chapitres    24.7 Ko  docs/epub/vesper.epub
  braises      52 chapitres   193.3 Ko  docs/epub/braises.epub
  verre         5 chapitres    13.8 Ko  docs/epub/verre.epub
```

**Couverture.** Chaque EPUB s'ouvre sur la couverture du livre, avec la même priorité que la
liseuse : la couverture en image déclarée par `couvImage` dans le catalogue, sinon la
vectorielle injectée dans `docs/index.html`. Elle est embarquée en SVG — le script n'a aucun
moyen de produire un JPEG sans dépendance. Certaines liseuses anciennes n'affichent pas de
vignette pour une couverture SVG ; la page de couverture, elle, reste dans le livre.

**Libellés.** Comme dans la liseuse, « Chapitre » ne précède un numéro que s'il commence par un
chiffre : « Chapitre 12 », « Chapitre 39 bis », mais « Prologue » et « Épilogue » seuls.

**Fichiers reproductibles.** Rien dans l'archive ne dépend de l'heure de la génération : les
entrées portent une date fixe, et `dcterms:modified` vaut la date `maj` du livre dans le
catalogue. Relancer le script sans avoir changé le texte redonne les mêmes fichiers, à l'octet
près ; l'action ne recommite donc un EPUB que si son livre a bougé. Une version différente de
Python ou de zlib peut compresser autrement : un EPUB produit en local peut être réécrit une
fois par l'action, puis ne plus bouger.

*La Part de Lune* est ignoré tant qu'aucun chapitre n'est publié. Un livre ajouté au catalogue
est pris en compte sans rien changer ici.

---

## Publication automatique

`.github/workflows/publication.yml` : à chaque modification poussée sur `main` d'un chapitre,
d'une couverture, de `personnages.json` ou du générateur, l'action régénère le catalogue et les
morceaux de texte, produit les EPUB, vérifie le tout et commite le résultat dans `docs/`.
GitHub Pages redéploie ensuite de lui-même. Active depuis le 20 septembre 2026.

Elle vérifie le catalogue — chaque morceau cité existe et couvre bien les chapitres annoncés —
et chaque archive EPUB produite — mimetype conforme, XML bien formé, couverture comprise, archive intègre — avant
de publier. Elle peut aussi être lancée à la main depuis l'onglet **Actions**.

Ce qu'elle change pour l'écriture : après avoir modifié un chapitre, il suffit de pousser sur
`main`. Relancer `python3 maj_bibliotheque.py` en local reste possible et donne le même
résultat ; dans ce cas, tirer (`git pull`) avant la poussée suivante pour récupérer le commit du
robot.

---

## Test de la liseuse

```bash
npm install playwright        # une fois
node scripts/fumee_liseuse.js docs
```

Joue le parcours d'un lecteur dans un navigateur : bibliothèque, page de garde, lecture d'un
chapitre, coupures de scène, position enregistrée hors du livre, service worker, lecture hors
ligne. Vérifie aussi ce que la page télécharge — aucun texte avant de lire, un seul morceau au
premier chapitre, le reste du livre seulement après un chapitre lu en entier.

Sans navigateur Playwright installé, désigner un Chromium par `PLAYWRIGHT_CHROMIUM=/chemin`.

---

## Fiches de travail littéraire

```bash
python3 scripts/generer_prompts.py
```

Produit `prompts/<nom>.md` à partir de chaque `.claude/skills/<nom>/SKILL.md` : la même méthode,
détachée du dépôt, à copier dans n'importe quel outil.

Sont retirés au passage l'en-tête technique de la fiche, la section « Application à ce dépôt »
et les renvois écrits en langage d'outil — « la skill `relecture` » devient « le prompt
*Correcteur-relecteur professionnel* ».

La source est la fiche, jamais le fichier produit : une correction faite dans `prompts/` serait
écrasée au passage suivant. `prompts/checklist.md` fait exception, il s'écrit à la main.

---

## Nom de domaine

Le domaine `entrelespages.fr` n'est pas encore acheté. La marche à suivre est
détaillée dans l'issue #12. Point important : **ne pas créer `docs/CNAME`
avant que les enregistrements DNS soient en place**. GitHub Pages cesserait
aussitôt de servir le site sur `cordelia013.github.io`, sans que le nouveau
domaine ne réponde encore : la bibliothèque serait inaccessible pendant toute
la durée de la propagation.
