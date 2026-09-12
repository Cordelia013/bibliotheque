#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère les icônes de l'application à partir d'un dessin décrit en code.

Aucune dépendance externe : l'encodeur PNG est écrit à la main avec zlib et
struct de la bibliothèque standard. Les navigateurs et les systèmes mobiles
exigent du PNG pour l'icône d'écran d'accueil ; un SVG ne suffit pas sur iOS.

Motif : fond nuit (#14161a), filet laiton, croissant de lune — la lune
reprend le motif de la couverture de « La Part de Lune », le filet celui
qui encadre les cinq couvertures.

Usage :
    python3 scripts/generer_icones.py

Sortie :
    docs/icone-192.png
    docs/icone-512.png
    docs/apple-touch-icon.png   (180 px, requis par iOS)
"""

import math
import os
import struct
import sys
import zlib

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(RACINE, "docs")

FOND = (0x14, 0x16, 0x1A)
LAITON = (0xC9, 0xA3, 0x5C)
LUNE = (0xF4, 0xE9, 0xC8)
OMBRE = (0x1C, 0x24, 0x45)


def melange(fond, dessus, alpha):
    """Compose une couleur sur une autre avec une opacité de 0 à 1."""
    return tuple(
        int(round(fond[i] * (1 - alpha) + dessus[i] * alpha)) for i in range(3)
    )


def couverture_disque(px, py, cx, cy, r, echantillons=4):
    """Fraction du pixel couverte par un disque, par sur-échantillonnage."""
    dedans = 0
    pas = 1.0 / echantillons
    for sy in range(echantillons):
        for sx in range(echantillons):
            x = px + (sx + 0.5) * pas
            y = py + (sy + 0.5) * pas
            if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                dedans += 1
    return dedans / (echantillons * echantillons)


def dessiner(taille):
    """Construit la matrice de pixels de l'icône."""
    t = float(taille)
    # lune : disque clair, partiellement masqué par un disque d'ombre décalé
    cx, cy, r = t * 0.46, t * 0.50, t * 0.30
    ox, oy, orr = t * 0.60, t * 0.38, t * 0.29
    # filet : cadre intérieur
    marge = t * 0.085
    epaisseur = max(1.0, t * 0.012)

    lignes = []
    for y in range(taille):
        ligne = []
        for x in range(taille):
            c = FOND

            # croissant de lune
            a_lune = couverture_disque(x, y, cx, cy, r)
            if a_lune > 0:
                a_ombre = couverture_disque(x, y, ox, oy, orr)
                visible = max(0.0, a_lune - a_ombre)
                if visible > 0:
                    c = melange(c, LUNE, visible)
                elif a_ombre > 0:
                    c = melange(c, OMBRE, min(a_lune, a_ombre) * 0.55)

            # filet laiton
            dx = min(x + 0.5 - marge, taille - marge - x - 0.5)
            dy = min(y + 0.5 - marge, taille - marge - y - 0.5)
            d = min(dx, dy)
            if -epaisseur <= d <= epaisseur:
                intensite = 1.0 - abs(d) / epaisseur
                c = melange(c, LAITON, min(1.0, intensite * 1.4) * 0.85)

            ligne.append(c)
        lignes.append(ligne)
    return lignes


def ecrire_png(chemin, lignes):
    """Encode une matrice de pixels RGB en PNG (filtre 0, compression zlib)."""
    hauteur = len(lignes)
    largeur = len(lignes[0])

    brut = bytearray()
    for ligne in lignes:
        brut.append(0)  # filtre « None » pour cette ligne
        for r, v, b in ligne:
            brut += bytes((r, v, b))

    def bloc(nom, donnees):
        entete = struct.pack(">I", len(donnees)) + nom
        crc = zlib.crc32(nom + donnees) & 0xFFFFFFFF
        return entete + donnees + struct.pack(">I", crc)

    entete_image = struct.pack(">IIBBBBB", largeur, hauteur, 8, 2, 0, 0, 0)
    contenu = (
        b"\x89PNG\r\n\x1a\n"
        + bloc(b"IHDR", entete_image)
        + bloc(b"IDAT", zlib.compress(bytes(brut), 9))
        + bloc(b"IEND", b"")
    )
    with open(chemin, "wb") as f:
        f.write(contenu)
    return len(contenu)


def main():
    os.makedirs(DOCS, exist_ok=True)
    cibles = [
        ("icone-192.png", 192),
        ("icone-512.png", 512),
        ("apple-touch-icon.png", 180),
    ]
    for nom, taille in cibles:
        chemin = os.path.join(DOCS, nom)
        poids = ecrire_png(chemin, dessiner(taille))
        print("  %-22s %3d px  %6.1f Ko" % (nom, taille, poids / 1024))
    print("%d icône(s) générée(s)." % len(cibles))
    return 0


if __name__ == "__main__":
    sys.exit(main())
