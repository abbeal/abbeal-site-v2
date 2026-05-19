#!/usr/bin/env python3
"""
Convert markdown source to ArticleBlocks JSON and patch lib/article-bodies.json
in place for a specific slug.

Usage:
    # 1. Paste Alex's verbatim into /tmp/alex.md
    # 2. Paste Stéphane's verbatim into /tmp/stephane.md
    # 3. Run:
    python3 scripts/md-to-article-blocks.py \
        --md /tmp/alex.md \
        --slug css-for-javascript-developers-josh-comeau-retour-alex-lim \
        --locale en

    # Repeat for FR/JA/FR-CA translations.

The script:
- Reads the markdown file
- Parses # H1 (skipped — title is in articles.ts), ## H2, ### H3,
  paragraphs, - / * lists, 1. ordered lists, ``` code blocks, > callouts
- Preserves byline (block 0) + attribution footer (last 2 blocks) if they
  already exist in the target slug+locale
- Writes the result into lib/article-bodies.json at the right slug+locale

It does NOT touch other slugs/locales. Safe to run multiple times.
"""
import argparse
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
BODIES_PATH = REPO_ROOT / "lib" / "article-bodies.json"


def md_to_blocks(md_text: str) -> list[dict]:
    """Parse a markdown string into ArticleBlocks-compatible block list."""
    blocks: list[dict] = []
    lines = md_text.replace("\r\n", "\n").split("\n")
    i = 0
    n = len(lines)
    while i < n:
        raw = lines[i]
        line = raw.strip()

        # Skip blank lines
        if not line:
            i += 1
            continue

        # H1 → skipped (the article title is managed in articles.ts)
        if line.startswith("# ") and not line.startswith("## "):
            i += 1
            continue

        # H2
        if line.startswith("## ") and not line.startswith("### "):
            blocks.append({"type": "h2", "content": line[3:].strip()})
            i += 1
            continue

        # H3
        if line.startswith("### "):
            blocks.append({"type": "h3", "content": line[4:].strip()})
            i += 1
            continue

        # Code block
        if line.startswith("```"):
            lang = line[3:].strip() or "text"
            i += 1
            code_lines = []
            while i < n and not lines[i].startswith("```"):
                code_lines.append(lines[i])
                i += 1
            blocks.append({"type": "code", "lang": lang, "content": "\n".join(code_lines)})
            i += 1  # skip closing ```
            continue

        # Quote / callout
        if line.startswith("> "):
            quote_lines = [line[2:].strip()]
            i += 1
            while i < n and lines[i].strip().startswith("> "):
                quote_lines.append(lines[i].strip()[2:].strip())
                i += 1
            blocks.append({
                "type": "callout",
                "tone": "teal",
                "content": " ".join(quote_lines),
            })
            continue

        # Unordered list
        if line.startswith("- ") or line.startswith("* "):
            items = []
            while i < n and (lines[i].strip().startswith("- ") or lines[i].strip().startswith("* ")):
                items.append(lines[i].strip()[2:].strip())
                i += 1
            blocks.append({"type": "list", "items": items, "ordered": False})
            continue

        # Ordered list
        if re.match(r"^\d+\.\s", line):
            items = []
            while i < n and re.match(r"^\d+\.\s", lines[i].strip()):
                items.append(re.sub(r"^\d+\.\s", "", lines[i].strip()).strip())
                i += 1
            blocks.append({"type": "list", "items": items, "ordered": True})
            continue

        # Default : paragraph (collect contiguous non-empty lines that
        # aren't a block-starter)
        para_lines = []
        while i < n:
            cur = lines[i].strip()
            if not cur:
                break
            if cur.startswith(("# ", "## ", "### ", "> ", "- ", "* ", "```")):
                break
            if re.match(r"^\d+\.\s", cur):
                break
            para_lines.append(cur)
            i += 1
        blocks.append({"type": "p", "content": " ".join(para_lines).strip()})

    return blocks


def patch_bodies(slug: str, locale: str, new_blocks: list[dict], keep_byline: bool = True,
                 keep_footer_blocks: int = 2):
    """Patch lib/article-bodies.json for a specific slug+locale.

    Preserves the existing byline (block 0 if type=callout) and the last
    `keep_footer_blocks` blocks (typically: attribution callout + canonical
    link) by default. The new_blocks are inserted between them.
    """
    db = json.loads(BODIES_PATH.read_text())
    if slug not in db:
        db[slug] = {}
    existing = db[slug].get(locale, [])

    byline = []
    footer = []

    if keep_byline and existing and existing[0].get("type") == "callout" and existing[0].get("tone") == "ink":
        byline = [existing[0]]

    if keep_footer_blocks and len(existing) > keep_footer_blocks:
        footer = existing[-keep_footer_blocks:]
        # Only keep footer blocks if they look like attribution (callout + link)
        if not all(b.get("type") in ("callout", "link") for b in footer):
            footer = []

    merged = byline + new_blocks + footer
    db[slug][locale] = merged

    BODIES_PATH.write_text(json.dumps(db, ensure_ascii=False, indent=2) + "\n")
    print(f"OK [{slug}][{locale}] → {len(merged)} blocks "
          f"({len(byline)} byline + {len(new_blocks)} body + {len(footer)} footer)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--md", required=True, help="Path to markdown source")
    parser.add_argument("--slug", required=True, help="Article slug in article-bodies.json")
    parser.add_argument("--locale", required=True, choices=["fr", "en", "ja", "fr-ca"])
    parser.add_argument("--no-keep-byline", action="store_true",
                        help="Replace the byline block (default: preserve existing)")
    parser.add_argument("--footer-blocks", type=int, default=2,
                        help="Number of trailing blocks to preserve as footer (default: 2 = callout + link)")
    args = parser.parse_args()

    md_text = Path(args.md).read_text(encoding="utf-8")
    blocks = md_to_blocks(md_text)
    print(f"Parsed {len(blocks)} blocks from {args.md}")
    patch_bodies(
        slug=args.slug,
        locale=args.locale,
        new_blocks=blocks,
        keep_byline=not args.no_keep_byline,
        keep_footer_blocks=args.footer_blocks,
    )


if __name__ == "__main__":
    main()
