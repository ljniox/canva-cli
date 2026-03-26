# Canva CLI

Canva-like design tool powered by Claude Code — prompt to PNG/PDF via HTML/CSS/SVG rendering.

## Features

- **Prompt-to-design** — describe what you want, get a professional graphic
- **Adaptive styles** — 10 design styles (editorial, poster, brutalist, retro, glassmorphism, art deco...)
- **Stock images** — search Unsplash, Pexels, Pixabay directly
- **AI background removal** — detour people/objects locally (no API)
- **Image processing** — gradient masks, filters, compositing via Sharp
- **Live preview** — Express server with auto-reload on port 3456
- **Export** — PNG, JPEG, PDF via Playwright headless
- **25+ preset formats** — Instagram, Story, A4, LinkedIn, YouTube, etc.

## Stack

All open-source, zero proprietary dependencies:

| Component | Tech | License |
|---|---|---|
| Server | Express | MIT |
| Export | Playwright (Chromium) | Apache 2.0 |
| Image processing | Sharp | Apache 2.0 |
| Background removal | @imgly/background-removal-node | MIT |
| Rendering | HTML/CSS/SVG/Canvas (Fabric.js) | MIT |

## Installation

```bash
cd canva-cli
npm install
npx playwright install chromium
```

## Usage

### Start the preview server

```bash
npm run serve
# → http://localhost:3456
```

### Export a template

```bash
node server/export.js --template instagram-post --format png --scale 2
node server/export.js --template flyer-a4 --format pdf
node server/export.js --template my-design --format jpeg --output ~/Desktop/design.jpg
```

### Options

| Flag | Description |
|---|---|
| `--template` | Template name (from `templates/` folder) |
| `--input` | Or a direct HTML file path |
| `--format` | `png`, `jpeg`, `pdf` |
| `--scale` | Device scale factor (2 = retina) |
| `--size` | Override: `1080x1080` or format name |
| `--output` | Custom output path |

## Claude Code Integration

This project includes a `skill.md` that turns Claude Code into a graphic designer:

1. Describe what you need ("crée un post Instagram pour une promo -30%")
2. Claude detects the context and picks the right style
3. Generates HTML/CSS, serves it, takes a screenshot
4. Shows you the preview, iterates on your feedback
5. Exports the final design

### Adaptive style engine

The skill automatically adapts based on your request:

| Request type | Style applied |
|---|---|
| Poster, pub, flyer | Bold typography, dramatic composition |
| Instagram, TikTok | Eye-catching, trend-aware |
| Magazine, editorial | Elegant serif, generous whitespace |
| Business card, branding | Minimal, precise |
| Event, concert | Maximalist or brutalist |
| Luxury, immobilier | Art deco, editorial |

### Available styles

Editorial, Swiss, Brutalist, Retro, Maximalist, Glassmorphism, Art Deco, Poster, Corporate, Minimal — each with curated font pairings and color palettes.

## Project structure

```
canva-cli/
├── server/
│   ├── index.js          # Express server + live-reload
│   └── export.js         # Playwright headless export
├── lib/
│   ├── formats.js        # 25+ preset dimensions
│   ├── renderer.js       # HTML/SVG/Fabric.js wrappers
│   ├── image.js          # Background removal, masks, filters
│   ├── stock-images.js   # Unsplash/Pexels/Pixabay integration
│   └── styles.js         # 10 design styles + font pairings + palettes
├── templates/            # HTML design files
├── assets/images/        # Stock photos and processed images
├── output/               # Exported PNG/PDF files
├── skill.md              # Claude Code skill definition
└── package.json
```

## Stock image API keys (optional)

For searching images by keyword (download by URL works without keys):

```bash
export UNSPLASH_ACCESS_KEY="..."   # https://unsplash.com/developers
export PEXELS_API_KEY="..."        # https://www.pexels.com/api/
export PIXABAY_API_KEY="..."       # https://pixabay.com/api/docs/
```

## License

MIT
