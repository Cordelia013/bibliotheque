# Bibliothèque

Romans originaux et liseuse web autonome.

La liseuse (`docs/index.html`) est un fichier unique qui fonctionne sans serveur :
bibliothèque avec recherche par titre et par genre, page de garde par livre,
reprise automatique de la lecture, marque-pages et mode nuit. La progression
est enregistrée dans le navigateur, par livre.

## Les livres

| Titre | Genre | Statut | Chapitres |
|---|---|---|---|
| **Le Prix du Silence, Don Castellano** | Romance mafieuse, vengeance | Terminé | 40 |
| **Le Contrat de Vesper** | Dark romance, science-fiction | En cours | 10 |
| **La Saison des Braises** *(Les Trois Cents Lieues, t. 1)* | Romance sensuelle, fantasy | En cours | 52 |
| **La Dette de Verre** | Romance, héritage | En cours | 5 |
| **La Part de Lune** *(Les Deux Collines, t. 1)* | Urban fantasy, romance paranormale | À venir | — |

## Organisation

```
chapitres/<livre>/chapitre-NN.md   un fichier par chapitre
couvertures/<livre>.svg            une couverture vectorielle par livre
plans/                             plans de développement et analyses de genre
docs/index.html                    la liseuse, générée — ne pas éditer à la main
maj_bibliotheque.py                régénère docs/index.html
```

## Format d'un chapitre

```markdown
# Titre du livre

## Chapitre 7 — Titre du chapitre

*POV Prénom*

Le texte, en paragraphes séparés par une ligne vide.
```

Le numéro, le titre et le point de vue sont lus automatiquement par le script.
Le nom du fichier fixe l'ordre : `chapitre-07.md`, sur deux chiffres.

Pour insérer un chapitre sans renuméroter la suite, on lui donne un suffixe :
`chapitre-39bis.md`, titré `## Chapitre 39 bis — …`. Il se range de lui-même
entre le 39 et le 40, et la liseuse affiche « Chapitre 39 bis ».
Suffixes reconnus : `bis`, `ter`, `quater`.

## Mettre à jour la liseuse

Après avoir ajouté ou modifié des chapitres :

```bash
python3 maj_bibliotheque.py
```

Le script relit tous les dossiers de `chapitres/`, réinjecte le texte et les
couvertures dans `docs/index.html`, et affiche le compte par livre. Les
marque-pages et la position de lecture sont stockés séparément du texte : ils
survivent à chaque mise à jour.

Pour ajouter un livre, déclarer une entrée dans la liste `CATALOGUE` en haut du
script (identifiant, titre, genres, couleur, statut, résumé, couverture), créer
le dossier `chapitres/<identifiant>/`, puis relancer le script.

## Publier la liseuse en ligne

Dans les réglages du dépôt, section Pages : choisir la branche `main` et le
dossier `/docs`. La liseuse devient accessible depuis n'importe quel navigateur,
téléphone compris, à l'adresse fournie par GitHub.

## Licence

Textes et illustrations originaux. Tous droits réservés.
