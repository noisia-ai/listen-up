const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDateLabel(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} de ${MONTHS_ES[month - 1]} de ${year}`;
}

// Supuesto: 10:00-15:00 hora CDMX (UTC-6) -> 16:00-21:00 UTC. Ajustar si la agenda cambia.
function buildUtcDateTime(isoDate, hourUTC) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const hh = String(hourUTC).padStart(2, "0");
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${hh}0000Z`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const EVENT_NAME = process.env.EVENT_NAME || "ListenUp! 5.0";
const EVENT_DATE = process.env.EVENT_DATE || "2026-08-13";
const EVENT_CITY = process.env.EVENT_CITY || "CDMX";
const EVENT_TOPIC = "Del insight a la acción: Cómo la IA está redefiniendo el Social Listening";

export const EVENT = {
  uid: `${slugify(EVENT_NAME)}@listenup.lat`,
  name: EVENT_NAME,
  topic: EVENT_TOPIC,
  city: EVENT_CITY,
  dateLabel: formatDateLabel(EVENT_DATE),
  timeLabel: "6:00 p.m. a 10:00 p.m.",
  venue: "Pata Negra Cuauhtémoc",
  address: "Río Niagara 43, Cuauhtémoc, CDMX",
  // 6pm–10pm CDMX (UTC-6) → 00:00–04:00 UTC del día siguiente
  startUTC: "20260814T000000Z",
  endUTC: "20260814T040000Z",
};
