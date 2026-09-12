# Génération des EPUB

## Lancer à la main

Depuis la racine du dépôt, avec Python 3.8 ou plus récent :

```bash
python3 scripts/generer_epub.py
```

Les fichiers sont écrits dans `docs/epub/` — un `.epub` par livre ayant au
moins un chapitre. Aucune dépendance à installer : le script n'utilise que la
bibliothèque standard (`json`, `zipfile`, `html`).

Sortie attendue à ce jour :

```
  castellano   40 chapitres    75.4 Ko  docs/epub/castellano.epub
  vesper       10 chapitres    22.6 Ko  docs/epub/vesper.epub
  braises      12 chapitres    27.2 Ko  docs/epub/braises.epub
  verre         5 chapitres    11.7 Ko  docs/epub/verre.epub
```

*La Part de Lune* est ignoré tant qu'aucun chapitre n'est publié.

## Ajouter un livre

Compléter le dictionnaire `LIVRES` en tête de `scripts/generer_epub.py` :

```python
"lune": {
    "titre": "La Part de Lune",
    "sources": [("data-lune.js", "DATA_LUNE")],
},
```

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
