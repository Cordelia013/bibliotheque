#!/usr/bin/env python3
"""Régénère la bibliothèque à partir des dossiers chapitres/<id>/.
Ne crée jamais de nouveau fichier de liseuse : met à jour docs/index.html (couvertures)
et docs/books.js (texte des livres) en place."""
import re, json, glob, os

HTML = "docs/index.html"
JS = "docs/books.js"

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
    chaps = []
    for f in sorted(glob.glob(f"chapitres/{bid}/chapitre-*.md")):
        txt = open(f, encoding="utf-8").read()
        m = re.search(r'## Chapitre (\d+) — (.+)', txt)
        pov = re.search(r'\*POV (.+?)\*', txt)
        pov = pov.group(1).strip() if pov else ""
        corps = txt.split(f"*POV {pov}*", 1)[1] if pov else txt.split(m.group(0),1)[1]
        paras = [p.strip() for p in corps.split("\n\n") if p.strip() and p.strip() != "---"]
        paras = [re.sub(r'\*{1,2}(.+?)\*{1,2}', r'\1', p).replace("\n", " ") for p in paras]
        chaps.append({"n": int(m.group(1)), "t": m.group(2).strip(), "pov": pov, "p": paras})
    return chaps

livres, templates = [], []
for b in CATALOGUE:
    b = dict(b); b["chapitres"] = charger(b["id"])
    chemin = b.pop("couv", None)
    if chemin and os.path.exists(chemin):
        svg = open(chemin, encoding="utf-8").read()
        svg = re.sub(r'<\?xml.*?\?>', '', svg).strip()
        svg = re.sub(r'<metadata>.*?</metadata>', '', svg, flags=re.S)
        svg = svg.replace(' xmlns:c2pa="http://c2pa.org/manifest"', '')
        templates.append(f'<template class="couv" data-livre="{b["id"]}">{svg}</template>')
        b["couv"] = True
    livres.append(b)

# Texte des livres : fichier séparé, chargé par index.html via <script src="books.js">
js = "const BOOKS = " + json.dumps(livres, ensure_ascii=False) + ";"
open(JS, "w", encoding="utf-8").write(js + "\n")

# Couvertures : mises à jour en place dans index.html
html = open(HTML, encoding="utf-8").read()
bloc = '<div id="couvertures" hidden>' + "".join(templates) + '</div>'
html = re.sub(r'<div id="couvertures" hidden>.*?</div>\s*(?=<script>)',
              lambda m: bloc + "\n", html, flags=re.S)
open(HTML, "w", encoding="utf-8").write(html)
for b in livres:
    print(f"  {b['titre']} — {len(b['chapitres'])} chapitres ({b['statut']})")
