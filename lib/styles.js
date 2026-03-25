// ──────────────────────────────────────────────
// Design Styles Catalog — adaptive by context
// ──────────────────────────────────────────────

// ── FONT PAIRINGS ──────────────────────────────
// Each pairing: [headline Google Font import, body Google Font import]
const FONT_PAIRINGS = {
  // Editorial / Luxury
  editorial: {
    headline: { family: 'Playfair Display', weights: '700;900', style: 'High-contrast serif' },
    body: { family: 'Source Sans 3', weights: '300;400;600', style: 'Clean humanist sans' },
    url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap',
  },
  // Bold / Advertising
  impact: {
    headline: { family: 'Bebas Neue', weights: '400', style: 'Condensed all-caps' },
    body: { family: 'Lato', weights: '300;400;700', style: 'Friendly sans' },
    url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lato:wght@300;400;700&display=swap',
  },
  // Modern / Geometric
  modern: {
    headline: { family: 'Syne', weights: '600;700;800', style: 'Avant-garde sans' },
    body: { family: 'Inter', weights: '300;400;600', style: 'Clean geometric sans' },
    url: 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;600&display=swap',
  },
  // Elegant / Branding
  elegant: {
    headline: { family: 'Cormorant', weights: '600;700', style: 'Garamond-inspired display serif' },
    body: { family: 'Montserrat', weights: '300;400;600', style: 'Geometric sans' },
    url: 'https://fonts.googleapis.com/css2?family=Cormorant:wght@600;700&family=Montserrat:wght@300;400;600&display=swap',
  },
  // Poster / Street
  poster: {
    headline: { family: 'Anton', weights: '400', style: 'Ultra-bold display' },
    body: { family: 'Crimson Text', weights: '400;600', style: 'Classic old-style serif' },
    url: 'https://fonts.googleapis.com/css2?family=Anton&family=Crimson+Text:wght@400;600&display=swap',
  },
  // Retro / Vintage
  retro: {
    headline: { family: 'Josefin Sans', weights: '600;700', style: '1920s geometric' },
    body: { family: 'Radley', weights: '400', style: 'Letterpress serif' },
    url: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&family=Radley&display=swap',
  },
  // Tech / Brutalist
  brutalist: {
    headline: { family: 'Space Mono', weights: '700', style: 'Retro-futuristic mono' },
    body: { family: 'Space Mono', weights: '400', style: 'Monospace' },
    url: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
  },
  // Corporate / Professional
  corporate: {
    headline: { family: 'DM Serif Display', weights: '400', style: 'Elegant serif' },
    body: { family: 'DM Sans', weights: '300;400;500;700', style: 'Modern sans' },
    url: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;700&display=swap',
  },
  // Minimal / Swiss
  swiss: {
    headline: { family: 'Archivo Black', weights: '400', style: 'Grotesque bold' },
    body: { family: 'Archivo', weights: '300;400;500', style: 'Grotesque' },
    url: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@300;400;500&display=swap',
  },
  // Playful / Fun
  playful: {
    headline: { family: 'Poppins', weights: '700;800;900', style: 'Rounded geometric' },
    body: { family: 'Poppins', weights: '300;400;500', style: 'Geometric sans' },
    url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800;900&display=swap',
  },
};

