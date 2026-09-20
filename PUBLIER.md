# Publier et modifier

Mode d'emploi de la bibliothèque : modifier un livre, en ajouter un, publier. Tout ce qui
suit vaut au 20 septembre 2026 ; le site est servi à l'adresse
`https://cordelia013.github.io/bibliotheque/`.

## En une phrase

**On écrit dans `chapitres/`, on pousse sur `main`, le reste est automatique.**

## 1. Ce qui est automatique, ce qui ne l'est pas

| | Qui |
|---|---|
| Écrire, corriger, ajouter un chapitre | vous |
| Pousser sur `main` | vous |
| Régénérer le catalogue et les morceaux de texte | l'action GitHub `publication.yml` |
| Produire les EPUB | l'action |
| Vérifier que tout se tient avant de publier | l'action |
| Mettre le site à jour | GitHub Pages, une minute après |
| Faire apparaître la nouveauté chez un lecteur | son prochain chargement de la page |

**Deux conditions.** La poussée doit aller sur `main` : une branche de travail n'est pas
publiée tant qu'elle n'est pas fusionnée. Et le dépôt doit être à jour en local avant de
pousser : l'action commite dans `docs/` après vous, donc `git pull` d'abord.

## 2. Le cycle courant

```bash
git pull                                  # récupérer ce que l'action a commité
# … écrire dans chapitres/<livre>/ …
python3 maj_bibliotheque.py               # facultatif : vérifier en local, voir § 9
git add chapitres
git commit -m "Braises : chapitre 53"
git push                                  # sur main
```

Une minute plus tard, le chapitre est en ligne. Le script local et l'action produisent
exactement le même résultat ; relancer le script chez soi ne sert qu'à vérifier avant de pousser.

## 3. Modifier un chapitre existant

Éditer le fichier dans `chapitres/<livre>/`, pousser. Rien d'autre.

Ce que l'action recalcule d'elle-même : le nombre de mots, les coupures de scène, la version
du morceau qui contient le chapitre, la date de mise à jour du livre. Les lecteurs qui avaient
ce chapitre en cache reçoivent le nouveau au prochain chargement — la nouvelle version a une
autre adresse, l'ancienne n'est jamais resservie.

**Ne jamais corriger un texte dans `docs/`** : il serait écrasé à la publication suivante.

## 4. Ajouter un chapitre

Créer `chapitres/<livre>/chapitre-NN.md`, numéro sur deux chiffres, à la suite du dernier :

```markdown
# La Saison des Braises

## Chapitre 53 — Titre du chapitre

*POV Ysée*

Le texte, en paragraphes séparés par une ligne vide.

---

Une ligne « --- » seule marque une coupure de scène.
```

Les trois en-têtes sont obligatoires : le titre du livre, la ligne `## Chapitre N — Titre`,
la ligne `*POV Prénom*`. Un chapitre sans en-tête reconnaissable est ignoré, avec un
avertissement dans le journal de l'action. L'italique `*…*` et le gras `**…**` sont retirés
à la publication.

Le nom du fichier fixe l'ordre de lecture ; le numéro dans l'en-tête, l'affichage.

## 5. Insérer un chapitre sans renuméroter

Pour glisser un chapitre entre le 39 et le 40 : `chapitre-39bis.md`, titré
`## Chapitre 39 bis — …`. Il se range de lui-même, la liseuse affiche « Chapitre 39 bis ».
Suffixes reconnus : `bis`, `ter`, `quater`.

**Renuméroter un livre que des lecteurs ont commencé leur fait perdre leur position** : la
progression et les marque-pages sont stockés par rang dans la liste, pas par numéro. Insérer
un `bis` ne décale rien pour les chapitres suivants dans la lecture en cours — mais un rang
de plus avant le chapitre où quelqu'un s'est arrêté le renvoie au chapitre précédent. À faire
en une fois, en fin de rédaction, comme le prévoit le plan de réécriture des *Braises*.

