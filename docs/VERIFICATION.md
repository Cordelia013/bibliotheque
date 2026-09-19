# Vérification de cette branche

Branche `direction-d`. Elle porte, pour l'instant :

- `docs/sw.js` — cache `liseuse-v5`, les deux couvertures ajoutées au précache.
  Transfert vérifié au bit près contre la copie locale.
- `docs/couvertures/` — le dossier qui recevra `braises.jpg` et `castellano.jpg`.

Il manque `docs/app.js`, qui porte la direction D, l'alignement des livres et le
mécanisme des couvertures en image. Ce fichier fait 88 Ko et doit être transmis
en entier par l'API GitHub, le push git direct étant refusé par le proxy de la
session.

Ne pas fusionner cette branche tant que `docs/app.js` n'y est pas : `sw.js` y
référence des fichiers de couverture qui ne seraient pas encore déclarés côté
application. Sans `app.js`, la liseuse reste fonctionnelle mais inchangée.