// ── COLOR PALETTES ─────────────────────────────
const PALETTES = {
  // Vibrant / Bold
  vibrant: {
    primary: '#FF6347', accent: '#FFE066', dark: '#1A1A2E', light: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #FF6347, #FFE066)',
    mood: 'energetic, attention-grabbing',
  },
  // Cyberfuturistic
  cyber: {
    primary: '#00E8FF', accent: '#8A00FF', dark: '#101014', light: '#E0E0E0',
    gradient: 'linear-gradient(135deg, #00E8FF, #8A00FF)',
    mood: 'futuristic, tech, neon',
  },
  // Earth / Warm
  earth: {
    primary: '#4E342E', accent: '#CBB674', dark: '#2C1810', light: '#F5F5DC',
    gradient: 'linear-gradient(135deg, #4E342E, #CBB674)',
    mood: 'warm, natural, grounded',
  },
  // Pastel / Soft
  pastel: {
    primary: '#E8D9FF', accent: '#FFD7E8', dark: '#3D3D5C', light: '#FAFAFE',
    gradient: 'linear-gradient(135deg, #E8D9FF, #FFD7E8, #C9F2FF)',
    mood: 'soft, gentle, dreamy',
  },
  // Dark Luxe
  luxe: {
    primary: '#C9A84C', accent: '#8B6914', dark: '#1A1A1A', light: '#F0EEE9',
    gradient: 'linear-gradient(135deg, #1A1A1A, #3C1440)',
    mood: 'luxury, exclusive, premium',
  },
  // Monochrome
  mono: {
    primary: '#222222', accent: '#888888', dark: '#000000', light: '#FFFFFF',
    gradient: 'linear-gradient(180deg, #000000, #333333)',
    mood: 'clean, stark, dramatic',
  },
  // Deep Cobalt
  cobalt: {
    primary: '#1E4CA1', accent: '#FF6347', dark: '#0A1628', light: '#EEF1F8',
    gradient: 'linear-gradient(135deg, #0A1628, #1E4CA1)',
    mood: 'trustworthy, bold, professional',
  },
  // Sunset / Coral
  sunset: {
    primary: '#FF6B6B', accent: '#FFA07A', dark: '#2D1B2E', light: '#FFF5F3',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FFA07A, #FFE66D)',
    mood: 'warm, inviting, energetic',
  },
  // Forest / Green
  forest: {
    primary: '#2D5016', accent: '#8BC34A', dark: '#1A2E0A', light: '#F1F8E9',
    gradient: 'linear-gradient(135deg, #1A2E0A, #2D5016, #4A7C20)',
    mood: 'natural, eco, fresh',
  },
  // Royal Purple
  royal: {
    primary: '#6A1B9A', accent: '#CE93D8', dark: '#1A0A2E', light: '#F3E5F5',
    gradient: 'linear-gradient(135deg, #1A0A2E, #6A1B9A, #CE93D8)',
    mood: 'creative, regal, mystical',
  },
};

