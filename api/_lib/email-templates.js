import { EVENT } from "./event.js";

const SITE_URL = "https://listenuplatam.com";
const EVENT_PAGE_URL = `${SITE_URL}/eventos/listenup-5-0/`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function attendeeEmailHtml(data) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f5f3ec; padding: 32px 0;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e3da;">
        <div style="background: #3432e6; color: #ffffff; padding: 24px 32px;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700;">Registro confirmado</p>
          <h1 style="margin: 8px 0 0; font-size: 28px;">${escapeHtml(EVENT.name)}</h1>
        </div>
        <div style="padding: 28px 32px;">
          <p style="margin: 0 0 16px; font-size: 16px; color: #1a1a2e;">Hola ${escapeHtml(data.name)},</p>
          <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #44445a;">
            Gracias por registrarte a <strong>${escapeHtml(EVENT.name)}</strong>: ${escapeHtml(EVENT.topic)}
          </p>
          <table style="width: 100%; margin: 0 0 20px; font-size: 14px; color: #44445a;">
            <tr>
              <td style="padding: 6px 0; font-weight: 700; width: 90px;">Fecha</td>
              <td style="padding: 6px 0;">${escapeHtml(EVENT.dateLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 700;">Lugar</td>
              <td style="padding: 6px 0;">${escapeHtml(EVENT.city)}</td>
            </tr>
          </table>
          <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #44445a;">
            Adjuntamos un archivo <strong>.ics</strong> para que agregues el evento a tu calendario (Save the Date).
          </p>
          <table role="presentation" style="margin: 0 0 24px;">
            <tr>
              <td style="border-radius: 999px; background: #ee5a6f;">
                <a href="${EVENT_PAGE_URL}" style="display: inline-block; padding: 14px 28px; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 999px;">
                  Ver detalles del evento
                </a>
              </td>
            </tr>
          </table>
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #e85d70; font-weight: 700;">
            Cupo limitado: tu confirmacion final queda sujeta a disponibilidad.
          </p>
        </div>
        <div style="padding: 16px 32px; background: #f5f3ec; font-size: 12px; color: #82829b;">
          ListenUp! · La comunidad de Social Intelligence mas grande de LATAM.
        </div>
      </div>
    </div>
  `;
}

export function teamEmailHtml(data) {
  const rows = [
    ["Nombre", data.name],
    ["Email", data.email],
    ["Empresa", data.company],
    ["Puesto / rol", data.role],
    ["Ciudad", data.city],
    ["LinkedIn", data.linkedin || "-"],
    ["Consentimiento", data.consent ? "Si" : "No"],
    ["Pagina origen", data.sourcePage || "-"],
    ["Fecha de registro", data.timestamp],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 6px 12px; font-weight: 700; border-bottom: 1px solid #e5e3da;">${escapeHtml(label)}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e3da;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; padding: 24px;">
      <h2 style="margin: 0 0 12px;">Nuevo registro: ${escapeHtml(EVENT.name)}</h2>
      <table style="border-collapse: collapse; font-size: 14px; width: 100%; max-width: 520px;">
        ${rowsHtml}
      </table>
    </div>
  `;
}
