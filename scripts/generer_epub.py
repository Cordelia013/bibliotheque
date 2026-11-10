#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère un fichier EPUB par livre à partir de docs/catalogue.json et des morceaux
de texte docs/data-<id>-pN.json qu'il cite — ce que la liseuse lit elle-même,
sans liste de fichiers tenue à part.

Aucune dépendance externe : un EPUB est une archive ZIP dont la structure
est normalisée, produite ici avec zipfile et json de la bibliothèque standard.

Usage :
    python3 scripts/generer_epub.py

Sortie :
    docs/epub/<id>.epub
"""

import json
import os
import re
import sys
import unicodedata
import zipfile
from html import escape
from xml.etree import ElementTree

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(RACINE, "docs")
SORTIE = os.path.join(DOCS, "epub")

CATALOGUE = os.path.join(DOCS, "catalogue.json")
INDEX = os.path.join(DOCS, "index.html")
LANGUE = "fr"

# Date portée par chaque entrée de l'archive. Fixe : deux générations du même
# texte doivent donner le même fichier, à l'octet près, sans quoi l'action
# recommiterait tous les EPUB à chaque passage.
DATE_ARCHIVE = (1980, 1, 1, 0, 0, 0)


def lire_catalogue():
    with open(CATALOGUE, encoding="utf-8") as f:
        return json.load(f)


def chapitres_du_livre(livre):
    """Assemble les morceaux d'un livre, dans l'ordre du catalogue."""
    chapitres = []
    for m in livre.get("morceaux", []):
        chemin = os.path.join(DOCS, m["url"].split("?")[0])
        if not os.path.exists(chemin):
            raise FileNotFoundError(chemin)
        with open(chemin, encoding="utf-8") as f:
            chapitres.extend(json.load(f))
    return chapitres


def identifiant(titre):
    """Identifiant stable et lisible, dérivé du titre."""
    base = unicodedata.normalize("NFKD", titre).encode("ascii", "ignore").decode()
    base = re.sub(r"[^a-zA-Z0-9]+", "-", base).strip("-").lower()
    return "bibliotheque-" + base


def libelle(n):
    """Même règle que la liseuse : « Chapitre » ne précède un numéro que s'il
    commence par un chiffre — « 12 », « 39 bis ». Ailleurs le nom de la section
    se suffit : « Prologue », et non « Chapitre Prologue »."""
    n = str(n)
    return "Chapitre " + n if n[:1].isdigit() else n


def couverture(livre):
    """La couverture du livre, en SVG, ou None.

    Même priorité que la liseuse : la couverture en image déclarée par le
    catalogue (couvImage) d'abord, sinon la vectorielle injectée dans
    index.html. Une couverture qui ne serait pas du XML bien formé est écartée :
    elle rendrait l'archive invalide.
    """
    svg = None
    image = livre.get("couvImage")
    if image and os.path.exists(os.path.join(DOCS, image)):
        with open(os.path.join(DOCS, image), encoding="utf-8") as f:
            svg = f.read()
    elif livre.get("couv") and os.path.exists(INDEX):
        with open(INDEX, encoding="utf-8") as f:
            m = re.search(
                r'<template class="couv" data-livre="%s">(.*?)</template>' % re.escape(livre["id"]),
                f.read(), flags=re.S)
        svg = m.group(1) if m else None
    if not svg:
        return None
    svg = re.sub(r"<\?xml.*?\?>", "", svg).strip()
    try:
        ElementTree.fromstring(svg)
    except ElementTree.ParseError as e:
        print("  !! couverture écartée (%s) : %s" % (e, livre["id"]))
        return None
    return '<?xml version="1.0" encoding="utf-8"?>\n' + svg + "\n"


def page_couverture(titre):
    return """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{langue}" lang="{langue}">
<head>
  <meta charset="utf-8"/>
  <title>{titre}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body class="couverture">
  <img src="couverture.svg" alt="Couverture : {titre}"/>