// ── DESIGN STYLES ──────────────────────────────
const STYLES = {
  editorial: {
    name: 'Editorial',
    description: 'Magazine-style, elegant, high-contrast typography',
    fonts: 'editorial',
    palettes: ['mono', 'luxe', 'cobalt'],
    composition: {
      layout: 'asymmetric grid with intentional breaks',
      whitespace: 'generous (15-20% margins)',
      headline_scale: '4-6x body size',
      techniques: ['large-scale photography', 'dramatic type scale', 'generous leading'],
    },
    texture: 'none or subtle paper',
    css_hints: {
      headline: 'font-size: 120-180px; line-height: 0.9; letter-spacing: -3px; text-transform: none',
      body: 'font-size: 18-22px; line-height: 1.8; max-width: 60ch',
      layout: 'mixed absolute positioning, overlapping text on image',
    },
  },
  swiss: {
    name: 'Swiss / International',
    description: 'Clean, grid-based, type-as-primary-visual',
    fonts: 'swiss',
    palettes: ['mono', 'vibrant', 'cobalt'],
    composition: {
      layout: 'strict asymmetric grid',
      whitespace: 'structured (grid-defined)',
      headline_scale: '3-5x body size',
      techniques: ['mathematical precision', 'flush left/ragged right', 'type as hero'],
    },
    texture: 'none — flat and clean',
    css_hints: {
      headline: 'font-size: 80-140px; text-transform: uppercase; letter-spacing: 2-5px',
      body: 'font-size: 16-20px; line-height: 1.6',
      layout: 'CSS grid, strict column alignment, bold color blocks',
    },
  },
  brutalist: {
    name: 'Brutalist',
    description: 'Raw, confrontational, oversized, utilitarian',
    fonts: 'brutalist',
    palettes: ['mono', 'vibrant'],
    composition: {
      layout: 'exposed grid, heavy borders, deliberate crudeness',
      whitespace: 'minimal or extreme — no middle ground',
      headline_scale: '5-10x body size',
      techniques: ['oversized type', 'overlapping', 'visible construction', 'harsh contrast'],
    },
    texture: 'raw, unfinished, high-contrast noise',
    css_hints: {
      headline: 'font-size: 150-250px; text-transform: uppercase; border: 4-8px solid black',
      body: 'font-size: 14-16px; font-family: monospace',
      layout: 'harsh borders, black backgrounds, deliberately ugly spacing',
    },
  },
  retro: {
    name: 'Retro / Vintage',
    description: 'Nostalgic, warm, textured, badge/emblem structures',
    fonts: 'retro',
    palettes: ['earth', 'sunset'],
    composition: {
      layout: 'centered or symmetrical, badge/emblem, border frames',
      whitespace: 'moderate, framed',
      headline_scale: '3-4x body size',
      techniques: ['symmetry', 'border decorations', 'centered stacking', 'aged textures'],
    },
    texture: 'film grain, paper, halftone, distressed edges',
    css_hints: {
      headline: 'font-size: 80-120px; text-transform: uppercase; letter-spacing: 8-15px',
      body: 'font-size: 18-22px; letter-spacing: 2px',
      layout: 'centered flex, decorative borders, rounded corners, grain overlay',
    },
  },
  maximalist: {
    name: 'Maximalist',
    description: 'Dense, layered, eclectic, vibrant, controlled chaos',
    fonts: 'playful',
    palettes: ['vibrant', 'sunset', 'pastel'],
    composition: {
      layout: 'layered chaos — overlapping, rotated, mixed sizes',
      whitespace: 'minimal — horror vacui',
      headline_scale: '4-8x body size, varied per element',
      techniques: ['collage', 'mixed media', 'pattern overlay', 'rotation', 'eclectic fonts'],
    },
    texture: 'multiple layered — patterns, gradients, grain',
    css_hints: {
      headline: 'font-size: 100-200px; transform: rotate(-3 to 5deg); mix varied weights',
      body: 'font-size: 16-20px',
      layout: 'absolute positioning, overlapping z-index, rotated elements, background patterns',
    },
  },
  glassmorphism: {
    name: 'Glassmorphism',
    description: 'Frosted glass panels, vivid backgrounds, depth layering',
    fonts: 'modern',
    palettes: ['cyber', 'pastel', 'royal'],
    composition: {
      layout: 'layered depth with frosted panels',
      whitespace: 'moderate within glass panels',
      headline_scale: '3-4x body size',
      techniques: ['backdrop-filter blur', 'semi-transparent panels', 'vivid background', 'soft shadows'],
    },
    texture: 'frosted glass, subtle noise on panels, soft shadows',
    css_hints: {
      headline: 'font-size: 60-100px; font-weight: 700-900; color: white',
      body: 'font-size: 18-22px; color: rgba(255,255,255,0.8)',
      layout: 'background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); border-radius: 20-30px',
    },
  },
  artdeco: {
    name: 'Art Deco',
    description: 'Geometric, symmetrical, luxurious, gold accents',
    fonts: 'elegant',
    palettes: ['luxe', 'cobalt'],
    composition: {
      layout: 'symmetrical, geometric forms, decorative borders',
      whitespace: 'structured, framed by decoration',
      headline_scale: '3-5x body size',
      techniques: ['symmetry', 'geometric patterns', 'fan/sunburst motifs', 'gold lines'],
    },
    texture: 'metallic finishes, geometric line patterns',
    css_hints: {
      headline: 'font-size: 80-140px; text-transform: uppercase; letter-spacing: 8-20px; color: gold',
      body: 'font-size: 18-22px; letter-spacing: 3px',
      layout: 'centered, borders with gold (#C9A84C), geometric SVG patterns, line separators',
    },
  },
  poster: {
    name: 'Poster / Advertising',
    description: 'High-impact, single message, type-as-hero, bold',
    fonts: 'impact',
    palettes: ['vibrant', 'mono', 'cobalt', 'sunset'],
    composition: {
      layout: 'single focal point, dramatic scale contrast',
      whitespace: 'strategic — breathing room around hero element',
      headline_scale: '5-8x body size',
      techniques: ['type filling canvas', 'custom shape crops', 'diagonal energy', 'one dominant color'],
    },
    texture: 'none or grain for warmth',
    css_hints: {
      headline: 'font-size: 140-300px; text-transform: uppercase; line-height: 0.85',
      body: 'font-size: 20-28px; font-weight: 300-400',
      layout: 'hero type dominates, supporting text much smaller, bold color background',
    },
  },
  corporate: {
    name: 'Corporate / Professional',
    description: 'Clean, trustworthy, structured, balanced',
    fonts: 'corporate',
    palettes: ['cobalt', 'forest', 'earth'],
    composition: {
      layout: 'grid-based, balanced, clear hierarchy',
      whitespace: 'generous (professional feel)',
      headline_scale: '2-3x body size',
      techniques: ['clean grid', 'consistent spacing', 'icon usage', 'subtle accents'],
    },
    texture: 'none — flat and clean',
    css_hints: {
      headline: 'font-size: 48-72px; font-weight: 700',
      body: 'font-size: 16-20px; line-height: 1.7; color: #555',
      layout: 'structured grid, subtle shadows, consistent padding, brand color accents',
    },
  },
  minimal: {
    name: 'Minimal',
    description: 'Less is more, extreme simplicity, maximum whitespace',
    fonts: 'modern',
    palettes: ['mono', 'earth', 'pastel'],
    composition: {
      layout: 'centered or asymmetric, vast negative space',
      whitespace: 'extreme — 30-50% of canvas',
      headline_scale: '2-4x body size',
      techniques: ['single focal element', 'extreme whitespace', 'one accent color', 'precise alignment'],
    },
    texture: 'none',
    css_hints: {
      headline: 'font-size: 48-80px; font-weight: 300-600; letter-spacing: 2-5px',
      body: 'font-size: 16-18px; font-weight: 300; color: #666',
      layout: 'centered, max-width constrained, vast padding',
    },
  },
};

