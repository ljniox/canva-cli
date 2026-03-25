// Predefined canvas sizes for common design formats
const FORMATS = {
  // Social media
  'instagram-post':    { width: 1080, height: 1080, label: 'Instagram Post' },
  'instagram-story':   { width: 1080, height: 1920, label: 'Instagram Story' },
  'facebook-post':     { width: 1200, height: 630,  label: 'Facebook Post' },
  'facebook-cover':    { width: 820,  height: 312,  label: 'Facebook Cover' },
  'twitter-post':      { width: 1600, height: 900,  label: 'Twitter/X Post' },
  'linkedin-post':     { width: 1200, height: 627,  label: 'LinkedIn Post' },
  'linkedin-banner':   { width: 1584, height: 396,  label: 'LinkedIn Banner' },
  'youtube-thumbnail': { width: 1280, height: 720,  label: 'YouTube Thumbnail' },
  'tiktok':            { width: 1080, height: 1920, label: 'TikTok Video' },
  'pinterest':         { width: 1000, height: 1500, label: 'Pinterest Pin' },

  // Print
  'a4':          { width: 2480, height: 3508, label: 'A4 (300dpi)' },
  'a4-landscape':{ width: 3508, height: 2480, label: 'A4 Landscape (300dpi)' },
  'a5':          { width: 1748, height: 2480, label: 'A5 (300dpi)' },
  'letter':      { width: 2550, height: 3300, label: 'US Letter (300dpi)' },
  'card':        { width: 1050, height: 600,  label: 'Business Card (300dpi)' },
  'flyer':       { width: 2480, height: 3508, label: 'Flyer A4' },
  'poster-a3':   { width: 3508, height: 4961, label: 'Poster A3 (300dpi)' },

  // Presentation
  'slide-16x9':  { width: 1920, height: 1080, label: 'Slide 16:9' },
  'slide-4x3':   { width: 1024, height: 768,  label: 'Slide 4:3' },

  // Web
  'og-image':    { width: 1200, height: 630,  label: 'OG Image' },
  'favicon':     { width: 512,  height: 512,  label: 'Favicon' },
  'banner':      { width: 1920, height: 480,  label: 'Web Banner' },

  // Custom
  'square-sm':   { width: 512,  height: 512,  label: 'Square Small' },
  'square-md':   { width: 1080, height: 1080, label: 'Square Medium' },
  'square-lg':   { width: 2048, height: 2048, label: 'Square Large' },
};

function getFormat(name) {
  return FORMATS[name] || null;
}

function listFormats() {
  return Object.entries(FORMATS).map(([key, val]) => ({
    key,
    ...val,
    display: `${val.label} (${val.width}x${val.height})`
  }));
}

function parseSize(input) {
  // Accept "1080x1080" or format name
  if (FORMATS[input]) return FORMATS[input];
  const match = input.match(/^(\d+)x(\d+)$/);
  if (match) return { width: parseInt(match[1]), height: parseInt(match[2]), label: 'Custom' };
  return null;
}

module.exports = { FORMATS, getFormat, listFormats, parseSize };
