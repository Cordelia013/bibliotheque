#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Régénère la bibliothèque à partir des dossiers chapitres/<id>/.

Écrit les fichiers de données chargés par docs/index.html :

    docs/data-castellano-p1.js … p4.js   (40 chapitres, découpés par 10)
    docs/data-braises-p1.js … p9.js      (52 chapitres, découpés par 6)
    docs/data-vesper.js, data-verre.js

Met aussi à jour, en place :
  - le bloc des couvertures dans docs/index.html ;
  - les dates de dernière mise à jour dans le tableau BOOKS de docs/app.js,
    pour les seuls livres dont le texte a changé.

Ne crée jamais de nouveau fichier de liseuse et ne touche ni au script
applicatif, ni aux fiches personnages.
"""
import re, json, glob, os, datetime

HTML = "docs/index.html"
APP = "docs/app.js"
DOSSIER = "docs"

# Un livre dont le texte dépasse ~60 Ko est découpé en plusieurs fichiers,
# pour éviter les problèmes rencontrés avec les très gros fichiers uniques.
DECOUPAGE = {"castellano": 10, "braises": 6}   # id -> chapitres par fichier

# Position des coupures de scène — les lignes « --- » du manuscrit —, relevée à
# la lecture des chapitres. Elle est écrite dans docs/app.js, à côté de BOOKS,
# plutôt que dans un fichier de plus : les fichiers de texte n'ont pas à changer
# de forme, et index.html n'a pas à être republié pour une balise de script.
SEPARATIONS = {}

CATALOGUE = [
 {"id":"castellano","titre":"Le Prix du Silence, Don Castellano","auteur":"Écrit avec Claude",
  "genres":["Romance mafieuse","Vengeance","Drame","Suspense"],"annee":"2026","couleur":"#6d1f2c",
  "statut":"Terminé","couv":"couvertures/don-castellano.svg",
  "resume":"Livia Sarti est la consigliere de la famille Castellano et, depuis trois ans, l'épouse secrète de son Don. Une balle sur le quai nord, un appel auquel il répond sans savoir que c'est elle, et tout s'écroule. Elle rend les clés, demande le divorce devant vingt-deux couverts, et s'allie à la famille rivale. Sept ans pour comprendre qu'on n'attend pas qu'on écrive votre nom quelque part : on l'écrit."},
 {"id":"lune","titre":"La Part de Lune","serie":"Les Deux Collines — tome 1","auteur":"Écrit avec Claude",
  "genres":["Urban fantasy","Romance paranormale","Loups & Lycans","Âmes sœurs","Série"],"annee":"2026","couleur":"#1c2445",
  "statut":"À venir","couv":"couvertures/la-part-de-lune.svg",
  "resume":"Lyon, aujourd'hui. Sous les traboules, deux meutes se partagent les collines, et des femmes appelées Lieuses constatent les liens que personne n'a choisis. Maël, aide-soignante de nuit, est frappée par un lien d'âmes sœurs le soir où un Alpha lui amène un loup qui n'en est pas un — et rejetée par lui devant le Concile trois jours plus tard. Ce qu'on ne lui a pas dit : le Rejet est irrévocable pour celui qui le prononce. Pas pour celle qui le reçoit."},
 {"id":"vesper","titre":"Le Contrat de Vesper","auteur":"Écrit avec Claude",
  "genres":["Dark romance","Science-fiction","Futuriste","Obsession"],"annee":"2026","couleur":"#2b2b33",
  "statut":"En cours","couv":"couvertures/contrat-de-vesper.svg",
  "resume":"Vesper, 2049. Chaque citoyen porte un score, et le score se propage : un cousin condamné, une facture impayée, et Ilya tombe à 412 en servant un café. Un homme à 940 lui propose de porter son risque pendant un an, chez lui, selon un contrat de trente-deux pages qui ne dit pas ce qu'il attend d'elle. Il ne la touche pas. Il la regarde. Et dans trois pièces fermées, dix cartons portent les noms de celles qui l'ont précédée. Avertissements : rapport de pouvoir déséquilibré, surveillance, obsession."},
 {"id":"braises","titre":"La Saison des Braises","serie":"Les Trois Cents Lieues — tome 1","auteur":"Écrit avec Claude",
  "genres":["Romance sensuelle","Fantasy","Enemies to lovers","Slow burn","Série"],"annee":"2026","couleur":"#8a3a1f",
  "statut":"En cours","couv":"couvertures/saison-des-braises.svg",
  "resume":"Ysée Marrec ne dessine que ce qu'elle a vu, et la carte du Nord se termine en blanc : trois cents lieues au-delà de la Ligne des Cendres, là où la terre brûle depuis quatre-vingts ans. Pour la traverser, la Guilde lui donne un seul guide — Cael, un Braise, un homme que le feu a touché sans le tuer et qui ne connaît pas le froid. Ce qu'on ne lui a pas dit : la Ligne ne laisse passer que ceux qu'un Braise porte dans sa chaleur. Assez près. Pendant trois jours."},
 {"id":"verre","titre":"La Dette de Verre","auteur":"Écrit avec Claude",
  "genres":["Romance","Héritage","Secret de famille","Drame"],"annee":"2026","couleur":"#1f4a52",
  "statut":"En cours","couv":"couvertures/dette-de-verre.svg",
  "resume":"Directrice générale du groupe hôtelier Valadares, Nour Belkacem hérite de trente-quatre pour cent des parts — à condition d'être encore en poste le jour de la mort du patriarche. Le fils revenu d'exil veut sa révocation. Une lettre laissée sous scellés lui apprend pourquoi ce legs n'était pas un cadeau, mais une dette : en 1997, Henrique Valadares a ruiné son père. À Lisbonne, tout le monde a de bonnes raisons."},
]


def charger(bid):
    """Lit les chapitres markdown d'un livre.

    Le numéro peut porter un suffixe — « Chapitre 39 bis » —, pour un chapitre
    inséré après coup sans renuméroter tout ce qui suit. Il est alors gardé tel
    quel, sous forme de texte : la liseuse ne s'en sert que pour l'affichage,
    l'ordre de lecture venant du nom des fichiers (chapitre-39bis.md se range
    entre chapitre-39.md et chapitre-40.md).
    """
    chaps = []
    separations = SEPARATIONS.setdefault(bid, {})
    for f in sorted(glob.glob(f"chapitres/{bid}/chapitre-*.md")):
        txt = open(f, encoding="utf-8").read()
        m = re.search(r'## Chapitre (\d+(?: (?:bis|ter|quater))?) — (.+)', txt)
        if not m:
            print(f"  !! en-tête de chapitre introuvable : {f}")
            continue
        pov = re.search(r'\*POV (.+?)\*', txt)
        pov = pov.group(1).strip() if pov else ""
        corps = txt.split(f"*POV {pov}*", 1)[1] if pov else txt.split(m.group(0), 1)[1]
        # Les lignes « --- » séparent les scènes. Ce ne sont pas des paragraphes,
        # mais leur position compte : on relève l'indice du dernier paragraphe
        # avant chaque coupure, pour que la liseuse puisse la rendre.
        paras, coupures = [], []
        for bloc in corps.split("\n\n"):
            b = bloc.strip()
            if not b:
                continue
            if b == "---":
                if paras and (not coupures or coupures[-1] != len(paras) - 1):
                    coupures.append(len(paras) - 1)
                continue
            paras.append(re.sub(r'\*{1,2}(.+?)\*{1,2}', r'\1', b).replace("\n", " "))
        # Une coupure après le dernier paragraphe ne sépare rien.
        coupures = [i for i in coupures if i < len(paras) - 1]

        numero = m.group(1)
        numero = int(numero) if numero.isdigit() else numero
        chaps.append({"n": numero, "t": m.group(2).strip(), "pov": pov, "p": paras})
        if coupures:
            separations[str(numero)] = coupures
    return chaps


def fichiers_donnees(bid, chapitres):
    """Retourne la liste (nom de fichier, nom de constante, chapitres)."""
    if not chapitres:
        return []
    par_fichier = DECOUPAGE.get(bid)
    if not par_fichier:
        return [(f"data-{bid}.js", f"DATA_{bid.upper()}", chapitres)]
    lots = []
    for i in range(0, len(chapitres), par_fichier):
        n = i // par_fichier + 1
        lots.append((f"data-{bid}-p{n}.js", f"{bid.upper()}_P{n}", chapitres[i:i + par_fichier]))
    return lots


def ecrire_si_different(chemin, contenu):
    """Écrit le fichier et signale s'il a réellement changé."""
    ancien = None
    if os.path.exists(chemin):
        ancien = open(chemin, encoding="utf-8").read()
    # Un saut de ligne final n'est pas une différence : un fichier publié peut en
    # porter un que ce script ne produit pas, et sans cette tolérance il se
    # présenterait comme modifié à chaque passage — ce qui daterait le livre à
    # tort et masquerait les vrais changements.
    if ancien is not None and ancien.rstrip("\n") == contenu.rstrip("\n"):
        return False
    open(chemin, "w", encoding="utf-8").write(contenu)
    return True


