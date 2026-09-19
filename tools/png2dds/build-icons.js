// Regenerate every ICON_*.dds in Art/Icons from its ICON_*.png source.
// Usage: node build-icons.js
const fs = require('fs');
const path = require('path');
const { convert } = require('./png2dds');

const iconsDir = path.join(__dirname, '..', '..', 'Art', 'Icons');
const outDir = path.join(__dirname, '..', 'IconBuild', 'Textures');
fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(iconsDir)) {
  if (!file.startsWith('ICON_') || !file.endsWith('.png')) continue;
  const inPath = path.join(iconsDir, file);
  const outPath = path.join(outDir, file.replace(/\.png$/, '.dds'));
  convert(inPath, outPath);
}
