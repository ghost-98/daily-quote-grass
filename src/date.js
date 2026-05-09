const KST_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

export function getKstDateString(date = new Date()) {
  return KST_FORMATTER.format(date);
}

export function splitDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return { year, month, day };
}
