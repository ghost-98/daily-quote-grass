const DEFAULT_API_URL = "https://zenquotes.io/api/today";

export class QuoteApiError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "QuoteApiError";
  }
}

export async function fetchTodayQuote({ apiUrl = DEFAULT_API_URL, fetchImpl = fetch } = {}) {
  const response = await fetchImpl(apiUrl, {
    headers: {
      accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new QuoteApiError(`ZenQuotes API 요청에 실패했습니다: ${response.status}`);
  }

  const payload = await response.json();
  const item = Array.isArray(payload) ? payload[0] : payload;

  if (!item?.q || !item?.a) {
    throw new QuoteApiError("ZenQuotes API 응답 형식이 올바르지 않습니다.");
  }

  return {
    text: item.q,
    author: item.a,
    source: "zenquotes",
    sourceUrl: "https://zenquotes.io/"
  };
}
