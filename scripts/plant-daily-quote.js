import { fileURLToPath } from "node:url";

import { plantDailyQuote } from "../src/dailyQuote.js";

const result = await plantDailyQuote({
  rootDir: fileURLToPath(new URL("..", import.meta.url))
});

if (result.skipped) {
  console.log(`Daily quote already exists for ${result.dateString}; skipping.`);
} else {
  console.log(`Daily quote planted for ${result.dateString} (${result.quote.source}).`);
}
