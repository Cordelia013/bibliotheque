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
chapitres/<livre>/chapitre-NN.md   un fichier par chapitre — la source
couvertures/<livre>.svg            une couverture vectorielle par livre
plans/                             plans de développement, audits, décisions de cohérence
methode/                           documentation du métier : écrire, réviser, publier, vendre
prompts/                           fiches de travail autonomes et checklist — générées
.claude/skills/                    les mêmes fiches, activables dans l'assistant
scripts/                           générateurs annexes : icônes, EPUB, prompts
docs/                              la liseuse : moteur (app.js, sw.js, index.html) et contenu généré
maj_bibliotheque.py                régénère le contenu de docs/ : catalogue.json et morceaux de texte
personnages.json                   fiches personnages, écrites à la main, recopiées dans le catalogue
ARCHITECTURE.md                    le contrat entre le générateur et le moteur
CLAUDE.md                          mémoire du projet : où est quoi, et les règles
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

Le script relit tous les dossiers de `chapitres/`, écrit `docs/catalogue.json` — les
métadonnées des livres et l'index de leurs chapitres — et les morceaux de texte
`docs/data-<id>-pN.json`, six chapitres par fichier, puis réinjecte les couvertures dans
`docs/index.html`. Il ne touche jamais au code de l'application. Les marque-pages et la
position de lecture sont stockés séparément du texte : ils survivent à chaque mise à jour.

La liseuse ne télécharge que le catalogue pour s'afficher, puis un morceau quand on lit un
chapitre qu'il contient. Chaque morceau porte dans son adresse une version tirée de son texte,
si bien qu'une nouvelle publication est visible au rechargement suivant sans rien vider.

Pour ajouter un livre, déclarer une entrée dans la liste `CATALOGUE` en haut du script
(identifiant, titre, genres, couleur, statut, résumé, couverture), créer le dossier
`chapitres/<identifiant>/`, puis relancer le script. Rien d'autre à modifier.

## Publier

On écrit dans `chapitres/`, on pousse sur `main`, une action GitHub régénère la liseuse et
GitHub Pages la met en ligne. Le mode d'emploi complet — modifier, ajouter un chapitre ou un
livre, vérifier, pièges — est dans `PUBLIER.md`.

## Licence

Textes et illustrations originaux. Tous droits réservés.
