const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets', 'images');

/**
 * Remove background from an image using @imgly/background-removal-node
 * Returns path to the output PNG with transparent background
 */
async function removeBackground(inputPath, outputPath) {
  // Dynamic import (ESM module)
  const { removeBackground: removeBg } = await import('@imgly/background-removal-node');

  const inputBuffer = fs.readFileSync(inputPath);
  const blob = new Blob([inputBuffer], { type: 'image/png' });

  console.log('Removing background (this may take a moment on first run)...');
  const resultBlob = await removeBg(blob, {
    output: { format: 'image/png', quality: 1 },
  });

  const arrayBuffer = await resultBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const out = outputPath || inputPath.replace(/\.\w+$/, '-cutout.png');
  fs.writeFileSync(out, buffer);
  console.log(`Background removed: ${out}`);
  return out;
}

/**
 * Apply a gradient transparency mask to an image
 * direction: 'bottom-to-top' | 'top-to-bottom' | 'left-to-right' | 'right-to-left'
 * coverage: 0-1, how much of the image the gradient covers (0.2 = 20%)
 */
async function applyGradientMask(inputPath, outputPath, options = {}) {
  const {
    direction = 'bottom-to-top',
    coverage = 0.2,
  } = options;

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Create SVG gradient mask
  let gradientDef;
  const gradientHeight = Math.round(height * coverage);
  const gradientWidth = Math.round(width * coverage);

  switch (direction) {
    case 'bottom-to-top':
      gradientDef = `
        <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="black"/>
          <stop offset="${coverage}" stop-color="white"/>
          <stop offset="1" stop-color="white"/>
        </linearGradient>`;
      break;
    case 'top-to-bottom':
      gradientDef = `
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="black"/>
          <stop offset="${coverage}" stop-color="white"/>
          <stop offset="1" stop-color="white"/>
        </linearGradient>`;
      break;
    case 'left-to-right':
      gradientDef = `
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="black"/>
          <stop offset="${coverage}" stop-color="white"/>
          <stop offset="1" stop-color="white"/>
        </linearGradient>`;
      break;
    case 'right-to-left':
      gradientDef = `
        <linearGradient id="g" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stop-color="black"/>
          <stop offset="${coverage}" stop-color="white"/>
          <stop offset="1" stop-color="white"/>
        </linearGradient>`;
      break;
  }

  const maskSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>${gradientDef}</defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
    </svg>
  `);

  // Ensure input has alpha channel
  const inputBuffer = await sharp(inputPath).ensureAlpha().raw().toBuffer();
  const maskBuffer = await sharp(maskSvg).grayscale().raw().toBuffer();

  // Apply mask to alpha channel
  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    pixels[i * 4] = inputBuffer[i * 4];         // R
    pixels[i * 4 + 1] = inputBuffer[i * 4 + 1]; // G
    pixels[i * 4 + 2] = inputBuffer[i * 4 + 2]; // B
    // Multiply existing alpha with mask
    const existingAlpha = inputBuffer[i * 4 + 3];
    const maskValue = maskBuffer[i]; // grayscale = single channel
    pixels[i * 4 + 3] = Math.round((existingAlpha * maskValue) / 255);
  }

  const out = outputPath || inputPath.replace(/\.\w+$/, '-gradient.png');
  await sharp(pixels, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(out);

  console.log(`Gradient mask applied: ${out}`);
  return out;
}

/**
 * Composite multiple images onto a background
 * layers: [{ input: 'path.png', top: 0, left: 0, blend: 'over' }, ...]
 */
async function composite(backgroundPath, layers, outputPath) {
  const composites = layers.map(layer => ({
    input: layer.input,
    top: layer.top || 0,
    left: layer.left || 0,
    blend: layer.blend || 'over',
  }));

  const out = outputPath || path.join(ASSETS_DIR, `composite-${Date.now()}.png`);
  await sharp(backgroundPath)
    .composite(composites)
    .png()
    .toFile(out);

  console.log(`Composite created: ${out}`);
  return out;
}

/**
 * Resize an image to fit within given dimensions (preserves aspect ratio)
 */
async function resize(inputPath, outputPath, width, height, options = {}) {
  const { fit = 'inside', background = { r: 0, g: 0, b: 0, alpha: 0 } } = options;

  const out = outputPath || inputPath.replace(/\.\w+$/, `-${width}x${height}.png`);
  await sharp(inputPath)
    .resize(width, height, { fit, background })
    .png()
    .toFile(out);

  console.log(`Resized: ${out} (${width}x${height})`);
  return out;
}

/**
 * Apply CSS-like filters to an image
 */
async function applyFilters(inputPath, outputPath, filters = {}) {
  let pipeline = sharp(inputPath);

  if (filters.blur) pipeline = pipeline.blur(filters.blur);
  if (filters.brightness) pipeline = pipeline.modulate({ brightness: filters.brightness });
  if (filters.saturation) pipeline = pipeline.modulate({ saturation: filters.saturation });
  if (filters.hue) pipeline = pipeline.modulate({ hue: filters.hue });
  if (filters.grayscale) pipeline = pipeline.grayscale();
  if (filters.sharpen) pipeline = pipeline.sharpen(filters.sharpen);
  if (filters.tint) pipeline = pipeline.tint(filters.tint);

  const out = outputPath || inputPath.replace(/\.\w+$/, '-filtered.png');
  await pipeline.png().toFile(out);

  console.log(`Filters applied: ${out}`);
  return out;
}

/**
 * Create a solid color or gradient background image
 */
async function createBackground(outputPath, width, height, options = {}) {
  const { color, gradient } = options;

  if (gradient) {
    // gradient: { from: '#hex', to: '#hex', angle: 135 }
    const angle = gradient.angle || 180;
    const rad = (angle * Math.PI) / 180;
    const x1 = 0.5 - Math.sin(rad) * 0.5;
    const y1 = 0.5 - Math.cos(rad) * 0.5;
    const x2 = 0.5 + Math.sin(rad) * 0.5;
    const y2 = 0.5 + Math.cos(rad) * 0.5;

    const svg = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
            <stop offset="0%" stop-color="${gradient.from}"/>
            <stop offset="100%" stop-color="${gradient.to}"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#g)"/>
      </svg>
    `);
    await sharp(svg).png().toFile(outputPath);
  } else {
    const c = color || '#1a1a2e';
    const svg = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${c}"/>
      </svg>
    `);
    await sharp(svg).png().toFile(outputPath);
  }

  console.log(`Background created: ${outputPath} (${width}x${height})`);
  return outputPath;
}

module.exports = {
  removeBackground,
  applyGradientMask,
  composite,
  resize,
  applyFilters,
  createBackground,
};
