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
              <td style="padding: 6px 0; font-weight: 700;">Hora</td>
              <td style="padding: 6px 0;">${escapeHtml(EVENT.timeLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 700;">Lugar</td>
              <td style="padding: 6px 0;">${escapeHtml(EVENT.venue)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 700;">Direccion</td>
              <td style="padding: 6px 0;">${escapeHtml(EVENT.address)}</td>
            </tr>
          </table>
          <table role="presentation" style="margin: 0 0 24px;">
            <tr>
              <td style="padding-right: 8px;">
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=ListenUp!+5.0&dates=20260814T000000Z%2F20260814T040000Z&details=Del+insight+a+la+acci%C3%B3n%3A+C%C3%B3mo+la+IA+est%C3%A1+redefiniendo+el+Social+Listening&location=Pata+Negra+Cuauht%C3%A9moc%2C+R%C3%ADo+Niagara+43%2C+Cuauht%C3%A9moc%2C+CDMX" style="display: inline-block; padding: 14px 28px; border-radius: 999px; background: #ee5a6f; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none;">
                  Agregar a Google Calendar
                </a>
              </td>
              <td>
                <a href="${EVENT_PAGE_URL}" style="display: inline-block; padding: 14px 28px; border-radius: 999px; border: 1px solid #e5e3da; color: #44445a; font-size: 14px; font-weight: 700; text-decoration: none;">
                  Ver detalles
                </a>
              </td>
            </tr>
          </table>
          <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.6; color: #e85d70; font-weight: 700;">
            Cupo limitado: tu confirmacion final queda sujeta a disponibilidad.
          </p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #44445a;">Conectate con la comunidad:</p>
          <table role="presentation" style="margin: 0;">
            <tr>
              <td style="padding-right: 8px;">
                <a href="https://chat.whatsapp.com/Krm8UmYEYc36997hAJygyh?mode=gi_t" style="display: inline-block; padding: 10px 20px; border-radius: 999px; border: 1px solid #e5e3da; font-size: 13px; font-weight: 700; color: #1a1a2e; text-decoration: none;">WhatsApp</a>
              </td>
              <td style="padding-right: 8px;">
                <a href="https://www.instagram.com/listenupmeetup/" style="display: inline-block; padding: 10px 20px; border-radius: 999px; border: 1px solid #e5e3da; font-size: 13px; font-weight: 700; color: #1a1a2e; text-decoration: none;">Instagram</a>
              </td>
              <td>
                <a href="https://www.linkedin.com/company/listenup-socialintelligence-meetup/" style="display: inline-block; padding: 10px 20px; border-radius: 999px; border: 1px solid #e5e3da; font-size: 13px; font-weight: 700; color: #1a1a2e; text-decoration: none;">LinkedIn</a>
              </td>
            </tr>
          </table>
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
