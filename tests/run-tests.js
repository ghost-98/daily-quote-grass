import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { getKstDateString } from "../src/date.js";
import { plantDailyQuote, selectFallbackQuote } from "../src/dailyQuote.js";
import { fetchTodayQuote } from "../src/quoteApi.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("KST 기준 날짜 문자열을 계산한다", () => {
  assert.equal(getKstDateString(new Date("2026-05-08T15:10:00.000Z")), "2026-05-09");
});

test("ZenQuotes 응답을 내부 명언 형식으로 변환한다", async () => {
  const quote = await fetchTodayQuote({
    fetchImpl: async () => ({
      ok: true,
      json: async () => [{ q: "Stay steady.", a: "Tester" }]
    })
  });

  assert.deepEqual(quote, {
    text: "Stay steady.",
    author: "Tester",
    source: "zenquotes",
    sourceUrl: "https://zenquotes.io/"
  });
});

test("API 실패 시 fallback 문구를 날짜 기반으로 선택한다", () => {
  const quote = selectFallbackQuote([{ text: "A", author: "tester" }], "2026-05-09");
  assert.equal(quote.source, "fallback");
});

test("오늘의 명언 파일과 이력을 생성한다", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "daily-quote-"));

  await mkdir(path.join(rootDir, "data"), { recursive: true });
  await writeFile(path.join(rootDir, "data", "fallback-quotes.json"), JSON.stringify([{ text: "대체 문구", author: "tester" }]), "utf8");
  await writeFile(path.join(rootDir, "data", "history.json"), "{}\n", "utf8");
  await writeFile(path.join(rootDir, "data", "latest.json"), "{}\n", "utf8");
  await writeFile(
    path.join(rootDir, "README.md"),
    [
      "# Test",
      "",
      "<!-- AUTO:QUOTE_STATUS:START -->",
      "- 마지막 기록일: 아직 없음",
      "<!-- AUTO:QUOTE_STATUS:END -->",
      ""
    ].join("\n"),
    "utf8"
  );

  await plantDailyQuote({
    rootDir,
    now: new Date("2026-05-08T15:10:00.000Z"),
    fetchImpl: async () => ({
      ok: true,
      json: async () => [{ q: "테스트 명언", a: "tester" }]
    })
  });

  const quoteFile = await readFile(path.join(rootDir, "quotes", "2026", "05", "2026-05-09.md"), "utf8");
  const history = JSON.parse(await readFile(path.join(rootDir, "data", "history.json"), "utf8"));

  assert.match(quoteFile, /테스트 명언/);
  assert.equal(history["2026-05-09"].source, "zenquotes");
});

for (const { name, fn } of tests) {
  await fn();
  console.log(`ok - ${name}`);
}