</body>
</html>
""".format(langue=LANGUE, titre=escape(titre))


def fragment(p):
    """Un paragraphe publié, sûr pour du XHTML.

    Depuis le format 4 du catalogue, un paragraphe est du texte échappé où
    seules <em> et <strong> sont permises. On s'en assure plutôt que de s'y
    fier : tout autre « < » et toute esperluette isolée sont échappés ici.
    """
    p = re.sub(r"&(?!(?:amp|lt|gt|quot|#\d+);)", "&amp;", p)
    p = re.sub(r"<(?!/?(?:em|strong)>)", "&lt;", p)
    # Un retour à la ligne dans le paragraphe en est un dans le livre.
    return p.replace("\n", "<br/>")


def page_chapitre(chapitre):
    # Les coupures de scène (s) : indices des paragraphes après lesquels elles tombent.
    coupures = set(chapitre.get("s", []))
    lignes = []
    for i, p in enumerate(chapitre["p"]):
        # Un paragraphe en plusieurs lignes — plaque, liste — ne se justifie ni ne s'indente.
        lignes.append("    <p%s>%s</p>" % (' class="lignes"' if "\n" in p else "", fragment(p)))
        if i in coupures:
            lignes.append('    <p class="scene">\u00b7 \u00b7 \u00b7</p>')
    paragraphes = "\n".join(lignes)
    return """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{langue}" lang="{langue}">
<head>
  <meta charset="utf-8"/>
  <title>{n} — {titre}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <section>
    <p class="chapnum">{n}</p>
    <h2>{titre}</h2>
    <p class="pov">Point de vue — {pov}</p>
{paragraphes}
  </section>
</body>
</html>
""".format(
        langue=LANGUE,
        n=escape(libelle(chapitre["n"])),
        titre=escape(chapitre["t"]),
        pov=escape(chapitre["pov"]),
        paragraphes=paragraphes,
    )


def page_titre(titre, auteur, nb):
    return """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{langue}" lang="{langue}">
<head>
  <meta charset="utf-8"/>
  <title>{titre}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <section class="garde">
    <h1>{titre}</h1>
    <p class="auteur">{auteur}</p>
    <p class="info">{nb} chapitres</p>
  </section>
</body>
</html>
""".format(langue=LANGUE, titre=escape(titre), auteur=escape(auteur), nb=nb)


STYLE = """@charset "utf-8";
body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; margin: 1em; }
h1 { font-size: 1.8em; font-weight: 600; line-height: 1.2; margin: 0 0 .4em; }
h2 { font-size: 1.4em; font-weight: 600; line-height: 1.2; margin: 0 0 .2em; }
p { margin: 0 0 1em; text-align: justify; text-indent: 1.2em; }
p.chapnum { text-indent: 0; font-size: .8em; letter-spacing: .2em;
  text-transform: uppercase; margin-bottom: .4em; }
p.pov { text-indent: 0; font-style: italic; margin-bottom: 1.6em; }
p.auteur, p.info { text-indent: 0; font-size: .9em; }
p.lignes { text-indent: 0; text-align: left; }
p.scene { text-indent: 0; text-align: center; letter-spacing: .5em; margin: 1.6em 0; }
section.garde { text-align: center; margin-top: 25%; }
body.couverture { margin: 0; text-align: center; }
body.couverture img { max-width: 100%; max-height: 100%; }
"""

CONTAINER = """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
"""


def contenu_opf(titre, auteur, uid, chapitres, date, avec_couverture):
    manifeste = [
        '<item id="style" href="style.css" media-type="text/css"/>',
        '<item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/>',
        '<item id="garde" href="garde.xhtml" media-type="application/xhtml+xml"/>',
    ]
    colonne = ['<itemref idref="garde"/>']
    if avec_couverture:
        manifeste += [
            '<item id="couverture-image" href="couverture.svg" properties="cover-image" media-type="image/svg+xml"/>',
            '<item id="couverture" href="couverture.xhtml" media-type="application/xhtml+xml"/>',
        ]
        colonne.insert(0, '<itemref idref="couverture"/>')
    for i, _ in enumerate(chapitres, 1):
        manifeste.append(
            '<item id="ch%d" href="ch%d.xhtml" media-type="application/xhtml+xml"/>' % (i, i)
        )
        colonne.append('<itemref idref="ch%d"/>' % i)
    return """<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">{uid}</dc:identifier>
    <dc:title>{titre}</dc:title>
    <dc:creator>{auteur}</dc:creator>
    <dc:language>{langue}</dc:language>
    <meta property="dcterms:modified">{date}</meta>
  </metadata>
  <manifest>
    {manifeste}
  </manifest>
  <spine>
    {colonne}
  </spine>
