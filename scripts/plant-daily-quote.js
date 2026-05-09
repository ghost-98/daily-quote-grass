import { fileURLToPath } from "node:url";

import { plantDailyQuote } from "../src/dailyQuote.js";

const result = await plantDailyQuote({
  rootDir: fileURLToPath(new URL("..", import.meta.url))
});

console.log(`오늘의 명언을 기록했습니다: ${result.dateString} (${result.quote.source})`);
