import { EVENT } from "./event.js";

function escapeIcsText(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildEventIcs() {
  const now = formatTimestamp(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ListenUp!//Evento 5.0//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${EVENT.uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${EVENT.startUTC}`,
    `DTEND:${EVENT.endUTC}`,
    `SUMMARY:${escapeIcsText(EVENT.name)}`,
    `DESCRIPTION:${escapeIcsText(EVENT.topic)}`,
    `LOCATION:${escapeIcsText(EVENT.city)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}
