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

Sortie attendue à ce jour :

```
  castellano   40 chapitres    75.4 Ko  docs/epub/castellano.epub
  vesper       10 chapitres    22.6 Ko  docs/epub/vesper.epub
  braises      52 chapitres   174.6 Ko  docs/epub/braises.epub
  verre         5 chapitres    11.7 Ko  docs/epub/verre.epub
```

*La Part de Lune* est ignoré tant qu'aucun chapitre n'est publié. Un livre ajouté au catalogue
est pris en compte sans rien changer ici.

---

## Automatiser la publication

Le fichier `scripts/workflow-publication.yml` contient une action GitHub qui, à chaque
modification poussée sur `main` d'un chapitre, d'une couverture, de `personnages.json` ou du
générateur, régénère le catalogue et les morceaux de texte, produit les EPUB, vérifie le tout et
commite le résultat dans `docs/`. GitHub Pages redéploie ensuite de lui-même.

**Tant qu'elle n'est pas activée, la publication reste manuelle** : `python3 maj_bibliotheque.py`,
puis `git add`, `git commit`, `git push` sur `main`.

Pour l'activer, il faut déplacer le fichier à l'emplacement attendu par GitHub — opération à
faire depuis l'interface web ou en ligne de commande, car les jetons d'API n'ont pas le droit
d'écrire dans `.github/workflows/` :

```bash
mkdir -p .github/workflows
git mv scripts/workflow-publication.yml .github/workflows/publication.yml
git commit -m "Activation de la publication automatique"
git push
```

Depuis l'interface web : créer un fichier nommé `.github/workflows/publication.yml` et y coller
le contenu de `scripts/workflow-publication.yml`.

Une fois en place, l'action se déclenche sur toute modification des sources et peut aussi être
lancée manuellement depuis l'onglet **Actions**. Elle vérifie le catalogue (chaque morceau cité
existe et couvre bien les chapitres annoncés) et chaque archive EPUB produite (mimetype
conforme, XML bien formé, archive intègre) avant de publier. Elle remplace l'ancienne action
limitée aux EPUB.

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
