const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3456;
const PROJECT_ROOT = path.resolve(__dirname, '..');

const app = express();

// Serve static assets
app.use('/assets', express.static(path.join(PROJECT_ROOT, 'assets')));
app.use('/output', express.static(path.join(PROJECT_ROOT, 'output')));

// Serve a specific template by name: /preview/instagram-post
app.get('/preview/:name', (req, res) => {
  const filePath = path.join(PROJECT_ROOT, 'templates', `${req.params.name}.html`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`Template "${req.params.name}" not found`);
  }
  // Inject live-reload script
  let html = fs.readFileSync(filePath, 'utf-8');
  html = injectLiveReload(html);
  res.type('html').send(html);
});

// List all available templates
app.get('/templates', (req, res) => {
  const dir = path.join(PROJECT_ROOT, 'templates');
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));
  res.json(files);
});

// Serve raw template file (no live-reload, for export)
app.get('/raw/:name', (req, res) => {
  const filePath = path.join(PROJECT_ROOT, 'templates', `${req.params.name}.html`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`Template "${req.params.name}" not found`);
  }
  res.sendFile(filePath);
});

// Simple index page listing templates
app.get('/', (req, res) => {
  const dir = path.join(PROJECT_ROOT, 'templates');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  const links = files.map(f => {
    const name = f.replace('.html', '');
    return `<li><a href="/preview/${name}">${name}</a></li>`;
  }).join('\n');

  res.type('html').send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Canva CLI — Templates</title>
  <style>
    body { font-family: system-ui; max-width: 600px; margin: 40px auto; padding: 0 20px; }
    h1 { font-size: 1.5rem; }
    li { margin: 8px 0; }
    a { color: #6366f1; }
  </style>
</head>
<body>
  <h1>Canva CLI — Templates</h1>
  <ul>${links}</ul>
</body>
</html>`);
});

// Live-reload via polling (no dependencies needed)
const RELOAD_SCRIPT = `
<script>
(function() {
  let lastMod = 0;
  setInterval(async () => {
    try {
      const res = await fetch('/api/last-modified');
      const data = await res.json();
      if (lastMod && data.ts > lastMod) location.reload();
      lastMod = data.ts;
    } catch(e) {}
  }, 800);
})();
</script>`;

let lastModifiedTs = Date.now();

// Touch endpoint — call this after editing a template to trigger reload
app.post('/api/touch', (req, res) => {
  lastModifiedTs = Date.now();
  res.json({ ok: true, ts: lastModifiedTs });
});

app.get('/api/last-modified', (req, res) => {
  res.json({ ts: lastModifiedTs });
});

function injectLiveReload(html) {
  if (html.includes('</body>')) {
    return html.replace('</body>', RELOAD_SCRIPT + '\n</body>');
  }
  return html + RELOAD_SCRIPT;
}

// Watch templates dir for changes → auto-bump lastModifiedTs
fs.watch(path.join(PROJECT_ROOT, 'templates'), { recursive: true }, () => {
  lastModifiedTs = Date.now();
});

app.listen(PORT, () => {
  console.log(`\n  Canva CLI server running at http://localhost:${PORT}\n`);
  console.log(`  Preview:  http://localhost:${PORT}/preview/<template-name>`);
  console.log(`  List:     http://localhost:${PORT}/templates`);
  console.log(`  Raw:      http://localhost:${PORT}/raw/<template-name>\n`);
});
