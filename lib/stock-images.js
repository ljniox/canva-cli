const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets', 'images');

// ──────────────────────────────────────────────
// Free stock image sources
// ──────────────────────────────────────────────

const SOURCES = {
  unsplash: {
    name: 'Unsplash',
    url: 'https://unsplash.com',
    license: 'Unsplash License (free for commercial use, no attribution required)',
    searchApi: 'https://api.unsplash.com/search/photos',
    envKey: 'UNSPLASH_ACCESS_KEY',
    docs: 'https://unsplash.com/developers',
  },
  pexels: {
    name: 'Pexels',
    url: 'https://www.pexels.com',
    license: 'Pexels License (free for commercial use, no attribution required)',
    searchApi: 'https://api.pexels.com/v1/search',
    envKey: 'PEXELS_API_KEY',
    docs: 'https://www.pexels.com/api/',
  },
  pixabay: {
    name: 'Pixabay',
    url: 'https://pixabay.com',
    license: 'Pixabay License (free for commercial use, no attribution required)',
    searchApi: 'https://pixabay.com/api/',
    envKey: 'PIXABAY_API_KEY',
    docs: 'https://pixabay.com/api/docs/',
  },
};

// ──────────────────────────────────────────────
// HTTP helpers
// ──────────────────────────────────────────────

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location, headers).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Invalid JSON response')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    const mod = url.startsWith('https') ? https : http;

    const request = (downloadUrl) => {
      mod.get(downloadUrl, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(destPath); });
      }).on('error', (err) => {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        reject(err);
      });
    };

    request(url);
  });
}

// ──────────────────────────────────────────────
// Search functions per source
// ──────────────────────────────────────────────

/**
 * Search Unsplash for photos
 * Requires UNSPLASH_ACCESS_KEY env var
 * Free: 50 requests/hour (demo), 5000/hour (production)
 */
async function searchUnsplash(query, options = {}) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) throw new Error('Set UNSPLASH_ACCESS_KEY env var. Get one at https://unsplash.com/developers');

  const { perPage = 10, page = 1, orientation } = options;
  let url = `${SOURCES.unsplash.searchApi}?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
  if (orientation) url += `&orientation=${orientation}`; // landscape, portrait, squarish

  const data = await fetchJson(url, { Authorization: `Client-ID ${key}` });

  return data.results.map(photo => ({
    id: photo.id,
    source: 'unsplash',
    description: photo.description || photo.alt_description || '',
    width: photo.width,
    height: photo.height,
    author: photo.user.name,
    authorUrl: photo.user.links.html,
    urls: {
      thumb: photo.urls.thumb,     // 200px
      small: photo.urls.small,     // 400px
      regular: photo.urls.regular, // 1080px
      full: photo.urls.full,       // original
      raw: photo.urls.raw,         // raw with params
    },
    downloadUrl: photo.links.download,
    pageUrl: photo.links.html,
    license: SOURCES.unsplash.license,
  }));
}

/**
 * Search Pexels for photos
 * Requires PEXELS_API_KEY env var
 * Free: 200 requests/hour
 */
async function searchPexels(query, options = {}) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error('Set PEXELS_API_KEY env var. Get one at https://www.pexels.com/api/');

  const { perPage = 10, page = 1, orientation, size } = options;
  let url = `${SOURCES.pexels.searchApi}?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
  if (orientation) url += `&orientation=${orientation}`;
  if (size) url += `&size=${size}`; // small, medium, large

  const data = await fetchJson(url, { Authorization: key });

  return data.photos.map(photo => ({
    id: photo.id,
    source: 'pexels',
    description: photo.alt || '',
    width: photo.width,
    height: photo.height,
    author: photo.photographer,
    authorUrl: photo.photographer_url,
    urls: {
      thumb: photo.src.tiny,
      small: photo.src.small,
      regular: photo.src.medium,
      full: photo.src.original,
      large2x: photo.src.large2x,
    },
    downloadUrl: photo.src.original,
    pageUrl: photo.url,
    license: SOURCES.pexels.license,
  }));
}

/**
 * Search Pixabay for photos
 * Requires PIXABAY_API_KEY env var
 * Free: 100 requests/minute
 */
async function searchPixabay(query, options = {}) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) throw new Error('Set PIXABAY_API_KEY env var. Get one at https://pixabay.com/api/docs/');

  const { perPage = 10, page = 1, orientation, imageType = 'photo' } = options;
  let url = `${SOURCES.pixabay.searchApi}?key=${key}&q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&image_type=${imageType}`;
  if (orientation) url += `&orientation=${orientation}`;

  const data = await fetchJson(url);

  return data.hits.map(photo => ({
    id: photo.id,
    source: 'pixabay',
    description: photo.tags || '',
    width: photo.imageWidth,
    height: photo.imageHeight,
    author: photo.user,
    authorUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
    urls: {
      thumb: photo.previewURL,
      small: photo.webformatURL,       // 640px
      regular: photo.webformatURL,
      full: photo.largeImageURL,       // 1280px
    },
    downloadUrl: photo.largeImageURL,
    pageUrl: photo.pageURL,
    license: SOURCES.pixabay.license,
  }));
}

// ──────────────────────────────────────────────
// Unified search — tries available sources
// ──────────────────────────────────────────────

/**
 * Search across all configured sources (whichever has an API key set)
 * Returns combined results sorted by source priority: unsplash > pexels > pixabay
 */
async function searchImages(query, options = {}) {
  const results = [];
  const errors = [];

  const searches = [
    { fn: searchUnsplash, name: 'unsplash' },
    { fn: searchPexels, name: 'pexels' },
    { fn: searchPixabay, name: 'pixabay' },
  ];

  for (const { fn, name } of searches) {
    try {
      const r = await fn(query, options);
      results.push(...r);
    } catch (err) {
      errors.push({ source: name, error: err.message });
    }
  }

  if (results.length === 0 && errors.length > 0) {
    console.warn('Stock image search failed on all sources:');
    errors.forEach(e => console.warn(`  ${e.source}: ${e.error}`));
  }

  return results;
}

/**
 * Download an image from search results to assets/images/
 * Returns the local file path
 */
async function downloadImage(imageResult, options = {}) {
  const { size = 'regular', filename } = options;
  const url = imageResult.urls[size] || imageResult.urls.regular || imageResult.downloadUrl;
  const ext = url.match(/\.(jpe?g|png|webp)/i)?.[1] || 'jpg';
  const name = filename || `${imageResult.source}-${imageResult.id}.${ext}`;
  const destPath = path.join(ASSETS_DIR, name);

  console.log(`Downloading from ${imageResult.source}: ${imageResult.description || imageResult.id}`);
  await downloadFile(url, destPath);
  console.log(`Saved: ${destPath}`);

  return destPath;
}

/**
 * Download directly from a URL
 */
async function downloadFromUrl(url, filename) {
  const name = filename || `download-${Date.now()}.jpg`;
  const destPath = path.join(ASSETS_DIR, name);
  await downloadFile(url, destPath);
  console.log(`Downloaded: ${destPath}`);
  return destPath;
}

/**
 * List available sources and their API key status
 */
function listSources() {
  return Object.entries(SOURCES).map(([key, source]) => ({
    key,
    name: source.name,
    url: source.url,
    license: source.license,
    docs: source.docs,
    configured: !!process.env[source.envKey],
    envKey: source.envKey,
  }));
}

module.exports = {
  SOURCES,
  searchUnsplash,
  searchPexels,
  searchPixabay,
  searchImages,
  downloadImage,
  downloadFromUrl,
  downloadFile,
  listSources,
};
