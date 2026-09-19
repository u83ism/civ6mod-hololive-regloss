// Generate .tex sidecar files by copying Firaxis's own shipped UI icon .tex templates
// (Civ6 SDK Assets pantry/Textures/CivAztec*.tex, Montezuma*.tex) and substituting the name.
// This matches the documented approach (civ6wiki.info) of copying+renaming a real .tex
// rather than hand-authoring one, since only the SDK-shipped files are known-good.
const fs = require('fs');
const path = require('path');

const SDK_ASSETS_TEXTURES = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sid Meier's Civilization VI SDK Assets\\Civ6\\pantry\\Textures";

const outDir = path.join(__dirname, '..', 'IconBuild', 'Textures');
fs.mkdirSync(outDir, { recursive: true });

const mappings = [
  // [ our name prefix, size, template name prefix ]
  ...[22, 30, 32, 36, 44, 45, 48, 50, 64, 80, 128, 256].map(size => ({
    ours: `ICON_CIVILIZATION_REGLOSS_ICHIJOU_${size}`,
    template: `CivAztec${size}`,
  })),
  ...[32, 45, 48, 50, 55, 64, 80, 256].map(size => ({
    ours: `ICON_LEADER_REGLOSS_ICHIJOU_RIRIKA_${size}`,
    template: `Montezuma${size}`,
  })),
];

for (const { ours, template } of mappings) {
  const templatePath = path.join(SDK_ASSETS_TEXTURES, `${template}.tex`);
  let xml = fs.readFileSync(templatePath, 'utf8');
  xml = xml.split(template).join(ours);
  const outPath = path.join(outDir, `${ours}.tex`);
  fs.writeFileSync(outPath, xml);
  console.log(`${outPath} (from ${template}.tex)`);
}
