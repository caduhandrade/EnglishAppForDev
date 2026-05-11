import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { appDataset } from "../build/curriculum.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../data/developer-corporate-english.dataset.json");

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(appDataset, null, 2)}\n`, "utf8");

console.error(`Exported dataset to ${outputPath}`);