// ── CONTEXT DETECTION ──────────────────────────
// Maps request keywords to recommended styles
const CONTEXT_MAP = {
  // Graphic design / Creative
  'affiche': ['poster', 'swiss', 'brutalist'],
  'poster': ['poster', 'swiss', 'brutalist'],
  'pub': ['poster', 'maximalist', 'glassmorphism'],
  'publicité': ['poster', 'maximalist', 'glassmorphism'],
  'publicite': ['poster', 'maximalist', 'glassmorphism'],
  'advertisement': ['poster', 'maximalist', 'glassmorphism'],
  'flyer': ['poster', 'retro', 'maximalist'],
  'tract': ['poster', 'brutalist'],
  'créa': ['poster', 'editorial', 'maximalist'],
  'crea': ['poster', 'editorial', 'maximalist'],

  // Social media
  'instagram': ['editorial', 'maximalist', 'glassmorphism', 'poster'],
  'story': ['glassmorphism', 'maximalist', 'editorial'],
  'post social': ['poster', 'maximalist', 'editorial'],
  'linkedin': ['corporate', 'editorial', 'minimal'],
  'twitter': ['poster', 'brutalist', 'minimal'],
  'tiktok': ['maximalist', 'glassmorphism', 'poster'],
  'youtube thumbnail': ['poster', 'maximalist', 'vibrant'],

  // Print / Editorial
  'magazine': ['editorial', 'swiss'],
  'editorial': ['editorial', 'swiss'],
  'couverture': ['editorial', 'artdeco', 'poster'],
  'cover': ['editorial', 'artdeco', 'poster'],
  'livre': ['editorial', 'minimal'],
  'book': ['editorial', 'minimal'],

  // Branding
  'logo': ['swiss', 'minimal', 'artdeco'],
  'branding': ['swiss', 'minimal', 'corporate'],
  'carte de visite': ['minimal', 'corporate', 'artdeco'],
  'business card': ['minimal', 'corporate', 'artdeco'],

  // Events
  'invitation': ['artdeco', 'elegant', 'editorial'],
  'événement': ['poster', 'glassmorphism', 'artdeco'],
  'evenement': ['poster', 'glassmorphism', 'artdeco'],
  'event': ['poster', 'glassmorphism', 'artdeco'],
  'concert': ['poster', 'brutalist', 'maximalist'],
  'festival': ['maximalist', 'brutalist', 'retro'],

  // Mood / Style
  'luxe': ['artdeco', 'editorial', 'minimal'],
  'luxury': ['artdeco', 'editorial', 'minimal'],
  'vintage': ['retro'],
  'retro': ['retro'],
  'modern': ['glassmorphism', 'swiss', 'minimal'],
  'moderne': ['glassmorphism', 'swiss', 'minimal'],
  'fun': ['maximalist', 'playful'],
  'playful': ['maximalist', 'playful'],
  'serious': ['swiss', 'corporate', 'minimal'],
  'professionnel': ['corporate', 'minimal', 'swiss'],
  'professional': ['corporate', 'minimal', 'swiss'],
  'tech': ['brutalist', 'glassmorphism', 'swiss'],
  'futuriste': ['glassmorphism', 'brutalist'],
  'elegant': ['editorial', 'artdeco', 'minimal'],
  'élégant': ['editorial', 'artdeco', 'minimal'],
  'audacieux': ['poster', 'brutalist', 'maximalist'],
  'bold': ['poster', 'brutalist', 'maximalist'],

  // Web (when explicitly web)
  'landing page': ['minimal', 'corporate', 'glassmorphism'],
  'website': ['minimal', 'corporate', 'glassmorphism'],
  'web': ['minimal', 'corporate'],
  'dashboard': ['corporate', 'minimal'],
  'ui': ['minimal', 'corporate'],
  'app': ['minimal', 'glassmorphism'],

  // Immobilier (user's domain)
  'immobilier': ['editorial', 'corporate', 'luxe'],
  'real estate': ['editorial', 'corporate', 'luxe'],
  'propriété': ['editorial', 'luxe', 'artdeco'],
  'property': ['editorial', 'luxe', 'artdeco'],
};

