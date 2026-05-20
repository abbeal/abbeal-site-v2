#!/usr/bin/env python3
"""
pdf-to-article-blocks.py
========================

Convertit un PDF (export Notion ou Medium) en ArticleBlocks JSON et le pousse
dans lib/article-bodies.json pour un slug + locale.

Pourquoi : Notion et Medium exportent les articles en PDF tagué avec des
tailles de font distinctes pour H1 / H2 / body. On exploite ca via pdfplumber
pour reconstituer la structure ArticleBlocks sans avoir a parser du HTML
fragile ou faire du copy-paste manuel qui perd la hierarchie.

Specifiquement pour les articles invites d'Alex (CSS / Notion) et Stephane
(Mythos / Medium). Voir scripts/md-to-article-blocks.py pour l'alternative
markdown -> ArticleBlocks (utilise si auteur fournit un .md plutot qu'un PDF).

Heuristiques :
- Lignes a >= 17pt sont des H2 (Notion et Medium utilisent tous deux ~18pt
  pour leurs section headings).
- Lignes a >= 12pt et < 17pt sont du body (Notion = 12pt, Medium = 15pt).
- Lignes a < 10pt sont du noise (headers/footers PDF avec URL + date export).
- Les lignes du H1 (>= 28pt) sont ignorees : le titre vient deja du champ
  title dans lib/articles.ts, pas besoin de le dupliquer dans le body.
- Les paragraphes sont reconstitues en collant les lignes consecutives a la
  meme taille de font tant qu'on n'a pas un changement de section.

Preservation byline + footer :
- Le block 0 du body existant (callout tone=ink avec la bio de l'auteur) est
  preserve telquel.
- Les 2 derniers blocks (callout notice + link canonical) sont egalement
  preserves : sur Alex notamment, le lien vers la Notion source reste utile
  meme apres publication canonical sur abbeal.com.

Usage :
    python3 scripts/pdf-to-article-blocks.py \
        --pdf /tmp/alex-notion.pdf \
        --slug css-for-javascript-developers-josh-comeau-retour-alex-lim \
        --locale en

    python3 scripts/pdf-to-article-blocks.py \
        --pdf /tmp/stephane-medium.pdf \
        --slug mythos-ia-cybersecurite-priorites-production-stephane-robin \
        --locale fr

Output : modifie lib/article-bodies.json (json indente 2 spaces) et imprime
un resume des blocks generes (count + premiere ligne de chaque H2).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import pdfplumber

REPO_ROOT = Path(__file__).resolve().parent.parent
BODIES_PATH = REPO_ROOT / "lib" / "article-bodies.json"

# Seuils de taille de font (en points PDF)
H2_MIN = 17.0       # >= 17pt => H2 section heading
BODY_MIN = 11.0     # 11pt <= x < 17pt => paragraphe body
H1_MIN = 28.0       # >= 28pt => titre principal (skip, deja dans title)
NOISE_MAX = 11.0    # < 11pt => header/footer PDF + Medium UI chrome (search,
                    #   byline "Stephane RobinFollow", tags, follower counts...)

# Regex pour filtrer les artefacts header/footer
NOISE_PATTERNS = [
    re.compile(r"^\d+/\d+/\d{4}\s+\d+:\d+"),       # "19/05/2026 11:17"
    re.compile(r"^https?://"),                       # URLs
    re.compile(r"^\d+/\d+$"),                        # "1/4" page numbers
    re.compile(r"^Search\s+Get app"),                # Medium UI chrome
    re.compile(r"^Written by"),                      # Medium author footer
    re.compile(r"^\d+\s+followers?\s+·"),            # Medium follower count
    re.compile(r"^Follow$"),                         # Medium Follow button text
    re.compile(r"^Help\s+Status\s+About"),           # Medium footer nav
    re.compile(r"^[A-Z][a-z]+\s+[A-Z][a-z]+\s+Follow\s+\d+\s+min"),  # "Stephane Robin Follow 5 min..."
    re.compile(r"^Image\s+\w+$"),                   # "Image IA" placeholder Medium
    re.compile(r"^Cybers"),                          # Medium tags footer "Cybersécurité Spring Boot..."
]


def is_noise(text: str) -> bool:
    """True si la ligne est du chrome PDF a ignorer."""
    s = text.strip()
    if not s:
        return True
    return any(p.search(s) for p in NOISE_PATTERNS)


def clean_kerning(text: str) -> str:
    """Notion et Medium exportent parfois les accents avec des espaces parasites
    autour ('red é finit' au lieu de 'redéfinit'). On recolle.

    ATTENTION : on exclut 'à'/'À' de la regex car ce sont des prepositions
    valides ('exploitation à grande échelle') et les recoller donnerait
    'exploitationàgrande'. Pour 'à', on laisse les espaces tels quels.
    """
    # Recolle les accents isoles autres que à
    text = re.sub(
        r"\s+([éèêëâäîïôöùûüçÉÈÊËÂÄÎÏÔÖÙÛÜÇ])\s+",
        r"\1",
        text,
    )
    # Collapse les doubles espaces (residuels du PDF export)
    text = re.sub(r"  +", " ", text)
    return text.strip()


def extract_lines(pdf_path: Path) -> list[tuple[float, str, bool]]:
    """Extrait (size, text, paragraph_break_before) pour chaque ligne du PDF.

    pdfplumber donne acces aux char-level fonts. On groupe par (page, y) pour
    reconstituer les lignes physiques, puis on garde la taille dominante.

    paragraph_break_before = True si le gap vertical avec la ligne precedente
    depasse 1.6 * line_height : indique un saut de paragraphe visible dans le
    PDF (espacement inter-paragraphe).
    """
    out: list[tuple[float, str, bool]] = []
    prev_bottom: float | None = None
    prev_size: float | None = None
    prev_page: int | None = None

    with pdfplumber.open(str(pdf_path)) as pdf:
        for page_idx, page in enumerate(pdf.pages):
            # Grouper chars par y (top) avec tolerance 2pt
            by_y: dict[int, list] = {}
            for ch in page.chars:
                # Skip noise sizes immediately (footer/header PDF chrome)
                if ch["size"] < NOISE_MAX:
                    continue
                key = round(ch["top"] / 2) * 2
                by_y.setdefault(key, []).append(ch)

            for y in sorted(by_y.keys()):
                chars = sorted(by_y[y], key=lambda c: c["x0"])
                # Reconstituer le texte avec espaces si gap horizontal > demi-em
                text = ""
                prev_x1 = None
                for c in chars:
                    if prev_x1 is not None and (c["x0"] - prev_x1) > (c["size"] * 0.3):
                        text += " "
                    text += c["text"]
                    prev_x1 = c["x1"]
                text = clean_kerning(text)
                if not text or is_noise(text):
                    continue
                # Taille dominante de la ligne
                size = round(max(c["size"] for c in chars), 1)
                # Skip H1 (titre, deja dans le champ title de lib/articles.ts)
                if size >= H1_MIN:
                    continue

                # Detection saut de paragraphe : gap vertical > 1.6 * line_height
                top = min(c["top"] for c in chars)
                bottom = max(c["bottom"] for c in chars)
                para_break = False
                if prev_bottom is not None and prev_page == page_idx:
                    gap = top - prev_bottom
                    line_height = max(size, prev_size or size)
                    if gap > line_height * 0.7:
                        para_break = True
                elif prev_page is not None and prev_page != page_idx:
                    # Changement de page : on n'impose pas de break (les
                    # paragraphes peuvent continuer d'une page a l'autre dans
                    # Notion/Medium). On laisse la regex finale decider via
                    # ponctuation finale.
                    para_break = False

                out.append((size, text, para_break))
                prev_bottom = bottom
                prev_size = size
                prev_page = page_idx
    return out


def lines_to_blocks(lines: list[tuple[float, str, bool]]) -> list[dict]:
    """Reconstitue les ArticleBlocks a partir des lignes (size, text, para_break).

    - Ligne H2 (>= H2_MIN) => block h2 (lignes H2 consecutives sans para_break
      sont mergees en un seul H2 : Medium splite parfois les titres longs sur
      2 lignes visuelles).
    - Lignes body consecutives sans saut de paragraphe => 1 block p
    - Un para_break True force la fermeture du paragraphe courant
    - Post-traitement : si le PREMIER block est un H2 qui termine par ".", il
      s'agit en realite du "standfirst" Medium (intro en gros caracteres) et
      on le converti en paragraphe.
    """
    blocks: list[dict] = []
    current_para_lines: list[str] = []
    current_h2_lines: list[str] = []

    def flush_para():
        if current_para_lines:
            joined = " ".join(current_para_lines).strip()
            joined = re.sub(r"\s+", " ", joined)
            # PDF line-wrap au milieu d'un compose : "front- end" => "front-end"
            joined = re.sub(r"(\w)-\s+(\w)", r"\1-\2", joined)
            blocks.append({"type": "p", "content": joined})
            current_para_lines.clear()

    def flush_h2():
        if current_h2_lines:
            joined = " ".join(current_h2_lines).strip()
            joined = re.sub(r"\s+", " ", joined)
            blocks.append({"type": "h2", "content": joined})
            current_h2_lines.clear()

    for size, text, para_break in lines:
        if size >= H2_MIN:
            flush_para()
            if para_break:
                flush_h2()
            current_h2_lines.append(text)
        else:
            flush_h2()
            if para_break:
                flush_para()
            current_para_lines.append(text)
    flush_h2()
    flush_para()

    # Post-traitement 1 : 1er H2 qui finit par "." => standfirst (intro)
    for i, b in enumerate(blocks):
        if b["type"] == "h2":
            text = b["content"].rstrip()
            if text.endswith(".") or text.endswith("!"):
                blocks[i] = {"type": "p", "content": text}
            break  # seulement le PREMIER H2

    # Post-traitement 2 : detecter les listes numerotees ("1. xxx", "2. xxx"...)
    # On split les paragraphes qui contiennent du texte normal SUIVI d'items
    # numerotes. Puis on fusionne les blocks p consecutifs commencant par
    # "N." en un seul block list ordered.
    blocks = _extract_numbered_lists(blocks)
    return blocks


_NUM_ITEM = re.compile(r"^(\d+)\.\s+(.+)$", re.DOTALL)


def _extract_numbered_lists(blocks: list[dict]) -> list[dict]:
    """Detecte les paragraphes qui sont en fait des items de liste numerotee.

    Patterns geres :
    - Block p qui contient "intro... 1. premier item" => split en p + list
    - Blocks p consecutifs commencant par "N." => merge en un block list ordered
    """
    # Etape A : splitter les p contenant "... N. item"
    expanded: list[dict] = []
    for b in blocks:
        if b["type"] != "p":
            expanded.append(b)
            continue
        text = b["content"]
        # Cherche " 1. " au milieu du paragraphe
        m = re.search(r"(.+?)\s+(\d+\.\s+.+)$", text)
        if m and m.group(2).startswith("1."):
            intro = m.group(1).strip()
            first_item = m.group(2).strip()
            if intro:
                expanded.append({"type": "p", "content": intro})
            expanded.append({"type": "p", "content": first_item})
        else:
            expanded.append(b)

    # Etape B : fusionner p consecutifs "N. ..." en un block list ordered
    merged: list[dict] = []
    i = 0
    while i < len(expanded):
        b = expanded[i]
        if b["type"] == "p" and _NUM_ITEM.match(b["content"]):
            items: list[str] = []
            while i < len(expanded) and expanded[i]["type"] == "p":
                m = _NUM_ITEM.match(expanded[i]["content"])
                if not m:
                    break
                items.append(m.group(2).strip())
                i += 1
            if len(items) >= 2:
                merged.append({"type": "list", "items": items, "ordered": True})
            else:
                # Un seul item "1." => garder en paragraphe
                merged.append(b)
                i += 1 if i < len(expanded) and expanded[i] is b else 0
                if i == 0 or merged[-1] is not b:
                    i += 1
        else:
            merged.append(b)
            i += 1
    return merged


def patch_bodies(slug: str, locale: str, new_body_blocks: list[dict]) -> None:
    """Reemplace les blocks body en preservant byline (block 0) et footer
    (2 derniers blocks : callout notice + link canonical).
    """
    if not BODIES_PATH.exists():
        sys.exit(f"ERROR: {BODIES_PATH} introuvable")

    with BODIES_PATH.open("r", encoding="utf-8") as f:
        bodies = json.load(f)

    if slug not in bodies:
        sys.exit(f"ERROR: slug '{slug}' absent de article-bodies.json")
    if locale not in bodies[slug]:
        sys.exit(f"ERROR: locale '{locale}' absente pour slug '{slug}'")

    existing = bodies[slug][locale]
    # Byline = block 0 si type "byline" (nouveau format) OU callout tone=ink
    # (ancien format placeholder). On preserve les deux pour rester compatible
    # avec les articles deja migres vers le bloc byline dedie.
    byline_block = None
    if existing and (
        existing[0].get("type") == "byline"
        or (existing[0].get("type") == "callout" and existing[0].get("tone") == "ink")
    ):
        byline_block = existing[0]

    # Footer = derniers blocks (callout notice teal + link canonical) si presents
    footer_blocks: list[dict] = []
    if len(existing) >= 2:
        # Heuristique : on garde le link canonical (dernier) + le callout notice
        # juste avant SI son tone est "teal" (cas placeholder actuel)
        last = existing[-1]
        if last.get("type") == "link":
            footer_blocks.insert(0, last)
            prev = existing[-2]
            if prev.get("type") == "callout" and prev.get("tone") == "teal":
                footer_blocks.insert(0, prev)

    new_blocks = []
    if byline_block:
        new_blocks.append(byline_block)
    new_blocks.extend(new_body_blocks)
    new_blocks.extend(footer_blocks)

    bodies[slug][locale] = new_blocks

    with BODIES_PATH.open("w", encoding="utf-8") as f:
        json.dump(bodies, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"[OK] {slug} [{locale}] : {len(new_blocks)} blocks ecrits")
    print(f"     - 1 byline (preserve)" if byline_block else "     - 0 byline")
    print(f"     - {len(new_body_blocks)} blocks body (genere depuis PDF)")
    print(f"     - {len(footer_blocks)} blocks footer (preserve)")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--pdf", required=True, help="Chemin vers le PDF source (Notion/Medium export)")
    ap.add_argument("--slug", required=True, help="Slug de l'article (key de article-bodies.json)")
    ap.add_argument(
        "--locale",
        required=True,
        choices=["fr", "en", "ja", "fr-ca"],
        help="Locale dans laquelle ecrire le verbatim",
    )
    ap.add_argument(
        "--preview",
        action="store_true",
        help="N'ecrit pas le JSON, imprime juste les blocks generes pour controle",
    )
    args = ap.parse_args()

    pdf_path = Path(args.pdf).resolve()
    if not pdf_path.exists():
        sys.exit(f"ERROR: PDF introuvable : {pdf_path}")

    print(f"[*] Extraction de {pdf_path.name}...")
    lines = extract_lines(pdf_path)
    print(f"[*] {len(lines)} lignes extraites (apres filtrage noise)")

    blocks = lines_to_blocks(lines)
    print(f"[*] {len(blocks)} blocks generes : "
          f"{sum(1 for b in blocks if b['type'] == 'h2')} H2, "
          f"{sum(1 for b in blocks if b['type'] == 'p')} P")
    print()
    print("=== Apercu H2 ===")
    for b in blocks:
        if b["type"] == "h2":
            print(f"  ## {b['content']}")
    print()

    if args.preview:
        print("(--preview : aucun ecrit)")
        return

    patch_bodies(args.slug, args.locale, blocks)


if __name__ == "__main__":
    main()
