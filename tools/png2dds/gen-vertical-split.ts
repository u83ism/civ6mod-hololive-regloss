// Split a source image made of two vertically stacked panels (e.g. a background with and without a desk)
// at its vertical center into two lossless PNGs. Paths are relative to Art/Source/; the input is
// read-only and never modified. For an odd image height the single middle row is dropped so both
// halves have the same size (see vertical-split-compositing.ts).
// Usage: tsx gen-vertical-split.ts <inputFileName> <upperOutputFileName> <lowerOutputFileName>
// Example: tsx gen-vertical-split.ts juufuutei-raden/background-1.jpg juufuutei-raden/background-1-no-desk.png juufuutei-raden/background-1-desk.png
import { join } from "node:path";
import sharp from "sharp";
import { computeVerticalHalves } from "./vertical-split-compositing.js";

const [, , inputFileName, upperOutputFileName, lowerOutputFileName] = process.argv;
if (!inputFileName || !upperOutputFileName || !lowerOutputFileName) {
  console.error("Usage: tsx gen-vertical-split.ts <inputFileName> <upperOutputFileName> <lowerOutputFileName>");
  process.exit(1);
}

const sourceDirectory = join(import.meta.dirname, "..", "..", "Art", "Source");
const inputPath = join(sourceDirectory, inputFileName);

const { width, height } = await sharp(inputPath).metadata();
if (!width || !height) throw new Error(`${inputFileName}: could not read the image size`);
const { upper, lower } = computeVerticalHalves(height);

const writeHalf = async (rows: { readonly top: number; readonly height: number }, outputFileName: string): Promise<void> => {
  const outputPath = join(sourceDirectory, outputFileName);
  await sharp(inputPath)
    .extract({ left: 0, top: rows.top, width, height: rows.height })
    .png()
    .toFile(outputPath);
  console.log(`${outputPath}: ${width}x${rows.height} (source rows ${rows.top}-${rows.top + rows.height - 1})`);
};

await writeHalf(upper, upperOutputFileName);
await writeHalf(lower, lowerOutputFileName);
