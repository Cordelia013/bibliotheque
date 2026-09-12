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

Ajoutez cette adresse à l'écran d'accueil de votre téléphone : la lecture,
les marque-pages et le mode nuit fonctionnent exactement comme dans le fichier.

## 4. Ajouter des chapitres par la suite

```bash
# après avoir ajouté ou modifié des fichiers dans chapitres/
python3 maj_bibliotheque.py
git add .
git commit -m "Braises : acte II"
git push
```

La page publiée se met à jour toute seule en une minute environ.

## Remarque sur la progression de lecture

Elle est stockée par le navigateur, pour une adresse donnée. Si vous lisiez
jusqu'ici dans le fichier local et que vous passez à l'adresse GitHub Pages,
vous repartirez de zéro une fois — les marque-pages ne suivent pas d'un
emplacement à l'autre. Ensuite, tout est conservé normalement.
