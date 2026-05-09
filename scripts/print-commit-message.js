import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const latestPath = path.join(rootDir, "data", "latest.json");
const latest = JSON.parse(await readFile(latestPath, "utf8"));

function normalizeSubject(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/["`]/g, "'")
    .trim();
}

function truncate(text, maxLength = 52) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}…`;
}

const quoteText = truncate(normalizeSubject(latest.text ?? "오늘의 명언"));
console.log(`chore(quote): "${quoteText}" 명언을 기록한다`);
