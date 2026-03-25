const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { parseSize } = require('../lib/formats');

const PROJECT_ROOT = path.resolve(__dirname, '..');

async function exportDesign(options) {
  const {
    template,          // template name (e.g. "instagram-post")
    input,             // or direct HTML file path
    output: outputPath,// output file path
    format = 'png',    // png | jpeg | webp | pdf
    quality = 90,      // jpeg/webp quality (0-100)
    scale = 1,         // device scale factor (2 = retina)
    size,              // override size "1080x1080" or format name
    wait = 500,        // ms to wait for fonts/images to load
  } = options;

  // Resolve input — prefer server URL if server is running (for asset paths)
  const serverPort = process.env.PORT || 3456;
  let url;
  let useServer = false;
  if (template) {
    const filePath = path.join(PROJECT_ROOT, 'templates', `${template}.html`);
    if (!fs.existsSync(filePath)) throw new Error(`Template "${template}" not found`);
    // Check if server is running
    try {
      const http = require('http');
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${serverPort}/templates`, (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', reject);
        req.setTimeout(500, () => { req.destroy(); reject(new Error('timeout')); });
      });
      useServer = true;
    } catch (e) {
      useServer = false;
    }
    url = useServer
      ? `http://localhost:${serverPort}/raw/${template}`
      : `file://${filePath}`;
  } else if (input) {
    const resolved = path.resolve(input);
    if (!fs.existsSync(resolved)) throw new Error(`File "${input}" not found`);
    url = `file://${resolved}`;
  } else {
    throw new Error('Provide either --template or --input');
  }

  // Resolve output path
  const outFile = outputPath
    ? path.resolve(outputPath)
    : path.join(PROJECT_ROOT, 'output', `${template || 'design'}-${Date.now()}.${format}`);

  // Ensure output dir exists
  fs.mkdirSync(path.dirname(outFile), { recursive: true });

  // Resolve viewport size
  let width = 1080, height = 1080;
  if (size) {
    const parsed = parseSize(size);
    if (!parsed) throw new Error(`Unknown size: "${size}"`);
    width = parsed.width;
    height = parsed.height;
  } else {
    // Try to detect from the HTML
    const html = fs.readFileSync(url.replace('file://', ''), 'utf-8');
    const wMatch = html.match(/width:\s*(\d+)px/);
    const hMatch = html.match(/height:\s*(\d+)px/);
    if (wMatch) width = parseInt(wMatch[1]);
    if (hMatch) height = parseInt(hMatch[1]);
  }

  // Launch browser and export
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
  });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  // Extra wait for fonts and images
  if (wait > 0) await page.waitForTimeout(wait);

  if (format === 'pdf') {
    await page.pdf({
      path: outFile,
      width: `${width}px`,
      height: `${height}px`,
      printBackground: true,
    });
  } else {
    await page.screenshot({
      path: outFile,
      type: format === 'webp' ? 'png' : format, // Playwright doesn't support webp natively
      fullPage: false,
    });
  }

  await browser.close();

  const stats = fs.statSync(outFile);
  console.log(`Exported: ${outFile} (${(stats.size / 1024).toFixed(1)} KB)`);
  return outFile;
}

// CLI usage: node export.js --template instagram-post --format png --scale 2
async function main() {
  const args = process.argv.slice(2);
  const opts = {};

  for (let i = 0; i < args.length; i++) {
    const key = args[i].replace(/^--/, '');
    const val = args[i + 1];
    if (['template', 'input', 'output', 'format', 'size'].includes(key)) {
      opts[key] = val; i++;
    } else if (['quality', 'scale', 'wait'].includes(key)) {
      opts[key] = parseInt(val); i++;
    }
  }

  if (!opts.template && !opts.input) {
    console.log(`
Usage:
  node export.js --template <name> [options]
  node export.js --input <file.html> [options]

Options:
  --format   png|jpeg|pdf  (default: png)
  --output   output path
  --size     1080x1080 or format name (instagram-post, a4, etc.)
  --scale    device scale factor (default: 1, use 2 for retina)
  --quality  jpeg quality 0-100 (default: 90)
  --wait     ms to wait for rendering (default: 500)
`);
    process.exit(1);
  }

  await exportDesign(opts);
}

main().catch(err => {
  console.error('Export failed:', err.message);
  process.exit(1);
});

module.exports = { exportDesign };