## 6. Ajouter un livre

Quatre gestes, tous dans les sources ; la liseuse découvre le livre dans le catalogue.

**a. Déclarer le livre** dans la liste `CATALOGUE`, en tête de `maj_bibliotheque.py` :

```python
 {"id":"lune","titre":"La Part de Lune","serie":"Les Deux Collines — tome 1","auteur":"Écrit avec Claude",
  "genres":["Urban fantasy","Romance paranormale"],"annee":"2026","couleur":"#1c2445",
  "statut":"À venir","couv":"couvertures/la-part-de-lune.svg",
  "resume":"Trois ou quatre phrases : la quatrième de couverture."},
```

| Clé | Rôle |
|---|---|
| `id` | identifiant stable, minuscules et tirets, **jamais changé ensuite** : il porte la progression des lecteurs et les adresses |
| `titre`, `serie` | `serie` est facultatif |
| `genres` | le premier sert de sous-titre sur la couverture de secours ; tous servent aux filtres |
| `couleur` | l'accent du livre, en hexadécimal |
| `statut` | `À venir`, `En cours` ou `Terminé` — c'est l'état de l'écriture ; la liseuse l'affiche autrement |
| `couv` | la couverture vectorielle, dans `couvertures/` |
| `couv_image` | facultatif : une couverture en image, dans `docs/couvertures/` (voir § 8) |
| `parties` | facultatif : `[{"titre":"Acte I","debut":1}, …]` regroupe le sommaire en actes |

**b. Créer le dossier** `chapitres/<id>/` et y déposer les chapitres. Un dossier vide donne
un livre « À paraître » sans bouton de lecture : c'est le cas de *La Part de Lune*.

**c. Déposer la couverture** dans `couvertures/<nom>.svg`. Sans elle, la liseuse affiche une
couverture de secours — titre sur fond de la couleur du livre — et l'action laisse
`index.html` intact plutôt que d'y injecter un bloc incomplet.

**d. Ajouter les fiches personnages** dans `personnages.json`, sous la clé `id` du livre
(§ 7). Facultatif : un livre sans fiches affiche « Aucune fiche personnage ».

Puis pousser. Il n'y a **rien à modifier** dans `docs/` : ni balise dans `index.html`, ni
affectation dans `app.js`, ni liste dans `sw.js`.

## 7. Modifier le titre, le résumé, le statut, les genres

C'est dans `CATALOGUE` (`maj_bibliotheque.py`), pas dans les chapitres. Pousser : l'action
réécrit le catalogue.

Passer un livre de `En cours` à `Terminé` change ce que la page de garde affiche (plus de
date de mise à jour, « Fin » au lieu de « À suivre » au dernier chapitre) et la mention
dans la bibliothèque.

**Les fiches personnages** s'éditent dans `personnages.json`, à la racine :

```json
{
  "braises": [
    { "nom": "Ysée Marrec", "role": "Narratrice principale", "texte": "…" }
  ]
}
```

Une virgule de trop, une accolade manquante : l'action **s'arrête** et ne publie pas, plutôt
que de publier un catalogue sans fiches. Le journal de l'action dit où.

## 8. Les couvertures

Deux formes, la seconde prenant le pas sur la première quand elle existe.

- **Vectorielle** — `couvertures/<nom>.svg`, injectée dans `index.html` par l'action. Le
  fichier ne doit pas dépendre de ressources externes.
- **En image** — un SVG qui enveloppe une image (WebP 480 × 720 conseillé), déposé dans
  `docs/couvertures/` et déclaré par `couv_image` dans `CATALOGUE`. Si l'image ne se charge
  pas, la vectorielle reprend. Les deux couvertures en image actuelles viennent de Canva.

Ces fichiers sont les seuls que l'on dépose directement dans `docs/`.

## 9. Vérifier avant de pousser

```bash
python3 maj_bibliotheque.py
```

