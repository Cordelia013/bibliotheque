# Fiches de travail littéraire

Trois méthodes, une par moment de la vie d'un texte, plus une checklist.

| Fichier | Moment | Ce qu'il fait |
|---|---|---|
| `conseil-ecriture.md` | avant et pendant | propose : construire, développer, débloquer |
| `alpha-lecture.md` | sur un brouillon | réagit en lecteur, sans proposer ni corriger |
| `relecture.md` | sur un texte abouti | corrige : fond, structure, style, langue |
| `checklist.md` | — | l'essentiel des trois, sur une page |

Ces fichiers sont **autonomes** : ils ne parlent pas de ce dépôt et se collent tels quels dans
n'importe quel outil.

## Ne pas les modifier ici

Les trois premiers sont **générés** à partir des fiches de `.claude/skills/<nom>/SKILL.md`, qui
sont la source. Une correction faite ici serait perdue au prochain passage de :

```bash
python3 scripts/generer_prompts.py
```

`checklist.md`, lui, s'écrit à la main : le script n'y touche pas.