</package>
""".format(
        uid=uid,
        titre=escape(titre),
        auteur=escape(auteur),
        langue=LANGUE,
        date=date,
        manifeste="\n    ".join(manifeste),
        colonne="\n    ".join(colonne),
    )


def navigation(titre, chapitres):
    entrees = "\n".join(
        '      <li><a href="ch%d.xhtml">%s — %s</a></li>'
        % (i, escape(libelle(c["n"])), escape(c["t"]))
        for i, c in enumerate(chapitres, 1)
    )
    return """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"
      xml:lang="{langue}" lang="{langue}">
<head><meta charset="utf-8"/><title>Sommaire</title></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Sommaire</h1>
    <ol>
      <li><a href="garde.xhtml">{titre}</a></li>
{entrees}
    </ol>
  </nav>
</body>
</html>
""".format(langue=LANGUE, titre=escape(titre), entrees=entrees)


def ecrire_epub(livre, chapitres, date):
    """Écrit l'archive. Rien n'y dépend de l'heure de la génération : les
    entrées portent une date fixe, et « dcterms:modified » celle du dernier
    changement de texte du livre."""
    os.makedirs(SORTIE, exist_ok=True)
    cible = os.path.join(SORTIE, livre["id"] + ".epub")
    titre, auteur = livre["titre"], livre.get("auteur", "")
    svg = couverture(livre)

    with zipfile.ZipFile(cible, "w") as z:
        def ajouter(nom, contenu, compression=zipfile.ZIP_DEFLATED):
            info = zipfile.ZipInfo(nom, date_time=DATE_ARCHIVE)
            info.external_attr = 0o644 << 16
            z.writestr(info, contenu, compress_type=compression)

        # mimetype : premier fichier, non compressé (exigence de la norme)
        ajouter("mimetype", "application/epub+zip", zipfile.ZIP_STORED)
        ajouter("META-INF/container.xml", CONTAINER)
        ajouter("OEBPS/style.css", STYLE)
        if svg:
            ajouter("OEBPS/couverture.svg", svg)
            ajouter("OEBPS/couverture.xhtml", page_couverture(titre))
        ajouter("OEBPS/garde.xhtml", page_titre(titre, auteur, len(chapitres)))
        ajouter("OEBPS/nav.xhtml", navigation(titre, chapitres))
        ajouter("OEBPS/content.opf",
                contenu_opf(titre, auteur, identifiant(titre), chapitres, date, bool(svg)))
        for i, c in enumerate(chapitres, 1):
            ajouter("OEBPS/ch%d.xhtml" % i, page_chapitre(c))

    return cible, os.path.getsize(cible)


def main():
    total = 0
    catalogue = lire_catalogue()
    for livre in catalogue.get("livres", []):
        livre_id = livre["id"]
        try:
            chapitres = chapitres_du_livre(livre)
        except FileNotFoundError as e:
            print("  ignoré (%s absent) : %s" % (os.path.basename(str(e)), livre_id))
            continue
        if not chapitres:
            print("  ignoré (aucun chapitre) : %s" % livre_id)
            continue
        # La date du livre est celle de son dernier changement de texte.
        jour = livre.get("maj") or catalogue.get("genere") or "1980-01-01"
        cible, taille = ecrire_epub(livre, chapitres, jour + "T00:00:00Z")
        print(
            "  %-12s %2d chapitres  %6.1f Ko  %s"
            % (livre_id, len(chapitres), taille / 1024, os.path.relpath(cible, RACINE))
        )
        total += 1
    print("%d fichier(s) EPUB généré(s)." % total)
    return 0 if total else 1


if __name__ == "__main__":
    sys.exit(main())
