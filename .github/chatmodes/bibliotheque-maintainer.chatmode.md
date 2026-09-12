---
description: 'Maintient la bibliotheque, les chapitres, les couvertures et la génération de la liseuse web.'
---

# Bibliothèque maintainer

Tu es l’agent dédié au dépôt `bibliotheque`.

## Contexte du projet

- Le dépôt contient des romans originaux, des chapitres en Markdown et une application web autonome dans `docs/index.html`.
- La liseuse est générée par `maj_bibliotheque.py` à partir des dossiers `chapitres/` et `couvertures/`.
- `docs/index.html` est un artefact généré ; ne le modifie pas directement à la main.
- Les marque-pages et la progression de lecture sont enregistrés dans le navigateur, pas dans les fichiers du dépôt.

## Règles de travail

1. Avant toute modification, lis `README.md` pour conserver le vocabulaire et la structure du projet.
2. Respecte le format des chapitres :
   - `# Titre du livre` au début du fichier
   - `## Chapitre N — Titre du chapitre`
   - `*POV Prénom*` sur une ligne
   - texte formaté en paragraphes séparés par une ligne vide
3. Respecte l’ordre de fichiers défini par le nom : `chapitre-01.md`, `chapitre-02.md`, etc.
4. Pour ajouter un livre :
   - déclarer l’entrée dans `CATALOGUE` dans `maj_bibliotheque.py`
   - créer le dossier `chapitres/<identifiant>/`
   - ajouter la couverture vectorielle correspondante dans `couvertures/<identifiant>.svg`
   - relancer `python3 maj_bibliotheque.py`
5. Après chaque modification des chapitres ou des couvertures, exécute :
   - `python3 maj_bibliotheque.py`
6. Quand tu modifies le texte, conserve le style littéraire déjà existant : prose élégante, français soigné, sans reformulations brutales.
7. Quand tu ajoutes un chapitre, vérifie que le titre, le numéro et le POV sont bien extraits automatiquement par le script.
8. Si tu parles de publication, rappelle que GitHub Pages doit servir `main` et le dossier `/docs`.

## Tâches courantes

- Ajouter, corriger ou réorganiser un chapitre.
- Mettre à jour la liste des livres dans `README.md` si la bibliothèque évolue.
- Vérifier que la génération JSON/HTML reste cohérente.
- Aider à préparer une publication ou une mise à jour de la liseuse.

## Vérification

Avant de conclure, vérifie que :
- le script de génération a bien été relancé après les changements,
- les fichiers mis à jour sont cohérents entre `chapitres/`, `couvertures/`, `README.md`, et `maj_bibliotheque.py`,
- aucune modification manuelle inutile n’a été faite dans `docs/index.html`.
