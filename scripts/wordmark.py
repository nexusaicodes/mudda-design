"""Draws the wordmark: "mudda" in Amiri Bold, outlined, at the -0.03em tracking the sites set it in.

usage: python3 -I scripts/wordmark.py   (needs fonttools and brotli)
Writes app/assets/images/mudda_theme/wordmark.svg (ink, for paper) and wordmark-on-dark.svg
(cream, for night paper). Outlines need no font, so the files work in favicons, email and native
apps alike.
"""
import json
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "app/assets/fonts/mudda_theme/amiri-latin-700-normal.woff2"
OUT = ROOT / "app/assets/images/mudda_theme"
WORD = "mudda"
TRACKING = -0.03
COLORS = {"wordmark.svg": "light", "wordmark-on-dark.svg": "dark"}

font = TTFont(FONT)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font["head"].unitsPerEm

# Lay the letters out on the baseline, y flipped for SVG.
pen = SVGPathPen(glyphs)
bounds = BoundsPen(glyphs)
x = 0
for char in WORD:
    name = cmap[ord(char)]
    for target in (pen, bounds):
        glyphs[name].draw(TransformPen(target, (1, 0, 0, -1, x, 0)))
    x += glyphs[name].width + TRACKING * upm

x_min, y_min, x_max, y_max = bounds.bounds
pad = round(0.02 * upm)
view_box = f"{round(x_min) - pad} {round(y_min) - pad} {round(x_max - x_min) + 2 * pad} {round(y_max - y_min) + 2 * pad}"
palette = json.loads((ROOT / "lib/mudda_theme/palette.json").read_text())

for file, scheme in COLORS.items():
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img" aria-label="mudda">'
        f'<path fill="{palette[scheme]["ink"]}" d="{pen.getCommands()}"/></svg>\n'
    )
    (OUT / file).write_text(svg)
    print(OUT.relative_to(ROOT) / file)
