const SITE_URL = "https://listenuplatam.com";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function baseShell({ headerBg = "#3432e6", eyebrow, title, body, footer }) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f5f3ec; padding: 32px 0;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e3da;">
        <div style="background: ${headerBg}; color: #ffffff; padding: 24px 32px;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700;">${eyebrow}</p>
          <h1 style="margin: 8px 0 0; font-size: 26px; line-height: 1.2;">${title}</h1>
        </div>
        <div style="padding: 28px 32px;">
          ${body}
        </div>
        <div style="padding: 16px 32px; background: #f5f3ec; font-size: 12px; color: #82829b;">
          ${footer}
        </div>
      </div>
    </div>
  `;
}

function ctaButton(href, label) {
  return `
    <table role="presentation" style="margin: 24px 0;">
      <tr>
        <td style="border-radius: 999px; background: #ee5a6f;">
          <a href="${href}" style="display: inline-block; padding: 14px 28px; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 999px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function teamRows(data, extra = []) {
  const rows = [
    ["Nombre", data.name],
    ["Email", data.email],
    ["Empresa", data.company],
    ["Puesto / rol", data.role],
    ["Ciudad", data.city],
    ["LinkedIn", data.linkedin || "-"],
    ...extra,
    ["Consentimiento", data.consent ? "Si" : "No"],
    ["Pagina origen", data.sourcePage || "-"],
    ["Fecha de registro", data.timestamp],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 6px 12px; font-weight: 700; border-bottom: 1px solid #e5e3da; width: 140px;">${escapeHtml(label)}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e3da;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  return `<table style="border-collapse: collapse; font-size: 14px; width: 100%; max-width: 520px;">${rowsHtml}</table>`;
}

// ── INVITADO ──────────────────────────────────────────────────────────────────

export function invitadoAttendeeHtml(data) {
  const body = `
    <p style="margin: 0 0 16px; font-size: 16px; color: #1a1a2e;">Hola ${escapeHtml(data.name)},</p>
    <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #44445a;">
      Ya formas parte de la comunidad de Social Intelligence mas grande de LATAM. Independiente, senior y marca-agnostica.
    </p>
    <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #44445a;">
      A partir de ahora recibiras:
    </p>
    <ul style="margin: 0 0 20px; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #44445a;">
      <li>Invitaciones a eventos presenciales gratuitos en CDMX y otras ciudades LATAM</li>
      <li>Contenido sobre social listening, social intelligence y tendencias de la region</li>
      <li>Acceso a la red de lideres de marketing, research e insights de LATAM</li>
    </ul>
    <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #44445a;">
      Nuestro proximo evento es <strong>ListenUp! 5.0</strong> el <strong>13 de agosto de 2026 en CDMX</strong>: Del insight a la acción: Cómo la IA está redefiniendo el Social Listening.
    </p>
    ${ctaButton(`${SITE_URL}/eventos/listenup-5-0/`, "Ver ListenUp! 5.0")}
    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #82829b;">
      ¿Tienes preguntas? Responde este correo o escribenos a <a href="mailto:hola@listenuplatam.com" style="color: #3432e6;">hola@listenuplatam.com</a>
    </p>
  `;

  return baseShell({
    eyebrow: "Bienvenido a ListenUp!",
    title: "Ya eres parte de la comunidad.",
    body,
    footer: "ListenUp! · La comunidad de Social Intelligence mas grande de LATAM.",
  });
}

export function invitadoTeamHtml(data) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 24px;">
      <h2 style="margin: 0 0 6px; font-size: 18px;">Nuevo miembro · ListenUp! comunidad</h2>
      <p style="margin: 0 0 16px; font-size: 13px; color: #82829b;">Tipo: Invitado</p>
      ${teamRows(data)}
    </div>
  `;
}

// ── PATROCINADOR ──────────────────────────────────────────────────────────────

export function patrocinadorAttendeeHtml(data) {
  const body = `
    <p style="margin: 0 0 16px; font-size: 16px; color: #1a1a2e;">Hola ${escapeHtml(data.name)},</p>
    <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #44445a;">
      Gracias por tu interes en patrocinar ListenUp!. Hemos recibido tus datos y un miembro del equipo se pondra en contacto contigo en los proximos dias.
    </p>
    <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #44445a;">
      Como patrocinador de ListenUp! tendras acceso a:
    </p>
    <ul style="margin: 0 0 20px; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #44445a;">
      <li>Posicion de speaker con hasta tres invitados de tu equipo</li>
      <li>Presencia en materiales del evento vistos por los asistentes</li>
      <li>Overview del perfil de la audiencia asistente</li>
      <li>Marketing antes, durante y despues del evento</li>
      <li>Activaciones a medida para tu marca</li>
    </ul>
    <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #44445a;">
      Mientras tanto, puedes conocer mas sobre los beneficios de patrocinar ListenUp! en nuestra web.
    </p>
    ${ctaButton(`${SITE_URL}/#patrocinios`, "Ver beneficios de patrocinio")}
    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #82829b;">
      ¿Tienes preguntas urgentes? Escríbenos a <a href="mailto:hola@listenuplatam.com" style="color: #3432e6;">hola@listenuplatam.com</a>
    </p>
  `;

  return baseShell({
    headerBg: "#1c1ab7",
    eyebrow: "Patrocinios ListenUp!",
    title: "Recibimos tu solicitud de patrocinio.",
    body,
    footer: "ListenUp! · La comunidad de Social Intelligence mas grande de LATAM.",
  });
}

export function patrocinadorTeamHtml(data) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 24px;">
      <h2 style="margin: 0 0 6px; font-size: 18px;">Nuevo lead de patrocinio · ListenUp!</h2>
      <p style="margin: 0 0 16px; font-size: 13px; color: #82829b;">Tipo: Patrocinador</p>
      ${teamRows(data, [["Interes / herramienta", data.interest || "-"]])}
    </div>
  `;
}
