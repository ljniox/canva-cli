const fs = require('fs');
const path = require('path');

// Wraps design HTML into a full page ready for screenshot
function wrapHtml(bodyContent, width, height, options = {}) {
  const fonts = options.fonts || ['Inter:wght@300;400;600;700;900'];
  const fontLinks = fonts.map(f =>
    `<link href="https://fonts.googleapis.com/css2?family=${f}&display=swap" rel="stylesheet">`
  ).join('\n  ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${fontLinks}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
    body { font-family: 'Inter', system-ui, sans-serif; }
    .canvas {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      overflow: hidden;
    }
  </style>
  ${options.extraHead || ''}
</head>
<body>
  <div class="canvas">
    ${bodyContent}
  </div>
  ${options.extraBody || ''}
</body>
</html>`;
}

// Wraps an SVG design into a full page
function wrapSvg(svgContent, width, height) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;
}

// Wraps a Fabric.js canvas design into a full page
function wrapFabric(fabricScript, width, height, options = {}) {
  const fonts = options.fonts || ['Inter:wght@300;400;600;700;900'];
  const fontLinks = fonts.map(f =>
    `<link href="https://fonts.googleapis.com/css2?family=${f}&display=swap" rel="stylesheet">`
  ).join('\n  ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  ${fontLinks}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="c" width="${width}" height="${height}"></canvas>
  <script>
    const canvas = new fabric.StaticCanvas('c', { width: ${width}, height: ${height} });
    ${fabricScript}
    canvas.renderAll();
  </script>
</body>
</html>`;
}

// Save rendered HTML to a file in templates/
function saveDesign(name, htmlContent, projectRoot) {
  const dir = path.join(projectRoot, 'templates');
  const filePath = path.join(dir, `${name}.html`);
  fs.writeFileSync(filePath, htmlContent, 'utf-8');
  return filePath;
}

module.exports = { wrapHtml, wrapSvg, wrapFabric, saveDesign };
