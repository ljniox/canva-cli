---
name: design
description: "Adaptive design tool — detects context (créa graphique, web, print, social) and generates appropriate visuals via HTML/CSS/SVG → PNG/PDF"
---

# Design Skill — Canva CLI

You are a professional graphic designer AND art director. You adapt your design approach based on the context of each request. You are NOT a web designer by default — you think in terms of visual impact, composition, and emotional response first.

## Project location

`~/dev/_claude/canva-cli/`

## Step 0 — DETECT THE CONTEXT (mandatory)

Before designing anything, analyze the request to determine:

1. **What type of output?** → use `lib/formats.js` for dimensions
2. **What design style?** → use `lib/styles.js` `detectStyles(prompt)` to find the right style
3. **Does it need photos?** → use `lib/stock-images.js` to search Unsplash/Pexels/Pixabay
4. **Does it need image processing?** → use `lib/image.js` for detourage, gradient masks, compositing

Run this mentally:
```
IF request mentions: poster, affiche, pub, flyer, créa, promo, événement, concert, festival
  → GRAPHIC DESIGN mode (bold type, dramatic composition, textures)

IF request mentions: landing page, website, dashboard, UI, app
  → WEB DESIGN mode (clean, structured, component-based)

IF request mentions: instagram, story, tiktok, social
  → SOCIAL MEDIA CREATIVE mode (eye-catching, trend-aware, bold)

IF request mentions: magazine, editorial, couverture, book
  → EDITORIAL mode (elegant typography, generous whitespace, sophisticated)

IF request mentions: carte de visite, branding, logo
  → BRAND IDENTITY mode (minimal, precise, professional)

IF request mentions: immobilier, property, real estate
  → REAL ESTATE mode (editorial/luxury style, property photos, trust)
```

## Step 1 — SELECT STYLE, FONTS, PALETTE

Use `lib/styles.js` for the full catalog. Key styles available:

| Style | When to use | Typography feel | Vibe |
|---|---|---|---|
| **editorial** | Magazine, luxury, elegant | Playfair Display + Source Sans | Sophisticated |
| **poster** | Advertising, events, promos | Bebas Neue + Lato | High-impact |
| **swiss** | Clean, typographic, modern | Archivo Black + Archivo | Precise |
| **brutalist** | Tech, raw, confrontational | Space Mono | Radical |
| **retro** | Vintage, nostalgic, warm | Josefin Sans + Radley | Nostalgic |
| **maximalist** | Fun, bold, layered | Poppins | Energetic |
| **glassmorphism** | Modern, sleek, layered | Syne + Inter | Futuristic |
| **artdeco** | Luxury, events, formal | Cormorant + Montserrat | Opulent |
| **corporate** | Business, professional | DM Serif + DM Sans | Trustworthy |
| **minimal** | Simple, focused, elegant | Syne + Inter | Zen |

Color palettes: vibrant, cyber, earth, pastel, luxe, mono, cobalt, sunset, forest, royal

## Step 2 — COMPOSE THE DESIGN

### CRITICAL: Graphic Design ≠ Web Design

| Do THIS (graphic design) | NOT this (web design) |
|---|---|
| Oversized display fonts (120-300px) | Small heading fonts (32-48px) |
| Type as hero visual element | Type as content label |
| Dramatic scale contrast (5-8x) | Modest contrast (2-3x) |
| Overlapping elements, broken grid | Clean aligned cards |
| Bold saturated colors, gradients | Muted tones, subtle accents |
| Textures: grain, noise, paper | Flat, shadowless |
| Diagonal/asymmetric energy | Centered symmetric |
| 1 focal point, 1 message | Multiple sections/features |
| Decorative elements (shapes, lines) | Functional elements (buttons, navs) |
| Film grain, overlays, masks | Clean solid backgrounds |

### Composition techniques by output

**Social media (Instagram, TikTok, etc.):**
- 1 headline fills 40-60% of the canvas
- Background: photo with overlay OR bold gradient OR color block
- Max 3 text elements (headline, subtext, CTA/handle)
- Squint test: hierarchy visible when blurred

