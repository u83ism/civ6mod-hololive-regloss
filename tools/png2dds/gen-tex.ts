// Generate .tex sidecar files by copying Firaxis's own shipped UI icon .tex templates
// (Civ6 SDK Assets pantry/Textures/CivAztec*.tex, Montezuma*.tex) and substituting the name.
// This matches the documented approach (civ6wiki.info) of copying+renaming a real .tex
// rather than hand-authoring one, since only the SDK-shipped files are known-good.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SDK_ASSETS_TEXTURES =
  "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sid Meier's Civilization VI SDK Assets\\Civ6\\pantry\\Textures";

interface TexMapping {
  readonly ourName: string;
  readonly templateName: string;
}

const outputDirectory = join(import.meta.dirname, "..", "IconBuild", "Textures");
mkdirSync(outputDirectory, { recursive: true });

const mappings: readonly TexMapping[] = [
  // [ our name prefix, size, template name prefix ]
  ...[22, 30, 32, 36, 44, 45, 48, 50, 64, 80, 128, 256].map((size) => ({
    ourName: `ICON_CIVILIZATION_REGLOSS_ICHIJOU_${size}`,
    templateName: `CivAztec${size}`,
  })),
  ...[32, 45, 48, 50, 55, 64, 80, 256].map((size) => ({
    ourName: `ICON_LEADER_REGLOSS_ICHIJOU_RIRIKA_${size}`,
    templateName: `Montezuma${size}`,
  })),
];

for (const { ourName, templateName } of mappings) {
  const templatePath = join(SDK_ASSETS_TEXTURES, `${templateName}.tex`);
  const xml = readFileSync(templatePath, "utf8").split(templateName).join(ourName);
  const outputPath = join(outputDirectory, `${ourName}.tex`);
  writeFileSync(outputPath, xml);
  console.log(`${outputPath} (from ${templateName}.tex)`);
}
