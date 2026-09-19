// Generate .tex sidecar files by copying Firaxis's own shipped UI icon .tex templates
// (Civ6 SDK Assets pantry/Textures/CivAztec*.tex, Montezuma*.tex) and substituting the name.
// This matches the documented approach (civ6wiki.info) of copying+renaming a real .tex
// rather than hand-authoring one, since only the SDK-shipped files are known-good.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { civilizationIconName, civilizationIconSizes, leaderIconName, leaderIconSizes } from "./icon-manifest.js";

const SDK_ASSETS_TEXTURES =
  "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sid Meier's Civilization VI SDK Assets\\Civ6\\pantry\\Textures";

type TexMapping = {
  readonly ourName: string;
  readonly templateName: string;
};

const outputDirectory = join(import.meta.dirname, "..", "IconBuild", "Textures");
mkdirSync(outputDirectory, { recursive: true });

const mappings: readonly TexMapping[] = [
  ...civilizationIconSizes.map((size) => ({
    ourName: civilizationIconName(size),
    templateName: `CivAztec${size}`,
  })),
  ...leaderIconSizes.map((size) => ({
    ourName: leaderIconName(size),
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
