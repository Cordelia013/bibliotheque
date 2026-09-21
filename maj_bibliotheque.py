#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Régénère la bibliothèque à partir des dossiers chapitres/<id>/.

Écrit ce que la liseuse charge :

    docs/catalogue.json          le catalogue : métadonnées de chaque livre, index
                                 léger des chapitres (numéro, titre, point de vue,
                                 nombre de mots), liste des morceaux de texte avec
                                 leur version, fiches personnages
    docs/data-<id>-pN.json       les morceaux : CHAPITRES_PAR_MORCEAU chapitres par
                                 fichier, avec leurs paragraphes et leurs coupures
                                 de scène

et réinjecte les couvertures SVG de couvertures/ dans docs/index.html.

La liseuse ne télécharge que le catalogue au démarrage, puis un morceau quand
on lit un chapitre qu'il contient. Chaque morceau porte dans son adresse une
version tirée de son contenu (data-braises-p3.json?v=1a2b3c4d) : le navigateur
et le service worker peuvent le garder indéfiniment, une nouvelle publication
change l'adresse.

Le script ne touche jamais au code de l'application (docs/app.js, docs/sw.js) :
le moteur ne contient aucun contenu, et le contenu ne contient aucun code.
Les fiches personnages se tiennent dans personnages.json, à la racine.
"""
import datetime, glob, hashlib, json, os, re

# La date de mise à jour d'un livre doit être la même qu'on publie depuis un
# ordinateur à Paris ou depuis l'action GitHub, qui tourne en temps universel.
try:
    from zoneinfo import ZoneInfo
    FUSEAU = ZoneInfo("Europe/Paris")
except Exception:                                  # pas de base de fuseaux : UTC
    FUSEAU = datetime.timezone.utc

HTML = "docs/index.html"
DOSSIER = "docs"
CATALOGUE_JSON = os.path.join(DOSSIER, "catalogue.json")
PERSONNAGES = "personnages.json"

# Version du contrat entre ce script et la liseuse. À incrémenter si la forme
# du catalogue ou des morceaux change de façon que l'ancienne liseuse ne
# saurait pas lire.
FORMAT = 3

# Un morceau pèse de l'ordre de 10 à 20 Ko compressés à six chapitres : c'est
# ce que coûte l'ouverture d'un chapitre au lecteur. DECOUPAGE permet de
# régler un livre à part.
CHAPITRES_PAR_MORCEAU = 6
DECOUPAGE = {}                                   # id -> chapitres par morceau

# « revision » : à changer quand un livre cesse d'être le même texte — réécriture,
# renumérotation, fusion de chapitres. La progression des lecteurs est stockée par
# indice ; sans ce marqueur, un lecteur garderait une position devenue fausse sans
# que rien ne le signale. La liseuse remet alors ce livre à zéro, une fois, et le
# dit. Un livre sans « revision » n'est jamais remis à zéro.

CATALOGUE = [
 {"id":"castellano","titre":"Le Prix du Silence, Don Castellano","auteur":"Écrit avec Claude",
  "genres":["Romance mafieuse","Vengeance","Drame","Suspense"],"annee":"2026","couleur":"#6d1f2c",
  "statut":"Terminé","couv":"couvertures/don-castellano.svg","couv_image":"couvertures/castellano.svg",
  "revision":"v2-2026-09-20",
  "resume":"Livia Sarti est la consigliere de la famille Castellano et, depuis trois ans, l'épouse secrète de son Don. Une balle sur le quai nord, un appel auquel il répond sans savoir que c'est elle, et tout s'écroule. Elle rend les clés, demande le divorce devant vingt-deux couverts, et s'allie à la famille rivale. Huit ans pour comprendre qu'on n'attend pas qu'on écrive votre nom quelque part : on l'écrit."},
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
  "statut":"En cours","couv":"couvertures/saison-des-braises.svg","couv_image":"couvertures/braises.svg",
  "resume":"Ysée Marrec ne dessine que ce qu'elle a vu, et la carte du Nord se termine en blanc : trois cents lieues au-delà de la Ligne des Cendres, là où la terre brûle depuis quatre-vingts ans. Pour la traverser, la Guilde lui donne un seul guide — Cael, un Braise, un homme que le feu a touché sans le tuer et qui ne connaît pas le froid. Ce qu'on ne lui a pas dit : la Ligne ne laisse passer que ceux qu'un Braise porte dans sa chaleur. Assez près. Pendant trois jours."},
 {"id":"verre","titre":"La Dette de Verre","auteur":"Écrit avec Claude",
  "genres":["Romance","Héritage","Secret de famille","Drame"],"annee":"2026","couleur":"#1f4a52",
  "statut":"En cours","couv":"couvertures/dette-de-verre.svg",
  "resume":"Directrice générale du groupe hôtelier Valadares, Nour Belkacem hérite de trente-quatre pour cent des parts — à condition d'être encore en poste le jour de la mort du patriarche. Le fils revenu d'exil veut sa révocation. Une lettre laissée sous scellés lui apprend pourquoi ce legs n'était pas un cadeau, mais une dette : en 1997, Henrique Valadares a ruiné son père. À Lisbonne, tout le monde a de bonnes raisons."},
]

def fichiers_du_livre(bid):
    """Les fichiers d'un livre, dans l'ordre de lecture.

    Un prologue et un épilogue encadrent les chapitres, quel que soit le tri du
    système de fichiers : prologue.md d'abord, chapitre-*.md ensuite dans l'ordre
    de leur nom, epilogue.md en dernier. Les trois sont facultatifs.
    """
    d = f"chapitres/{bid}"
    avant = [p for p in (os.path.join(d, "prologue.md"),) if os.path.exists(p)]
    apres = [p for p in (os.path.join(d, "epilogue.md"),) if os.path.exists(p)]
    return avant + sorted(glob.glob(os.path.join(d, "chapitre-*.md"))) + apres


def charger(bid):
    """Lit les chapitres markdown d'un livre.

    Le numéro peut porter un suffixe — « Chapitre 39 bis » —, pour un chapitre
    inséré après coup sans renuméroter tout ce qui suit. Il est alors gardé tel
    quel, sous forme de texte : la liseuse ne s'en sert que pour l'affichage,
    l'ordre de lecture venant du nom des fichiers (chapitre-39bis.md se range
    entre chapitre-39.md et chapitre-40.md).

    Un prologue ou un épilogue porte son nom en guise de numéro — « Prologue »,
    « Épilogue ». La liseuse n'écrit « Chapitre » devant un numéro que s'il
    commence par un chiffre.

    Chaque chapitre rendu porte ses paragraphes (p) et les indices des
    paragraphes après lesquels tombe une coupure de scène (s) — les lignes
    « --- » du manuscrit. Les deux voyagent ensemble : une coupure indexe des
    paragraphes, elle ne peut pas venir d'une autre publication qu'eux.
    """
    chaps = []
    for f in fichiers_du_livre(bid):
        txt = open(f, encoding="utf-8").read()
        m = re.search(r'## (?:Chapitre (\d+(?: (?:bis|ter|quater))?)|(Prologue|Épilogue)) — (.+)', txt)
        if not m:
            print(f"  !! en-tête de chapitre introuvable : {f}")
            continue
        pov_m = re.search(r'\*POV (.+?)\*', txt)
        pov = pov_m.group(1).strip() if pov_m else ""
        corps = txt[pov_m.end():] if pov_m else txt[m.end():]
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

        if m.group(2):                             # Prologue, Épilogue
            numero = m.group(2)
        else:
            numero = m.group(1)
            numero = int(numero) if numero.isdigit() else numero
        chaps.append({"n": numero, "t": m.group(3).strip(), "pov": pov, "p": paras, "s": coupures})
    return chaps


def mots(chapitre):
    """Même compte que la liseuse : les mots séparés par des blancs."""
    return len(" ".join(chapitre["p"]).split())


def morceaux(bid, chapitres):
    """Découpe un livre en lots : (nom de fichier, chapitres, premier indice, dernier indice)."""
    pas = DECOUPAGE.get(bid, CHAPITRES_PAR_MORCEAU)
    lots = []
    for i in range(0, len(chapitres), pas):
        n = i // pas + 1
        lots.append((f"data-{bid}-p{n}.json", chapitres[i:i + pas], i, min(i + pas, len(chapitres)) - 1))
    return lots


def version(contenu):
    """Huit caractères tirés du contenu : l'adresse d'un morceau change avec son texte."""
    return hashlib.sha1(contenu.encode("utf-8")).hexdigest()[:8]


def lire_json(chemin):
    try:
        return json.load(open(chemin, encoding="utf-8"))
    except (OSError, ValueError):
        return None


def publie_precedemment(bid, catalogue_precedent):
    """Les chapitres tels qu'ils ont été publiés la dernière fois, d'après le
    catalogue précédent et les morceaux qu'il cite. Sert à ne dater un livre que
    si son texte a changé. None si rien n'a encore été publié."""
    for livre in (catalogue_precedent or {}).get("livres", []):
        if livre.get("id") != bid:
            continue
        chapitres = []
        for m in livre.get("morceaux", []):
            data = lire_json(os.path.join(DOSSIER, m["url"].split("?")[0]))
            if data is None:
                return None
            chapitres.extend(data)
        return chapitres
    return None