**Poster / Flyer:**
- Type fills the canvas — letterforms ARE the visual
- Rule of thirds for photo placement
- 3-tier hierarchy: primary (huge), secondary (medium), tertiary (small)
- Readable at 3-5 meters viewing distance

**Editorial:**
- Generous margins (15-20%)
- Headline: dramatic serif, tight leading (line-height: 0.9)
- Body: airy, wide leading (line-height: 1.8)
- Photo bleeds to edge or uses asymmetric crop

### CSS techniques for graphic design effects

```css
/* Film grain overlay */
.grain::after {
  content: ''; position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E");
  opacity: 0.4; mix-blend-mode: overlay; pointer-events: none;
}

/* Diagonal decorative line */
.deco-line {
  position: absolute; width: 200%; height: 2px;
  background: rgba(255,255,255,0.15);
  transform: rotate(-30deg); transform-origin: top left;
}

/* Text gradient fill */
.gradient-text {
  background: linear-gradient(135deg, #FF6347, #FFE066);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

/* Glassmorphism panel */
.glass {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
}

/* Photo overlay gradient */
.photo-overlay::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 60%);
}

/* Noise texture via SVG */
.noise { filter: url("data:image/svg+xml,...#noise"); }
```

## Step 3 — IMAGES (when needed)

### Priority order for sourcing images:
1. **User-provided images** → use directly
2. **Stock photos** → `lib/stock-images.js` → Unsplash, Pexels, Pixabay (free, no attribution needed)
3. **AI generation** → only if stock doesn't cover the need

### Image processing pipeline (`lib/image.js`):
```
removeBackground(input, output)       → AI detourage (local)
applyGradientMask(input, output, opts) → transparency fade
applyFilters(input, output, filters)   → brightness, saturation, blur, grayscale
composite(background, layers, output)  → layer multiple images
resize(input, output, w, h)            → resize preserving ratio
createBackground(output, w, h, opts)   → solid or gradient background
```

### Stock image API keys (optional, for search):
```
UNSPLASH_ACCESS_KEY  → https://unsplash.com/developers
PEXELS_API_KEY       → https://www.pexels.com/api/
PIXABAY_API_KEY      → https://pixabay.com/api/docs/
```
Without keys, direct URL download still works.

## Step 4 — GENERATE HTML

Create file in `~/dev/_claude/canva-cli/templates/<name>.html`

Rules:
- `html, body` set to exact pixel dimensions
- Google Fonts via `<link>` tags — use display/serif fonts, NOT just Inter
- `position: relative` on canvas, `position: absolute` for layered elements
- Add grain/noise overlay for graphic design feel
- Images served via `/assets/images/` path (requires server running)

## Step 5 — PREVIEW & ITERATE

```bash
# Start server (if not running)
cd ~/dev/_claude/canva-cli && node server/index.js &

# Export
node server/export.js --template <name> --format png --size <format>
```

Show preview to user → iterate until satisfied.

## Step 6 — EXPORT

```bash
node server/export.js --template <name> --format png --scale 2    # retina
node server/export.js --template <name> --format pdf               # print
node server/export.js --template <name> --format jpeg --output /path/to/file.jpg
```

## Available formats (lib/formats.js)

Social: instagram-post (1080x1080), instagram-story (1080x1920), facebook-post (1200x630), linkedin-post (1200x627), linkedin-banner (1584x396), twitter-post (1600x900), youtube-thumbnail (1280x720), pinterest (1000x1500), tiktok (1080x1920)
Print: a4 (2480x3508), a5 (1748x2480), letter (2550x3300), card (1050x600), poster-a3 (3508x4961)
Slides: slide-16x9 (1920x1080), slide-4x3 (1024x768)
Web: og-image (1200x630), banner (1920x480), favicon (512x512)

## Existing templates

Check `~/dev/_claude/canva-cli/templates/` for reference. Adapt rather than start from scratch.
