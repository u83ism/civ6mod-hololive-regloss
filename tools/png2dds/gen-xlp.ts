// Build XLPs/RegLoss_Icons.xlp using the exact header/footer structure of Firaxis's own
// Civ6 SDK Assets pantry/XLPs/Icons.xlp, with only our own icon entries.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const civilizationIconSizes = [22, 30, 32, 36, 44, 45, 48, 50, 64, 80, 128, 256];
const leaderIconSizes = [32, 45, 48, 50, 55, 64, 80, 256];

const entries = [
  ...civilizationIconSizes.map((size) => `ICON_CIVILIZATION_REGLOSS_ICHIJOU_${size}`),
  ...leaderIconSizes.map((size) => `ICON_LEADER_REGLOSS_ICHIJOU_RIRIKA_${size}`),
];

const elements = entries
  .map((name) => `\t\t<Element>\n\t\t\t<m_EntryID text="${name}"/>\n\t\t\t<m_ObjectName text="${name}"/>\n\t\t</Element>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<AssetObjects..XLP>
\t<m_Version>
\t\t<major>4</major>
\t\t<minor>0</minor>
\t\t<build>434</build>
\t\t<revision>920</revision>
\t</m_Version>
\t<m_ClassName text="UITexture"/>
\t<m_PackageName text="UI/RegLoss_Icons"/>
\t<m_Entries>
${elements}
\t</m_Entries>
\t<m_AllowedPlatforms>
\t\t<Element>WINDOWS</Element>
\t\t<Element>LINUX</Element>
\t\t<Element>MACOS</Element>
\t\t<Element>IOS</Element>
\t</m_AllowedPlatforms>
</AssetObjects..XLP>
`;

const outputDirectory = join(import.meta.dirname, "..", "IconBuild", "XLPs");
mkdirSync(outputDirectory, { recursive: true });
const outputPath = join(outputDirectory, "RegLoss_Icons.xlp");
writeFileSync(outputPath, xml);
console.log(outputPath);