def meme_texte(avant, apres):
    """Même texte publié : mêmes chapitres, paragraphes et coupures."""
    if avant is None or len(avant) != len(apres):
        return False
    cles = ("n", "t", "pov", "p", "s")
    return all(all(a.get(k) == b.get(k) for k in cles) for a, b in zip(avant, apres))


def ecrire_morceau(chemin, morceau):
    """Écrit le morceau s'il diffère, octet pour octet, et rend son contenu."""
    contenu = json.dumps(morceau, ensure_ascii=False, indent=0)
    if not os.path.exists(chemin) or open(chemin, encoding="utf-8").read() != contenu:
        open(chemin, "w", encoding="utf-8").write(contenu)
    return contenu


def dates_precedentes(catalogue_precedent):
    """Les dates de dernière mise à jour du catalogue précédent, par livre."""
    return {b["id"]: b.get("maj") for b in (catalogue_precedent or {}).get("livres", []) if "id" in b}


def lire_personnages():
    """personnages.json est facultatif ; mais s'il existe et ne se lit pas, on
    s'arrête : publier un catalogue sans fiches parce qu'une virgule traîne
    serait une régression silencieuse."""
    if not os.path.exists(PERSONNAGES):
        print(f"  (pas de {PERSONNAGES} : aucune fiche personnage)")
        return {}
    try:
        data = json.load(open(PERSONNAGES, encoding="utf-8"))
    except ValueError as e:
        raise SystemExit(f"  !! {PERSONNAGES} illisible : {e}")
    if not isinstance(data, dict):
        raise SystemExit(f"  !! {PERSONNAGES} : un objet {{id du livre: [fiches]}} est attendu")
    return data


