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
from datetime import datetime, timezone
from html import escape

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(RACINE, "docs")
SORTIE = os.path.join(DOCS, "epub")

CATALOGUE = os.path.join(DOCS, "catalogue.json")
LANGUE = "fr"


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


def page_chapitre(chapitre):
    # Les coupures de scène (s) : indices des paragraphes après lesquels elles tombent.
    coupures = set(chapitre.get("s", []))
    lignes = []
    for i, p in enumerate(chapitre["p"]):
        lignes.append("    <p>%s</p>" % escape(p))
        if i in coupures:
            lignes.append('    <p class="scene">\u00b7 \u00b7 \u00b7</p>')
    paragraphes = "\n".join(lignes)
    return """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{langue}" lang="{langue}">
<head>
  <meta charset="utf-8"/>
  <title>Chapitre {n} — {titre}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <section>
    <p class="chapnum">Chapitre {n}</p>
    <h2>{titre}</h2>
    <p class="pov">Point de vue — {pov}</p>
{paragraphes}
  </section>
</body>
</html>
""".format(
        langue=LANGUE,
        n=chapitre["n"],
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
p.scene { text-indent: 0; text-align: center; letter-spacing: .5em; margin: 1.6em 0; }
section.garde { text-align: center; margin-top: 25%; }
"""

CONTAINER = """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
"""


def contenu_opf(titre, auteur, uid, chapitres, date):
    manifeste = [
        '<item id="style" href="style.css" media-type="text/css"/>',
        '<item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/>',
        '<item id="garde" href="garde.xhtml" media-type="application/xhtml+xml"/>',
    ]
    colonne = ['<itemref idref="garde"/>']
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
        '      <li><a href="ch%d.xhtml">Chapitre %s — %s</a></li>'
        % (i, c["n"], escape(c["t"]))
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


def ecrire_epub(livre_id, titre, auteur, chapitres):
    os.makedirs(SORTIE, exist_ok=True)
    cible = os.path.join(SORTIE, livre_id + ".epub")
    date = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    uid = identifiant(titre)

    with zipfile.ZipFile(cible, "w") as z:
        # mimetype : premier fichier, non compressé (exigence de la norme)
        z.writestr(
            zipfile.ZipInfo("mimetype"),
            "application/epub+zip",
            compress_type=zipfile.ZIP_STORED,
        )
        z.writestr("META-INF/container.xml", CONTAINER, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/style.css", STYLE, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/garde.xhtml", page_titre(titre, auteur, len(chapitres)), zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/nav.xhtml", navigation(titre, chapitres), zipfile.ZIP_DEFLATED)
        z.writestr(
            "OEBPS/content.opf",
            contenu_opf(titre, auteur, uid, chapitres, date),
            zipfile.ZIP_DEFLATED,
        )
        for i, c in enumerate(chapitres, 1):
            z.writestr("OEBPS/ch%d.xhtml" % i, page_chapitre(c), zipfile.ZIP_DEFLATED)

    return cible, os.path.getsize(cible)


def main():
    total = 0
    for livre in lire_catalogue().get("livres", []):
        livre_id = livre["id"]
        try:
            chapitres = chapitres_du_livre(livre)
        except FileNotFoundError as e:
            print("  ignoré (%s absent) : %s" % (os.path.basename(str(e)), livre_id))
            continue
        if not chapitres:
            print("  ignoré (aucun chapitre) : %s" % livre_id)
            continue
        cible, taille = ecrire_epub(livre_id, livre["titre"], livre.get("auteur", ""), chapitres)
        print(
            "  %-12s %2d chapitres  %6.1f Ko  %s"
            % (livre_id, len(chapitres), taille / 1024, os.path.relpath(cible, RACINE))
        )
        total += 1
    print("%d fichier(s) EPUB généré(s)." % total)
    return 0 if total else 1


if __name__ == "__main__":
    sys.exit(main())
