async function readJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`${path} 파일을 불러오지 못했습니다.`);
  }

  return response.json();
}

function formatSource(source) {
  if (source === "zenquotes") {
    return "ZenQuotes";
  }

  if (source === "fallback") {
    return "Local fallback";
  }

  return source ?? "-";
}

function renderHistory(history) {
  const entries = Object.entries(history).sort(([left], [right]) => right.localeCompare(left));

  if (entries.length === 0) {
    return `<li class="empty">아직 기록된 명언이 없습니다.</li>`;
  }

  return entries
    .slice(0, 14)
    .map(([date, item]) => `
      <li>
        <div>
          <time datetime="${date}">${date}</time>
          <span>${formatSource(item.source)}</span>
        </div>
        <p>${item.text}</p>
        <small>${item.author}</small>
      </li>
    `)
    .join("");
}

const [latest, history] = await Promise.all([
  readJson("../data/latest.json"),
  readJson("../data/history.json")
]);

const entries = Object.keys(history);
const source = formatSource(latest.source);

if ((latest.text ?? "").length > 92) {
  document.body.classList.add("long-quote");
}

document.querySelector("#quoteText").textContent = latest.text;
document.querySelector("#quoteMeta").textContent = `${latest.author} · ${latest.date ?? "기록 대기 중"}`;
document.querySelector("#todayDate").textContent = latest.date ?? "-";
document.querySelector("#todaySource").textContent = source;
document.querySelector("#totalCount").textContent = entries.length.toString();
document.querySelector("#latestDate").textContent = latest.date ?? "-";
document.querySelector("#sourceName").textContent = source;
document.querySelector("#historyList").innerHTML = renderHistory(history);
