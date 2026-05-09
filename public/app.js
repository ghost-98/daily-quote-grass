async function readJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`${path} 파일을 불러오지 못했습니다.`);
  }

  return response.json();
}

function renderHistory(history) {
  return Object.entries(history)
    .sort(([left], [right]) => right.localeCompare(left))
    .slice(0, 14)
    .map(([date, item]) => `
      <li>
        <time datetime="${date}">${date}</time>
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

document.querySelector("#quoteText").textContent = latest.text;
document.querySelector("#quoteMeta").textContent = `${latest.author} · ${latest.date ?? "기록 대기 중"}`;
document.querySelector("#totalCount").textContent = entries.length.toString();
document.querySelector("#latestDate").textContent = latest.date ?? "-";
document.querySelector("#sourceName").textContent = latest.source ?? "-";
document.querySelector("#historyList").innerHTML = renderHistory(history);
