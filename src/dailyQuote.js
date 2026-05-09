import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { getKstDateString, splitDate } from "./date.js";
import { fetchTodayQuote } from "./quoteApi.js";
import { readJson, writeJson } from "./storage.js";

export function selectFallbackQuote(quotes, dateString) {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    throw new Error("fallback-quotes.json에는 하나 이상의 문구가 필요합니다.");
  }

  const dayNumber = Math.floor(Date.parse(`${dateString}T00:00:00.000Z`) / 86400000);
  return {
    ...quotes[dayNumber % quotes.length],
    source: "fallback",
    sourceUrl: null
  };
}

export async function getQuoteForToday({ rootDir, dateString, fetchImpl }) {
  try {
    return await fetchTodayQuote({ fetchImpl });
  } catch {
    const fallbackPath = path.join(rootDir, "data", "fallback-quotes.json");
    const fallbackQuotes = await readJson(fallbackPath, []);
    return selectFallbackQuote(fallbackQuotes, dateString);
  }
}

export function buildQuoteMarkdown({ dateString, quote }) {
  return [
    `# 오늘의 명언 - ${dateString}`,
    "",
    `> ${quote.text}`,
    "",
    `- 작성자: ${quote.author}`,
    `- 출처: ${quote.source}`,
    `- 기록 기준: Asia/Seoul`,
    ""
  ].join("\n");
}

export function updateReadmeStatus(readme, { dateString, quote, total }) {
  const start = "<!-- AUTO:QUOTE_STATUS:START -->";
  const end = "<!-- AUTO:QUOTE_STATUS:END -->";
  const nextBlock = [
    start,
    `- 마지막 기록일: ${dateString}`,
    `- 총 기록 수: ${total}`,
    `- 최근 명언: ${quote.text}`,
    end
  ].join("\n");

  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(readme)) {
    return `${readme.trimEnd()}\n\n${nextBlock}\n`;
  }

  return readme.replace(pattern, nextBlock);
}

export async function plantDailyQuote({ rootDir, now = new Date(), fetchImpl = fetch }) {
  const dateString = getKstDateString(now);
  const { year, month } = splitDate(dateString);
  const historyPath = path.join(rootDir, "data", "history.json");
  const latestPath = path.join(rootDir, "data", "latest.json");
  const readmePath = path.join(rootDir, "README.md");
  const quoteDir = path.join(rootDir, "quotes", year, month);
  const quotePath = path.join(quoteDir, `${dateString}.md`);
  const history = await readJson(historyPath, {});

  if (history[dateString]) {
    return {
      dateString,
      quote: history[dateString],
      quotePath,
      skipped: true
    };
  }

  const quote = await getQuoteForToday({ rootDir, dateString, fetchImpl });

  history[dateString] = {
    text: quote.text,
    author: quote.author,
    source: quote.source,
    sourceUrl: quote.sourceUrl,
    timezone: "Asia/Seoul"
  };

  const sortedHistory = Object.fromEntries(
    Object.entries(history).sort(([left], [right]) => left.localeCompare(right))
  );

  await mkdir(quoteDir, { recursive: true });
  await writeFile(quotePath, buildQuoteMarkdown({ dateString, quote }), "utf8");
  await writeJson(historyPath, sortedHistory);
  await writeJson(latestPath, { date: dateString, ...history[dateString] });

  const readme = await readFile(readmePath, "utf8");
  await writeFile(
    readmePath,
    updateReadmeStatus(readme, {
      dateString,
      quote,
      total: Object.keys(sortedHistory).length
    }),
    "utf8"
  );

  return {
    dateString,
    quote,
    quotePath,
    skipped: false
  };
}
