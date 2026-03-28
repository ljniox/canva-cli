/**
 * Design Inspiration & Resources — free APIs for colors, images, fonts, trends
 * All endpoints are free, most require no API key.
 */

const https = require('https');
const http = require('http');

// ══════════════════════════════════════════════════
// COLOR PALETTES (no key required)
// ══════════════════════════════════════════════════

/**
 * Generate a color scheme from a hex color
 * Modes: monochrome, analogic, complement, triad, quad, analogic-complement
 * @example getColorScheme('1B6FA0', 'analogic', 5)
 */
async function getColorScheme(hex, mode = 'analogic', count = 5) {
  const url = `https://www.thecolorapi.com/scheme?hex=${hex.replace('#', '')}&mode=${mode}&count=${count}&format=json`;
  const data = await fetchJson(url);
  return data.colors.map(c => ({
    name: c.name.value,
    hex: c.hex.value,
    rgb: c.rgb.value,
    hsl: c.hsl.value,
    contrast: c.contrast.value,
  }));
}

/**
 * AI-generated color palette via Colormind
 * Lock colors with [r,g,b], use "N" for AI-generated slots
 * Models: default, ui, makoto_shinkai, metroid_fusion, akira_film
 * @example getAIPalette(['N', [27,111,160], 'N', 'N', 'N'])
 */
async function getAIPalette(input = ['N','N','N','N','N'], model = 'default') {
  const body = JSON.stringify({ model, input });
  const data = await postJson('http://colormind.io/api/', body);
  return data.result.map(rgb => ({
    rgb,
    hex: '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join(''),
  }));
}

// ══════════════════════════════════════════════════
// FREE STOCK IMAGES (Openverse — no key required)
// ══════════════════════════════════════════════════

/**
 * Search Openverse for CC0/public domain images
 * 800M+ images from Flickr, Wikimedia, etc.
 * @example searchOpenverse('church worship', 'cc0', 5)
 */
async function searchOpenverse(query, license = 'cc0', count = 10) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license=${license}&page_size=${count}`;
  const data = await fetchJson(url);
  return (data.results || []).map(img => ({
    id: img.id,
    title: img.title,
    url: img.url,
    thumbnail: img.thumbnail,
    creator: img.creator,
    license: img.license,
    source: img.source,
    tags: (img.tags || []).map(t => t.name),
  }));
}

// ══════════════════════════════════════════════════
// WIKIMEDIA COMMONS (no key required)
// ══════════════════════════════════════════════════

/**
 * Search Wikimedia Commons for images
 * Great for public domain religious art, historical paintings
 * @example searchWikimedia('Entry of Christ into Jerusalem')
 */
async function searchWikimedia(query, count = 10) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=${count}&format=json&origin=*`;
  const data = await fetchJson(url);
  const results = (data.query?.search || []).map(item => ({
    title: item.title.replace('File:', ''),
    pageId: item.pageid,
    snippet: item.snippet.replace(/<[^>]+>/g, ''),
  }));

  // Get image URLs
  for (const r of results) {
    try {
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(r.title)}&prop=imageinfo&iiprop=url|size&format=json&origin=*`;
      const infoData = await fetchJson(infoUrl);
      const pages = infoData.query?.pages || {};
      const page = Object.values(pages)[0];
      if (page?.imageinfo?.[0]) {
        r.url = page.imageinfo[0].url;
        r.width = page.imageinfo[0].width;
        r.height = page.imageinfo[0].height;
      }
    } catch (e) { /* skip */ }
  }

  return results.filter(r => r.url);
}

/**
 * Browse a Wikimedia category for images
 * @example browseWikimediaCategory('Christian_art', 10)
 */
async function browseWikimediaCategory(category, count = 10) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(category)}&cmtype=file&cmlimit=${count}&format=json&origin=*`;
  const data = await fetchJson(url);
  return (data.query?.categorymembers || []).map(m => ({
    title: m.title.replace('File:', ''),
    pageId: m.pageid,
  }));
}

// ══════════════════════════════════════════════════
// AI IMAGE GENERATION (OpenRouter — requires key)
// ══════════════════════════════════════════════════

/**
 * Generate an image via OpenRouter (Gemini Flash Image or GPT-5 Image)
 * @param {string} prompt - Image description
 * @param {string} outputPath - Where to save the image
 * @param {object} options - model, apiKey
 */
async function generateImage(prompt, outputPath, options = {}) {
  const apiKey = options.apiKey || process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('Set OPENROUTER_API_KEY env var');

  const model = options.model || 'google/gemini-2.5-flash-image';
  const fs = require('fs');

  const body = JSON.stringify({
    model,
    messages: [{ role: 'user', content: `Generate an image: ${prompt}. Only output the image, no text.` }],
    response_format: { type: 'image' },
  });

  const data = await postJson('https://openrouter.ai/api/v1/chat/completions', body, {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  });

  const images = data.choices?.[0]?.message?.images || [];
  if (images.length > 0) {
    const url = images[0].image_url.url;
    const b64 = url.split(',', 2)[1];
    const buffer = Buffer.from(b64, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`  Generated: ${outputPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
    return outputPath;
  }

  throw new Error('No image in response: ' + JSON.stringify(data).slice(0, 300));
}

// ══════════════════════════════════════════════════
// DESIGN TRENDS (RSS feeds — no key required)
// ══════════════════════════════════════════════════

const TREND_FEEDS = {
  awwwards:  'https://www.awwwards.com/feed/',
  dribbble:  'https://dribbble.com/stories.rss',
  smashing:  'https://www.smashingmagazine.com/feed/',
  codrops:   'https://tympanus.net/codrops/feed/',
};

// ══════════════════════════════════════════════════
// USEFUL WIKIMEDIA CATEGORIES FOR CHURCH DESIGNS
// ══════════════════════════════════════════════════

const CHURCH_CATEGORIES = [
  'Christian_art',
  'Religious_paintings',
  'Paintings_of_the_life_of_Jesus',
  'Palm_Sunday',
  'Entry_of_Christ_into_Jerusalem',
  'Crucifixion_of_Jesus',
  'Nativity_of_Jesus_in_art',
  'Paintings_of_the_Resurrection_of_Jesus',
  'Christian_cross_variants',
  'Church_architecture',
];

// ══════════════════════════════════════════════════
// HTTP helpers
// ══════════════════════════════════════════════════

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'canva-cli/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve, reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Invalid JSON from ${url}`)); }
      });
    }).on('error', reject);
  });
}

function postJson(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...headers },
    };
    const req = mod.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Invalid JSON response')); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = {
  // Colors
  getColorScheme,
  getAIPalette,
  // Images
  searchOpenverse,
  searchWikimedia,
  browseWikimediaCategory,
  generateImage,
  // Constants
  TREND_FEEDS,
  CHURCH_CATEGORIES,
};