def couvertures_dans_index(templates, manquantes):
    """Réinjecte les couvertures SVG dans index.html — uniquement si toutes
    celles qui sont attendues ont été trouvées, sinon on effacerait celles qui
    manquent."""
    if not os.path.exists(HTML) or not templates:
        return
    if manquantes:
        print("  !! couvertures manquantes, index.html laissé intact : " + ", ".join(manquantes))
        return
    html = open(HTML, encoding="utf-8").read()
    bloc = '<div id="couvertures" hidden>' + "".join(templates) + '</div>'
    nouveau, n = re.subn(r'<div id="couvertures" hidden>.*?</div>\s*(?=<script)',
                         lambda m: bloc + "\n", html, flags=re.S)
    if n == 0:
        print("  !! bloc des couvertures introuvable dans index.html — non mis à jour")
    elif nouveau != html:
        open(HTML, "w", encoding="utf-8").write(nouveau)
        print("  couvertures mises à jour dans index.html")


def main():
    aujourdhui = datetime.datetime.now(FUSEAU).date().isoformat()
    precedent = lire_json(CATALOGUE_JSON)
    dates = dates_precedentes(precedent)
    personnages = lire_personnages()
    livres, templates, modifies, resume = [], [], set(), []

    for meta in CATALOGUE:
        bid = meta["id"]
        chapitres = charger(bid)
        if chapitres and not meme_texte(publie_precedemment(bid, precedent), chapitres):
            modifies.add(bid)
        lots = morceaux(bid, chapitres)

        # morceaux de texte, et leur version
        liste_morceaux, attendus = [], set()
        for nom, morceau, de, a in lots:
            contenu = ecrire_morceau(os.path.join(DOSSIER, nom), morceau)
            attendus.add(nom)
            liste_morceaux.append({"url": f"{nom}?v={version(contenu)}", "de": de, "a": a})

        # fichiers devenus inutiles : livre raccourci, ou ancien format .js.
        # Uniquement si des chapitres ont été lus : un dossier absent ou vide
        # ne doit jamais entraîner la perte des données déjà publiées.
        if chapitres:
            for obsolete in glob.glob(os.path.join(DOSSIER, f"data-{bid}*.js*")):
                if os.path.basename(obsolete) not in attendus:
                    os.remove(obsolete)
                    print(f"  supprimé : {obsolete}")
        elif glob.glob(os.path.join(DOSSIER, f"data-{bid}*.js*")):
            print(f"  !! aucun chapitre lu pour « {bid} » : fichiers existants conservés")

        # couverture vectorielle, injectée dans index.html
        chemin_svg = meta.get("couv")
        couv = bool(chemin_svg and os.path.exists(chemin_svg))
        if couv:
            svg = open(chemin_svg, encoding="utf-8").read()
            svg = re.sub(r'<\?xml.*?\?>', '', svg).strip()
            svg = re.sub(r'<metadata>.*?</metadata>', '', svg, flags=re.S)
            svg = svg.replace(' xmlns:c2pa="http://c2pa.org/manifest"', '')
            templates.append(f'<template class="couv" data-livre="{bid}">{svg}</template>')

        # couverture en image, servie telle quelle depuis docs/
        couv_image = meta.get("couv_image")
        if couv_image and not os.path.exists(os.path.join(DOSSIER, couv_image)):
            print(f"  !! couverture en image introuvable : docs/{couv_image}")
            couv_image = None

        livre = {k: meta[k] for k in ("id", "titre", "serie", "auteur", "genres", "annee",
                                      "couleur", "statut", "resume", "parties",
                                      "revision") if k in meta}
        livre["couv"] = couv
        if couv_image:
            livre["couvImage"] = couv_image
        livre["maj"] = aujourdhui if bid in modifies else dates.get(bid)
        livre["chapitres"] = [{"n": c["n"], "t": c["t"], "pov": c["pov"], "mots": mots(c)} for c in chapitres]
        livre["morceaux"] = liste_morceaux
        livre["personnages"] = personnages.get(bid, [])
        livres.append(livre)
        resume.append((meta["titre"], len(chapitres), meta["statut"], len(lots)))

    # La date du catalogue est celle du dernier changement de texte : relancer le
    # script un autre jour sans rien changer ne doit rien réécrire.
    genere = max([b["maj"] for b in livres if b.get("maj")] or [aujourdhui])
    catalogue = {"format": FORMAT, "genere": genere, "livres": livres}
    contenu = json.dumps(catalogue, ensure_ascii=False, indent=1)
    if not os.path.exists(CATALOGUE_JSON) or open(CATALOGUE_JSON, encoding="utf-8").read() != contenu:
        open(CATALOGUE_JSON, "w", encoding="utf-8").write(contenu)
        print("  catalogue écrit")

    couvertures_dans_index(templates, [m["couv"] for m in CATALOGUE
                                       if m.get("couv") and not os.path.exists(m["couv"])])

    if modifies:
        print(f"  dates mises à jour ({aujourdhui}) : {', '.join(sorted(modifies))}")
    print()
    for titre, n, statut, lots in resume:
        suffixe = f" — {lots} morceau(x)" if lots else ""
        print(f"  {titre} — {n} chapitres ({statut}){suffixe}")
    if not modifies:
        print("\n  Aucun texte modifié.")


if __name__ == "__main__":
    main()