/**
 * Detect recommended styles from a prompt
 * Returns sorted array of { style, score } objects
 */
function detectStyles(prompt) {
  const lower = prompt.toLowerCase();
  const scores = {};

  for (const [keyword, styles] of Object.entries(CONTEXT_MAP)) {
    if (lower.includes(keyword)) {
      styles.forEach((style, i) => {
        // First match gets highest score
        scores[style] = (scores[style] || 0) + (styles.length - i);
      });
    }
  }

  // Sort by score descending
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([style, score]) => ({ style, score, ...STYLES[style] }));

  // Default to editorial + poster if nothing matched
  if (sorted.length === 0) {
    return [
      { style: 'editorial', score: 1, ...STYLES.editorial },
      { style: 'poster', score: 1, ...STYLES.poster },
    ];
  }

  return sorted;
}

/**
 * Get full style config (style + font pairing + palette)
 */
function getStyleConfig(styleName, paletteName) {
  const style = STYLES[styleName];
  if (!style) return null;

  const fontPairing = FONT_PAIRINGS[style.fonts];
  const palette = paletteName
    ? PALETTES[paletteName]
    : PALETTES[style.palettes[0]];

  return {
    style,
    fonts: fontPairing,
    palette,
    allPalettes: style.palettes.map(p => ({ name: p, ...PALETTES[p] })),
  };
}

module.exports = {
  FONT_PAIRINGS,
  PALETTES,
  STYLES,
  CONTEXT_MAP,
  detectStyles,
  getStyleConfig,
};
