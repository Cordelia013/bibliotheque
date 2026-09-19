#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Produit les versions autonomes des fiches de travail littéraire.

Source : .claude/skills/<nom>/SKILL.md — les fiches utilisées par l'assistant
dans ce dépôt.
Sortie : prompts/<nom>.md — la même méthode, détachée du dépôt, à copier dans
n'importe quel outil ou à lire seule.

Trois choses sont retirées au passage : l'en-tête technique de la fiche, la
section « Application à ce dépôt », et les renvois d'une fiche à l'autre écrits
en langage d'outil (« la skill `relecture` » devient « le prompt *Relecture* »).

Ne jamais modifier prompts/ à la main : le fichier serait écrasé au prochain
passage. Toute correction se fait dans la fiche source.
"""
import glob, os, re

SOURCE = ".claude/skills"
SORTIE = "prompts"

TITRES = {
    "relecture": "Correcteur-relecteur professionnel",
    "alpha-lecture": "Alpha-lecteur",
    "conseil-ecriture": "Conseiller littéraire et coach en écriture",
}


def sans_entete(txt):
    """Retire le frontmatter et renvoie (description, corps)."""
    m = re.match(r"---\n(.*?)\n---\n+", txt, re.S)
    if not m:
        return "", txt
    champs = m.group(1)
    d = re.search(r"^description:\s*(.+)$", champs, re.M)
    return (d.group(1).strip() if d else ""), txt[m.end():]


def sans_section_depot(txt):
    """Coupe la dernière section, propre au dépôt, et ce qui la précède."""
    m = re.search(r"\n#+ \d*\.? ?Application à ce dépôt\b", txt)
    if not m:
        return txt.rstrip() + "\n"
    corps = txt[:m.start()].rstrip()
    return corps.rstrip("-\n ").rstrip() + "\n"


def sans_jargon(txt):
    """Les renvois d'une fiche à l'autre cessent de parler d'outil.

    Prudence sur « relecture », qui est aussi un mot courant du métier : on ne
    le remplace que sous sa forme citée (entre accents graves) ou précédée de
    « skill ». Le nom peut être séparé de « skill » par un retour à la ligne,
    les encadrés étant écrits en citation.
    """
    noms = "|".join(map(re.escape, TITRES))
    coupure = r"(?:[ \t]+|\s*\n>[ \t]*)"          # espace, ou passage à la ligne d'un encadré

    def titre(m):
        return f"*{TITRES[m.group('nom')]}*"

    # « la skill <nom> », même coupée par un retour à la ligne
    txt = re.sub(
        rf"\b(?:la |le |les )?skills?{coupure}`?(?P<nom>{noms})`?",
        lambda m: "le prompt " + titre(m), txt)
    # « utiliser <nom> », forme des descriptions
    txt = re.sub(rf"\butiliser (?P<nom>{noms})\b",
                 lambda m: "utiliser le prompt " + titre(m), txt)
    # un nom cité seul
    txt = re.sub(rf"`(?P<nom>{noms})`", titre, txt)
    # « la skill » restée orpheline devant un titre déjà remplacé
    txt = re.sub(rf"\b(?:la |le |les )?skills?{coupure}(?=\*)", "le prompt ", txt)
    # contractions, que les substitutions précédentes ne peuvent pas prévoir
    txt = txt.replace("à le prompt", "au prompt").replace("de le prompt", "du prompt")
    return txt


def main():
    os.makedirs(SORTIE, exist_ok=True)
    fiches = sorted(glob.glob(f"{SOURCE}/*/SKILL.md"))
    if not fiches:
        print(f"  !! aucune fiche dans {SOURCE}/ — rien à faire")
        return
    for chemin in fiches:
        nom = os.path.basename(os.path.dirname(chemin))
        description, corps = sans_entete(open(chemin, encoding="utf-8").read())
        description = sans_jargon(description)
        corps = sans_jargon(sans_section_depot(corps))
        # Le titre de la fiche est déjà dans le corps ; on lui ajoute l'usage.
        corps = corps.replace(
            "\n\n", f"\n\n*{description}*\n\n", 1
        ) if description else corps
        contenu = (
            corps.rstrip()
            + "\n\n---\n\n*Version autonome, produite par `scripts/generer_prompts.py` "
              f"à partir de `{chemin}`. Ne pas modifier ici.*\n"
        )
        cible = f"{SORTIE}/{nom}.md"
        ancien = open(cible, encoding="utf-8").read() if os.path.exists(cible) else None
        if ancien == contenu:
            print(f"  {nom:18s} inchangé")
            continue
        open(cible, "w", encoding="utf-8").write(contenu)
        print(f"  {nom:18s} {len(contenu.split()):5d} mots  →  {cible}")


if __name__ == "__main__":
    main()
