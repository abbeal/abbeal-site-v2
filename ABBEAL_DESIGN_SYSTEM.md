# Abbeal Design System

> Extracted from abbeal.com (2026-04). Feed this as system prompt / project knowledge to any Claude-based design tool (Artifacts, Projects, Canva AI, Figma AI, etc.) to produce on-brand visual content.

---

## 1. Voice & Tone

**Manifesto line (always verbatim)** : "La Tech qu'on aurait aimé trouver. On l'a fondée."

**What Abbeal sounds like** :
- Direct, honest, chiffré, anti-bullshit
- Short sentences, active voice
- Tutoiement FR ("tu"), first-person plural ("on", not "nous")
- Chooses specifics over superlatives ("9 mois", "−30 %", "4M lignes") over ("significatif", "innovant", "leader")
- Admits trade-offs openly ("À refaire : …", "Erreur : …")

**Never use** :
- "Agile", "cloud-native", "innovant", "révolutionnaire", "best-in-class", "world-class", "seamless", "cutting-edge"
- Corporate emoji (🚀💡✨)
- Excessive capitals / dramatic hooks
- Em-dashes (—) in copy. Use periods, commas, or line breaks
- Tagline clichés (jargon anglais marketing)

**Always use** :
- Metric-anchored claims with real numbers
- Geography tags: Paris · Montréal · Tokyo (middle dot with NBSP around it)
- "Senior" only if true and contextual (not everywhere)
- Concrete verbs: livre, refactore, migre, supprime, déploie

---

## 2. Colors

### Brand palette (exact hex)

| Token | Hex | Usage |
|---|---|---|
| `brand-teal` | `#42B296` | Primary accent — buttons, active states, links |
| `brand-mint` | `#80E8BA` | Gradient highlight — end of teal gradient |
| `brand-deep` | `#144F4F` | Gradient start — darker teal |
| `brand-teal-fg` | `#0A3429` | Foreground ON teal backgrounds |
| `ink` | `#0C343D` | Primary text — dark slate, almost black |
| `ink-soft` | `#2A4F57` | Secondary text — muted slate |
| `bg-light` | `#FAFAF8` | Page background — off-white warm |
| `bg-cream` | `#F4F1EA` | Secondary bg — warm beige, tape labels, cards |
| `bg-paper` | `#FFFFFF` | Highest contrast bg — cards, modals |
| `muted` | `#6B7A7E` | Tertiary text — labels, captions |
| `border` | `#E5E2D8` | Borders, dividers — warm off-beige |

### Signature gradients

```
Full gradient (logos, accents, hero text):
linear-gradient(135deg, #144F4F 0%, #42B296 45%, #80E8BA 100%)

Soft gradient (CTAs, buttons):
linear-gradient(135deg, #42B296 0%, #80E8BA 100%)
```

### Dark sections
- Background: `#0C343D` (ink)
- Foreground: `#FAFAF8` (bg-light)
- Accent: `#42B296` (brand-teal) + `#80E8BA` (brand-mint for highlights)

---

## 3. Typography

### Families
- **Headings & body** : **Geist Sans** (Vercel font, or fallback: Inter, ui-sans-serif)
- **Code, labels, tags, meta** : **Geist Mono** (or fallback: JetBrains Mono, ui-monospace)
- **Never** use serifs or decorative fonts

### Hierarchy (exact from abbeal.com)

| Role | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| H1 hero | `clamp(2.75rem, 6.5vw, 6rem)` | 600 | -0.03em | 1.02 |
| H1 page | `clamp(2.25rem, 5vw, 4rem)` | 600 | -0.025em | 1.05 |
| H2 section | `clamp(2rem, 4vw, 3.5rem)` | 600 | -0.025em | 1.05 |
| H3 card | `1.5rem` | 600 | tight | 1.2 |
| Body lead | `1.125rem` / `1.25rem` md+ | 400 | - | 1.6 |
| Body | `1rem` | 400 | - | 1.65 |
| Caption | `0.875rem` | 400 | - | 1.55 |
| Mono label | `0.6875rem` | 400 | 0.2em (uppercase) | 1.4 |

### Signature type treatments

1. **Gradient italic line** (on H1): second line of manifesto uses italic + full gradient background-clip text
2. **Tape label** (mono, uppercase, rotated -1.2°): `// 04 · Section name` — consistent across all sections
3. **Section number** (mono, muted): `// 01`, `// 02` ... pattern at top-left of every section card
4. **Comment-style captions** (mono): `// À lire ensuite`, `// Tech radar 2026`, etc.

---

## 4. Layout & Spacing

### Grid
- Container max-widths : `1100px` (text-heavy), `1200px` (galleries), `1400px` (hero, home)
- Horizontal padding : `px-6 md:px-10`
- Section padding : `py-20 md:py-28` (standard), `py-24 md:py-32` (hero/feature sections)