def main():
    aujourdhui = datetime.date.today().isoformat()
    templates, modifies, resume = [], set(), []

    for meta in CATALOGUE:
        bid = meta["id"]
        chapitres = charger(bid)

        # fichiers de données
        lots = fichiers_donnees(bid, chapitres)
        attendus = set()
        for nom, constante, morceau in lots:
            chemin = os.path.join(DOSSIER, nom)
            attendus.add(nom)
            contenu = f"const {constante} = " + json.dumps(morceau, ensure_ascii=False) + ";"
            if ecrire_si_different(chemin, contenu):
                modifies.add(bid)

        # suppression des fichiers devenus inutiles (livre raccourci).
        # Uniquement si des chapitres ont été lus : un dossier absent ou vide
        # ne doit jamais entraîner la perte des données déjà publiées.
        if chapitres:
            for obsolete in glob.glob(os.path.join(DOSSIER, f"data-{bid}*.js")):
                if os.path.basename(obsolete) not in attendus:
                    os.remove(obsolete)
                    print(f"  supprimé : {obsolete}")
                    modifies.add(bid)
        elif glob.glob(os.path.join(DOSSIER, f"data-{bid}*.js")):
            print(f"  !! aucun chapitre lu pour « {bid} » : fichiers existants conservés")

        # couverture
        chemin_svg = meta.get("couv")
        if chemin_svg and os.path.exists(chemin_svg):
            svg = open(chemin_svg, encoding="utf-8").read()
            svg = re.sub(r'<\?xml.*?\?>', '', svg).strip()
            svg = re.sub(r'<metadata>.*?</metadata>', '', svg, flags=re.S)
            svg = svg.replace(' xmlns:c2pa="http://c2pa.org/manifest"', '')
            templates.append(f'<template class="couv" data-livre="{bid}">{svg}</template>')

        resume.append((meta["titre"], len(chapitres), meta["statut"], len(lots)))

    # couvertures dans index.html : uniquement si toutes les couvertures
    # attendues ont été trouvées, sinon on effacerait celles qui manquent.
    attendues = sum(1 for m in CATALOGUE if m.get("couv"))
    if os.path.exists(HTML) and templates and len(templates) == attendues:
        html = open(HTML, encoding="utf-8").read()
        bloc = '<div id="couvertures" hidden>' + "".join(templates) + '</div>'
        nouveau, n = re.subn(r'<div id="couvertures" hidden>.*?</div>\s*(?=<script)',
                             lambda m: bloc + "\n", html, flags=re.S)
        if n == 0:
            print("  !! bloc des couvertures introuvable dans index.html — non mis à jour")
        elif nouveau != html:
            open(HTML, "w", encoding="utf-8").write(nouveau)
            print("  couvertures mises à jour dans index.html")
    elif templates and len(templates) != attendues:
        manquantes = [m["couv"] for m in CATALOGUE
                      if m.get("couv") and not os.path.exists(m["couv"])]
        print("  !! couvertures manquantes, index.html laissé intact : "
              + ", ".join(manquantes))

    # dates de mise à jour dans app.js
    if modifies and os.path.exists(APP):
        app = open(APP, encoding="utf-8").read()
        debut = app.find("const BOOKS = [")
        fin = app.find("];", debut)
        if debut == -1 or fin == -1:
            print("  !! tableau BOOKS introuvable dans app.js — dates non mises à jour")
        else:
            livres = json.loads(app[debut + len("const BOOKS = "):fin + 1])
            for b in livres:
                if b["id"] in modifies:
                    b["maj"] = aujourdhui
            ligne = "const BOOKS = " + json.dumps(livres, ensure_ascii=False) + ";"
            open(APP, "w", encoding="utf-8").write(app[:debut] + ligne + app[fin + 2:])
            print(f"  dates mises à jour ({aujourdhui}) : {', '.join(sorted(modifies))}")

    # coupures de scène dans app.js, sur leur propre ligne à la suite de BOOKS
    if os.path.exists(APP):
        sep = {b: ch for b, ch in SEPARATIONS.items() if ch}
        ligne = "const SEPARATEURS = " + json.dumps(sep, ensure_ascii=False) + ";"
        app = open(APP, encoding="utf-8").read()
        trouve = re.search(r'^const SEPARATEURS = .*;$', app, flags=re.M)
        if trouve:
            nouveau = app[:trouve.start()] + ligne + app[trouve.end():]
        else:
            fin = app.find("];")          # fin de la ligne BOOKS
            if fin == -1:
                nouveau = app
                print("  !! BOOKS introuvable dans app.js — coupures non écrites")
            else:
                nouveau = app[:fin + 2] + "\n" + ligne + app[fin + 2:]
        if nouveau != app:
            open(APP, "w", encoding="utf-8").write(nouveau)
            total = sum(len(c) for ch in sep.values() for c in ch.values())
            print(f"  coupures de scène relevées : {total}")

    print()
    for titre, n, statut, lots in resume:
        suffixe = f" — {lots} fichier(s)" if lots > 1 else ""
        print(f"  {titre} — {n} chapitres ({statut}){suffixe}")
    if not modifies:
        print("\n  Aucun texte modifié.")


if __name__ == "__main__":
    main()
