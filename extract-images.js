const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = ['index.html', '2-otstroyka.html', '3-club.html'];
let imgCounter = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const regex = /src="data:image\/(png|jpe?g|webp|gif);base64,([^"]+)"/g;
  let match;
  let changed = false;
  const replacements = [];

  while ((match = regex.exec(html)) !== null) {
    const ext = match[1] === 'jpg' ? 'jpeg' : match[1];
    const fname = `img-${++imgCounter}.${ext === 'jpeg' ? 'jpg' : ext}`;
    const buffer = Buffer.from(match[2], 'base64');
    fs.writeFileSync(path.join(dir, fname), buffer);
    replacements.push({ full: match[0], newSrc: `src="${fname}"`, size: buffer.length });
  }

  for (const r of replacements) {
    html = html.replace(r.full, r.newSrc);
    changed = true;
    console.log(`${file}: extracted ${r.newSrc} (${(r.size / 1024).toFixed(1)} KB)`);
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
  }
}
