# Bibliothèque — mémoire du projet

Dépôt d'écriture : cinq romans en markdown et une liseuse web autonome générée à partir d'eux.

## Où se trouve quoi

| Dossier | Contenu | Statut |
|---|---|---|
| `chapitres/<livre>/` | **la source** : un fichier par chapitre | on n'écrit que là |
| `couvertures/` | une couverture vectorielle par livre | source |
| `plans/` | plans de développement, audits, décisions de cohérence | **sources de vérité** |
| `methode/` | documentation du métier : écrire, réviser, publier, vendre | référence |
| `prompts/` | les trois fiches de travail, autonomes, plus une checklist | généré |
| `.claude/skills/` | les mêmes fiches, activables ici | source des précédentes |
| `docs/` | la liseuse : moteur tenu à la main, contenu généré | voir `ARCHITECTURE.md` |
| `personnages.json` | fiches personnages, recopiées dans le catalogue | source |
| `ARCHITECTURE.md` | le contrat générateur ↔ moteur, et ce qui reste pour une version publique | référence |
| `scripts/` | générateurs annexes : icônes, EPUB, prompts | outils |

## Règles techniques

1. **La source est `chapitres/`.** Le contenu de `docs/` — `catalogue.json` et les morceaux
   `data-<id>-pN.json` — est produit par `python3 maj_bibliotheque.py`. Ne jamais corriger un
   texte dans `docs/` : corriger le chapitre, relancer le script.
2. **Après toute modification du texte**, relancer le script. Il ne réécrit que ce qui a changé,
   recalcule les coupures de scène et les versions des morceaux, et date les seuls livres dont le
   texte a bougé. Vérifier ensuite que le publié correspond aux sources. Sur `main`, l'action
   `.github/workflows/publication.yml` fait ce travail à chaque poussée de chapitres ; en local,
   relancer le script reste le moyen de vérifier avant de pousser.
3. **Le moteur ne contient aucun contenu.** `docs/app.js`, `docs/sw.js` et `docs/index.html`
   (hors bloc des couvertures) sont du code, tenu à la main, et le script n'y touche pas. Le
   contrat entre les deux est dans `ARCHITECTURE.md` ; le respecter avant de toucher à l'un ou à
   l'autre.
4. **Les fiches personnages** vivent dans `personnages.json`, à la racine, et sont recopiées dans
   le catalogue. C'est là qu'on les édite.
5. **Format de chapitre**, en-têtes, suffixes `bis` : voir `README.md`.
6. Les fiches de `prompts/` sont **générées** par `scripts/generer_prompts.py` depuis
   `.claude/skills/`. Corriger la fiche source, jamais le fichier produit.

## Règles de travail

- **Consigner les décisions.** Toute décision de fond se note dans `plans/`, datée, avec ce
  qu'elle engage pour la suite. Les écarts assumés se notent aussi, pour qu'une passe ultérieure
  ne les « corrige » pas par inadvertance.
- **Les documents de `plans/` font foi.** `braises-coherence-personnages.md` porte des décisions
  qui engagent les tomes 2 et 3 ; `braises-acte4-journal.md` enregistre ce que la rédaction a
  fixé ; `braises-plan-reecriture.md` fixe l'ordre des blocs ;
  `braises-relecture-coherence.md` liste les points ouverts.
- **Respecter la voix de l'autrice.** Ne pas uniformiser, ne pas rapprocher le texte d'une forme
  moyenne. Proposer, expliquer, laisser trancher.
- **Trois postures, trois fiches** : conseiller (`conseil-ecriture`), alpha-lire
  (`alpha-lecture`), corriger (`relecture`). Ne pas les mélanger dans la même séance.

## État au 19 septembre 2026

| Livre | Chapitres | Statut |
|---|---|---|
| Le Prix du Silence, Don Castellano | 40 | terminé |
| La Saison des Braises *(t. 1)* | 52 | en cours — blocs 4 à 6 du plan de réécriture |
| Le Contrat de Vesper | 10 | en cours, jamais audité |
| La Dette de Verre | 5 | en cours, jamais audité |
| La Part de Lune *(t. 1)* | 0 | plan seul |

La branche de travail est `claude/sleepy-cerf-ts5mmq` ; `main` sert GitHub Pages et publie
automatiquement ce qu'on y pousse.
