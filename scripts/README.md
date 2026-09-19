# Scripts

Deux scripts, tous deux en Python standard : aucune dépendance à installer.

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

Les fichiers sont écrits dans `docs/epub/` — un `.epub` par livre ayant au
moins un chapitre.

Sortie attendue à ce jour :

```
  castellano   40 chapitres    75.4 Ko  docs/epub/castellano.epub
  vesper       10 chapitres    22.6 Ko  docs/epub/vesper.epub
  braises      12 chapitres    27.2 Ko  docs/epub/braises.epub
  verre         5 chapitres    11.7 Ko  docs/epub/verre.epub
```

*La Part de Lune* est ignoré tant qu'aucun chapitre n'est publié.

### Ajouter un livre

Compléter le dictionnaire `LIVRES` en tête de `scripts/generer_epub.py` :

```python
"lune": {
    "titre": "La Part de Lune",
    "sources": [("data-lune.js", "DATA_LUNE")],
},
```

---

## Automatiser la régénération

Le fichier `scripts/workflow-epub.yml` contient une action GitHub qui
régénère et publie les EPUB à chaque modification d'un `docs/data-*.js`.

Pour l'activer, il faut le déplacer à l'emplacement attendu par GitHub —
opération à faire depuis l'interface web ou en ligne de commande, car les
jetons d'API n'ont pas le droit d'écrire dans `.github/workflows/` :

```bash
mkdir -p .github/workflows
git mv scripts/workflow-epub.yml .github/workflows/epub.yml
git commit -m "Activation de la génération automatique des EPUB"
git push
```

Depuis l'interface web : créer un fichier nommé `.github/workflows/epub.yml`
et y coller le contenu de `scripts/workflow-epub.yml`.

Une fois en place, l'action se déclenche sur toute modification d'un fichier
de données et peut aussi être lancée manuellement depuis l'onglet **Actions**.
Elle vérifie chaque archive produite (mimetype conforme, XML bien formé,
archive intègre) avant de la publier.

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
