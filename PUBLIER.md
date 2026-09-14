# Mettre le dépôt en ligne

## 1. Créer le dépôt sur GitHub

Sur github.com : **New repository**. Nom au choix, par exemple `bibliotheque`.
Ne cochez ni README, ni .gitignore, ni licence — ils sont déjà dans le dossier.
Choisissez **Private** si vous ne voulez pas que les textes soient publics ;
notez que GitHub Pages ne fonctionne sur un dépôt privé qu'avec un compte payant.

## 2. Pousser le dossier depuis votre ordinateur

Dans un terminal, placez-vous dans le dossier téléchargé, puis :

```bash
git init
git add .
git commit -m "Bibliothèque : 5 romans, liseuse et plans"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/bibliotheque.git
git push -u origin main
```

Remplacez `VOTRE-COMPTE` par votre identifiant GitHub.
Si Git vous demande un mot de passe, il attend un **jeton d'accès personnel**
(Settings → Developer settings → Personal access tokens), pas votre mot de passe.

## 3. Publier la liseuse

Dans le dépôt : **Settings → Pages**.
Source : `Deploy from a branch`. Branche : `main`. Dossier : `/docs`. **Save**.

Une minute plus tard, la liseuse est accessible à :

```
https://VOTRE-COMPTE.github.io/bibliotheque/
```

## 4. Ajouter des chapitres par la suite

Les textes s'écrivent en markdown dans `chapitres/<livre>/chapitre-NN.md`.
C'est la seule source à modifier : les fichiers de `docs/` sont générés.

```bash
# après avoir ajouté ou modifié des fichiers dans chapitres/
python3 maj_bibliotheque.py
git add .
git commit -m "Braises : acte II"
git push
```

La page publiée se met à jour toute seule en une minute environ.

### Ce que fait le script

- écrit les fichiers de texte chargés par la liseuse :
  `docs/data-castellano-p1.js` à `p4.js` (40 chapitres découpés par 10),
  `docs/data-vesper.js`, `data-braises.js`, `data-verre.js` ;
- réinjecte les couvertures SVG de `couvertures/` dans `docs/index.html` ;
- met la date de dernière mise à jour à jour dans `docs/app.js`, pour les
  seuls livres dont le texte a réellement changé — c'est cette date qui
  affiche le badge « NOUVEAU » dans la bibliothèque.

Il ne touche jamais au code de l'application (`docs/app.js` hors dates,
`docs/sw.js`, `docs/manifest.json`) ni aux fiches personnages.

### Garde-fous

- Si un dossier `chapitres/<livre>/` est vide ou absent, les fichiers déjà
  publiés pour ce livre sont **conservés**, pas effacés. Un avertissement
  s'affiche.
- Si une couverture SVG manque, le bloc des couvertures d'`index.html` est
  laissé intact plutôt que réécrit de façon incomplète.
- Relancer le script sans avoir rien modifié n'écrit aucun fichier et affiche
  « Aucun texte modifié ».

### Ajouter un nouveau livre

Compléter `CATALOGUE` en tête de `maj_bibliotheque.py`, créer le dossier
`chapitres/<id>/`, déposer la couverture dans `couvertures/`, puis ajouter la
balise correspondante dans `docs/index.html` :

```html
<script src="data-<id>.js"></script>
```

et l'affectation dans `docs/app.js` :

```javascript
BOOKS.find(b => b.id === '<id>').chapitres = DATA_<ID>;
```

Au-delà de ~60 Ko de texte, ajouter le livre à `DECOUPAGE` pour le répartir
sur plusieurs fichiers.

## 5. Scripts annexes

`scripts/generer_icones.py` produit les icônes de l'écran d'accueil,
`scripts/generer_epub.py` les fichiers EPUB. Voir `scripts/README.md`.

## Remarque sur la progression de lecture

Elle est stockée par le navigateur, pour une adresse donnée. Si vous lisiez
jusqu'ici dans le fichier local et que vous passez à l'adresse GitHub Pages,
vous repartirez de zéro une fois — les marque-pages ne suivent pas d'un
emplacement à l'autre. Ensuite, tout est conservé normalement.
