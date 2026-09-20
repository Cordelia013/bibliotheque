# Castellano — bascule de la v1 à la v2 sur la liseuse

*Décision du 20 septembre 2026.*

Le dépôt servait la **v1** (40 chapitres, 20 004 mots). Le projet portait la **v2**, réécrite et
révisée en entier : 50 sections, 82 324 mots. Ce ne sont pas deux états du même texte.

## Ce que la bascule cassait, et qui n'était pas ce qu'on croyait

La crainte était que les lecteurs en cours **perdent** leur place. L'examen du moteur montre
pire : ils ne l'auraient pas perdue.

`S.livres.<id>.chap` est un **indice**. La v1 a 40 chapitres, la v2 en a 50 : un lecteur arrêté à
l'indice 12 y reste, et se retrouve au chapitre 12 d'un autre texte. `etat()` ne le ramène au
dernier chapitre publié que si sa position tombe **hors** du livre — ici elle tombe dedans, au
mauvais endroit. En prime, ses douze `vus` marquent comme lus douze chapitres qu'il n'a jamais
ouverts, ses marque-pages gardent un `extrait` qui ne correspond plus à rien, et `connus` lui
annonce « 10 nouveaux chapitres » alors que le livre entier a changé.

**Silencieusement faux est plus coûteux que visiblement perdu.**

## Ce qui a été décidé

**Un marqueur de révision dans le catalogue**, plutôt qu'un changement d'identifiant ou une
coexistence des deux versions. Trois raisons :

1. L'identifiant `castellano` est conservé — les adresses partagées continuent de fonctionner.
2. Le problème n'est pas celui de Castellano : il se reposera avec **les Braises**, dont le plan
   prévoit une renumérotation en fin de rédaction. Le régler une fois vaut mieux que le
   contourner deux fois.
3. Personne n'était en cours de lecture au moment de la bascule : le mécanisme a pu être posé et
   éprouvé sans rien coûter à personne.

## Ce qui a changé dans le code

### `maj_bibliotheque.py`

- `fichiers_du_livre()` : un livre se compose de `prologue.md` (facultatif), des `chapitre-*.md`
  dans l'ordre de leur nom, puis de `epilogue.md` (facultatif). Auparavant le glob ne prenait que
  `chapitre-*.md` — **le prologue de Castellano aurait été omis sans la moindre erreur**, et avec
  lui la scène d'ouverture du livre.
- L'en-tête accepte `## Prologue — Titre` et `## Épilogue — Titre`. Le numéro vaut alors
  « Prologue » ou « Épilogue ».
- La clé `revision` du CATALOGUE est recopiée dans le catalogue publié.

### `docs/app.js`

- `libelle(n)` : on n'écrit « Chapitre » devant un numéro que s'il commence par un chiffre —
  « 12 », « 39 bis ». Ailleurs le nom de la section se suffit : « Prologue », et non
  « Chapitre Prologue ». Quinze points d'affichage corrigés.
- `appliquerRevisions()`, appelée une fois le catalogue chargé : si la révision annoncée diffère
  de celle enregistrée, ce livre est remis à zéro — position, `vus`, marque-pages, `connus`,
  `dernier` — et le lecteur en est averti. Un livre **sans** `revision` n'est jamais touché.
- Une progression dont la révision est inconnue n'est pas conservée. C'est le cas au moment où le
  marqueur est introduit : on ne peut pas la valider, et reprendre au mauvais chapitre sans le
  savoir coûte plus cher que repartir du début.
- `toast()` accepte une durée ; le message de réécriture tient six secondes.

### Contenu

- `chapitres/castellano/` : les 40 fichiers de la v1 remplacés par les 50 de la v2.
- `revision: "v2-2026-09-20"` sur Castellano, sur lui seul.
- Résumé corrigé : « Huit ans » et non « Sept ans » — la v2 court de juillet 2026 à octobre 2028,
  et le texte dit « en huit ans » au chapitre 44.

## Vérifications

Test de fumée du dépôt : **22 contrôles verts**. Le seul échec est le chargement des polices
Google, bloqué par le réseau du conteneur de test — sans rapport avec ces changements.

Test ciblé, écrit pour cette bascule, sur un navigateur réel : **22 contrôles verts**.

- Un lecteur arrêté au chapitre 13 de la v1 : position remise à 0, `vus` vidés, marque-page
  abandonné, `connus` porté à 50, « reprendre ma lecture » détaché du livre, message affiché.
- Les Braises, au même moment : position, `vus`, marque-page et `connus` intacts, aucune révision
  posée sur un livre qui n'en déclare pas.
- Deuxième visite : la nouvelle progression est conservée, plus de message.
- Premier visiteur : aucun message.
- Le prologue est listé au sommaire et s'affiche « Prologue », jamais « Chapitre Prologue ».
- Le chapitre 1 reste « Chapitre 1 », le 27 bis reste « Chapitre 27 bis » à sa place.

## Ce qui reste ouvert

**Les 192 passages en italique du texte sont aplatis à la publication.** Le générateur retire les
marques `*…*` depuis l'origine (point 6 d'`ARCHITECTURE.md`). Pour Castellano, cela touche les
entrées de carnet, les phrases ressassées, les brouillons de messages — des passages où
l'italique porte du sens et non de l'emphase. C'est un chantier du moteur, pas de ce livre, et il
concerne autant les Braises.