Le script dit ce qu'il a fait — « Aucun texte modifié » si rien n'a changé — et compte les
chapitres par livre. Trois signes à regarder :

- `!! en-tête de chapitre introuvable` : un fichier sera ignoré ;
- `!! couvertures manquantes` : `index.html` ne sera pas touché ;
- un livre qui ne s'arrête pas au bon nombre de chapitres : un fichier mal nommé.

`git status` doit ensuite montrer les chapitres modifiés **et** les fichiers de `docs/`
correspondants ; on peut commiter les deux ou seulement les chapitres, l'action produira
les mêmes fichiers.

Pour aller plus loin, `scripts/fumee_liseuse.js` joue le parcours d'un lecteur dans un
navigateur (voir `scripts/README.md`). Ce n'est pas nécessaire pour publier un chapitre.

## 10. Vérifier après

1. **L'action** : onglet *Actions* du dépôt, workflow « Publier la bibliothèque ». Vert en
   une dizaine de secondes. Rouge : le journal dit pourquoi, et rien n'a été publié.
2. **Le site** : GitHub Pages redéploie dans la minute qui suit le commit de l'action.
3. **Chez un lecteur** : la page et le catalogue passent par le réseau d'abord ; un
   navigateur peut garder l'ancien catalogue jusqu'à dix minutes. Pour forcer : recharger.

## 11. Les pièges

- **Pousser sans avoir tiré.** L'action commite dans `docs/` ; sans `git pull`, la poussée
  suivante est refusée. Rien de cassé, il suffit de tirer puis de pousser.
- **Éditer `docs/` à la main.** Écrasé à la publication suivante. Sauf les couvertures en
  image (§ 8).
- **Changer l'`id` d'un livre.** Les lecteurs perdent leur progression, les adresses
  partagées ne mènent plus nulle part.
- **Renuméroter des chapitres déjà lus.** Voir § 5.
- **Travailler sur une branche et attendre la publication.** Rien n'est publié hors de
  `main`. Une branche sert à préparer ; la fusion publie.
- **Commiter des brouillons.** Les dossiers `_brouillon*` et les fichiers `.bak` sont
  ignorés par Git (`.gitignore`) ; y laisser les versions de travail.

## 12. Revenir en arrière

Un chapitre publié par erreur se retire en remettant le fichier dans son état précédent et
en poussant — l'action régénère, les lecteurs reçoivent la version d'avant à leur prochain
chargement. Pour un commit entier :

```bash
git revert <commit>
git push
```

Jamais de `git push --force` sur `main` : l'action et les lecteurs s'appuient sur
l'historique tel qu'il est.

## 13. Ce qui est décrit ailleurs

- Le format de chapitre en détail, l'organisation du dépôt : `README.md`.
- Le contrat entre le générateur et la liseuse, ce qui reste pour une version publique :
  `ARCHITECTURE.md`.
- Les scripts annexes, le test, l'action : `scripts/README.md`.
- Les règles de travail sur les textes et les décisions qui font foi : `CLAUDE.md`, `plans/`.

---

## Annexe — la mise en ligne initiale

Déjà faite ; conservée pour mémoire, ou pour installer une copie ailleurs.

Créer un dépôt sur GitHub, pousser le dossier (`git init`, `git add .`, `git commit`,
`git branch -M main`, `git remote add origin …`, `git push -u origin main`). Dans *Settings →
Pages* : source `Deploy from a branch`, branche `main`, dossier `/docs`. Une minute plus
tard, le site répond à `https://<compte>.github.io/<dépôt>/`. GitHub Pages ne fonctionne
sur un dépôt privé qu'avec un compte payant.

La progression de lecture est stockée par le navigateur pour une adresse donnée : changer
d'adresse remet les lecteurs à zéro une fois. Ne pas créer `docs/CNAME` avant que les
enregistrements DNS d'un éventuel nom de domaine soient en place, sans quoi le site cesse
de répondre le temps de la propagation.