### Vertical rhythm
- Use a 4px base scale. Common gaps: 4, 6, 8, 10, 12, 16, 20, 24, 28 (rem units via Tailwind's `gap-` scale)

### Border radius
- **None by default** — Abbeal uses sharp rectangles (Bauhaus influence)
- Exceptions: tiny 4px on inputs, 8px on specific cards only if needed
- Buttons are **fully rectangular** (no rounding)

---

## 5. Visual language

### Bauhaus-inspired signature elements

1. **Sharp geometric shapes** : circles, triangles, rectangles, lines — pure forms
2. **Dashed lines** (muted): horizontal dividers, accent strokes, "1 → 2 → 3" flow hints
3. **Colored blocks** : teal rectangles, cream beige blocks, ink rectangles — never soft drop-shadows
4. **Subtle film grain overlay** : `.grain` utility — opacity 0.035, multiply blend — adds texture to all backgrounds
5. **Rotated tape labels** : section headers have a `rotate(-1.2deg)` tilt — like a piece of masking tape on a wall

### What to NEVER do
- ❌ Drop shadows / elevation stacking (looks generic SaaS)
- ❌ Glassmorphism / blur backgrounds
- ❌ Gradients on every surface (reserve for accents only)
- ❌ Rounded corners > 12px
- ❌ Emojis as UI elements (only in select casual contexts)
- ❌ Stock photography with people laughing at laptops

### What to ALWAYS do
- ✅ Respect the ink/cream/teal triangle (80% neutral, 20% accent)
- ✅ Leave generous whitespace
- ✅ Use mono font for meta-info (tags, dates, numbers, KPIs labels)
- ✅ Use italic + gradient for emotional/brand statements (max 1 per view)
- ✅ Pair big numeric KPIs (font-size 3rem+) with tiny mono labels below

---

## 6. Components patterns

### Card (generic)
```
Background: bg-paper (white) or bg-cream (beige)
Border: 1px solid var(--color-border) — sharp corners
Padding: 1.5rem (p-6) to 2rem (p-8)
No shadow. Hover: border-color → brand-teal, optional translate-y -1
Section number at top: mono, 0.75rem, muted → `// 01`
```

### Button (primary)
```
Background: gradient soft (42b296 → 80E8BA)
Color: brand-teal-fg (#0A3429)
Height: 48px
Padding: 0 24px
Font: sans, 1rem, weight 500
No border-radius. No shadow.
Hover: brightness(1.1)
Icon: "→" arrow, no icon-library.
```

### Button (secondary)
```
Background: transparent
Border: 1px solid border color
Color: ink
Hover: border → brand-teal, color → brand-teal
```

### Badge/Tag
```
Mono font, 10-11px, uppercase, tracking 0.2em
Small teal dot before or tape-label style
Never pill-shaped (no border-radius)
```

### KPI block
```
Number: sans, clamp(2rem, 4vw, 3.5rem), weight 600, tracking -0.02em
Label (below): mono, 11px, uppercase, tracking 0.15em, teal color
Optional: hairline horizontal bar (1px teal, 24px wide) above label
```

### Section header
```
1. Tape label (rotated -1.2°): `// 03 · Section title`
2. H2: large, negative tracking
3. Subtitle: lg text, ink-soft
4. Generous bottom padding before content
```

---

## 7. Iconography

- **Minimal**: only arrow (→ ↗), checkmark (✓), plus (+), chevron (›)
- **No icon library** (no Heroicons, no Phosphor, no Lucide)
- **Custom SVGs** for abstract Bauhaus elements (circles, triangles, dashed lines)
- Unicode middle dot `·` as delimiter in text (not bullets)

---

## 8. Photography / Illustration

### Allowed
- Candid team photos : black/white OR subtle desaturated color, no corporate vibe
- Abstract Bauhaus SVGs : circles, triangles, lines overlapping
- Tech screenshots (terminals, IDEs) in dark theme with teal accent
- City silhouettes with gradient (Tokyo tower, Montreal skyline abstract, Eiffel abstract)

### Banned
- Stock photos of "business people"
- 3D renders of "clouds" / "lightbulbs"
- Generic SaaS illustrations (people with tablets)
- Over-saturated gradient blobs

---

## 9. OG / social visual template

**Format** : 1200 × 630 px

**Article template** :
```
Background: bg-light (#FAFAF8) with radial gradient teal at 85% 15%
Top: teal dash + `// TAG` (mono, uppercase, 20px) | right: readTime
Middle: article title (sans, 64px, weight 600, tracking -0.025em, max 1000px wide, color ink)
Bottom-left: "Abbeal" (gradient text, 36px) + "Paris · Montréal · Tokyo" (mono, 16px muted)
Bottom-right: canonical URL (mono, uppercase, 16px muted)
```

**Case study template** :
```
Background: dark ink (#0C343D) with radial gradient teal at 10% 90%
Top: teal dash + `// SECTOR` (mono, 20px) | right: geo (muted white)
Middle: huge KPI number (140px, gradient text teal → mint) + KPI label (mono, 20px uppercase, 70% white)
+ case title (52px, weight 600, max 1000px, white)
Bottom: "Abbeal" (36px white) + "Paris · Montréal · Tokyo" (mono, 16px muted white)
```

---

## 10. Usage with Claude Design

### Claude Projects (recommended for recurring work)
1. Create a Project in Claude
2. Settings → **Project Instructions** (custom system prompt) → paste this entire document
3. Settings → **Project Knowledge** → upload :
   - Logo PNG/SVG (`public/brand/wordmark-teal.png`, `mark-teal.png`)
   - Example screenshots of the site (home, article, case)
4. Use this Project for : pitch decks, one-pagers, social posts, landing page variants, email templates

### Claude Artifacts (one-off generation)
Prompt template to paste with this doc :

```
[PASTE THIS FULL DESIGN SYSTEM]

Now generate a [CONTENT TYPE] for Abbeal :
Goal : [what is this for, e.g., "pitch deck slide for CTO, 1 idea per slide"]
Audience : [CTO scale-up / recruteur tech / ingé senior / investisseur]
Format : [HTML+Tailwind artifact / SVG / React component]
Length/Pages : [1 slide / full deck / single card]
Content to feature : [key points, numbers, quote...]

Respect :
- All colors, fonts, spacing, voice from the design system above
- No superlatives, no corporate jargon, no em-dashes
- Numbers > adjectives
- Sharp rectangles, no drop shadows
- "Paris · Montréal · Tokyo" as geo signature
```

### Canva / Figma AI
If using visual tools other than Claude :
- Upload the brand assets (`mark-*.png`, `wordmark-*.png`)
- Configure a Brand Kit with the exact hex colors from section 2
- Override fonts to Geist Sans + Geist Mono (or Inter + JetBrains Mono if Geist not available)
- Paste sections 1, 3, 5, 7, 8 as "brand guidelines" in the project

---

## 11. Quick-start prompts for common deliverables

### Pitch deck slide
```
Use the Abbeal design system. Generate an HTML artifact (1200x675px landscape) 
for a pitch deck slide on "follow-the-sun 24/7".
Layout: left 40% = headline + 2 body lines, right 60% = visual (3 cards Paris/Montréal/Tokyo with clock icons).
Colors: ink background, bg-cream cards, teal accent.
```

### LinkedIn visual (1200x627)
```
Use the Abbeal design system. Generate an SVG 1200x627 for LinkedIn post carousel cover.
Theme: "10 case studies anonymisés sur abbeal.com".
Layout: huge tape label top-left, big number "10" in gradient, list of 3 sectors on right (mono).
```

### One-pager PDF-ready
```
Use the Abbeal design system. Generate an HTML artifact A4 portrait for a one-pager 
"Mobbeal — mobilité tech internationale".
Sections: hero with H1, 3 pillars, 3 testimonials block, CTA with Calendly link.
```

### Email signature (HTML)
```
Use the Abbeal design system. Generate HTML email signature (max 500px wide, inline styles) :
Name, role, hub city, abbeal.com, mobile icon, "Paris · Montréal · Tokyo" tagline.
Must render correctly in Gmail, Outlook, Apple Mail.
```

---

## 12. Assets inventory (current)

| File | Usage |
|---|---|
| `public/brand/mark-teal.png` | Primary logo mark (teal on light) |
| `public/brand/mark-ink.png` | Logo mark ink (dark on light) |
| `public/brand/wordmark-teal.png` | Full wordmark "Abbeal" in teal |
| `public/brand/wordmark-ink.png` | Full wordmark in ink |
| `public/brand/mark-square.png` | Square app icon (284×285) — source of favicon |
| `public/brand/og-image.png` | Default social card 1200×630 |
| `public/team/sebastien.jpg` | Sébastien Lonjon portrait |
| `public/team/vianney.jpg` | Vianney Blanquart portrait |
| `public/moments/*.jpg` | Team moments (Tokyo, Montréal, Paris) |
| `public/logos/*.svg` | 19 authorized client logos (BNP, Decathlon, Rakuten, SMBC, …) |

---

## 13. Example : good vs bad output

### ✅ On-brand
> `// 03 · Delivery clé en main`
> **De la conception au run.**
> Engagement output, pas time & material. SLOs mesurés.
> 
> **99,9 %** · SLO tenus en production
> **100 %** · IP transférée au client
> **Canary** · go-live sécurisé

### ❌ Off-brand
> 🚀 **Transform your business with our innovative solutions!**
> Best-in-class delivery. Cloud-native. Agile. World-class team ready to accelerate your digital journey seamlessly.

---

*Last updated : 2026-04. Aligned with abbeal.com v2 production code.*
