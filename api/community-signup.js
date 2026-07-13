import { Resend } from "resend";
import {
  invitadoAttendeeHtml,
  invitadoTeamHtml,
  patrocinadorAttendeeHtml,
  patrocinadorTeamHtml,
} from "./_lib/community-email-templates.js";
import { appendSignupRow } from "./_lib/sheets.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/i;

const REQUIRED_FIELDS = ["name", "email", "company", "role", "city"];

function validate(body) {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!body[field] || !String(body[field]).trim()) {
      errors[field] = "required";
    }
  });

  if (body.email && !EMAIL_RE.test(String(body.email).trim())) {
    errors.email = "invalid_email";
  }

  if (body.linkedin && !URL_RE.test(String(body.linkedin).trim())) {
    errors.linkedin = "invalid_url";
  }

  if (!["invitado", "patrocinador"].includes(body.type)) {
    errors.type = "required";
  }

  return Object.keys(errors).length ? errors : null;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return req.body ? JSON.parse(req.body) : {};

  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (error) { reject(error); }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "invalid_json" });
  }

  if (body.empresaWeb) {
    return res.status(200).json({ ok: true });
  }

  const errors = validate(body);
  if (errors) {
    return res.status(400).json({ error: "validation_error", fields: errors });
  }

  const data = {
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    company: String(body.company).trim(),
    role: String(body.role).trim(),
    city: String(body.city).trim(),
    linkedin: body.linkedin ? String(body.linkedin).trim() : "",
    interest: body.interest ? String(body.interest).trim() : "",
    formType: body.type === "patrocinador" ? "patrocinador" : "modal",
    consent: Boolean(body.consent),
    type: body.type,
    sourcePage: body.sourcePage ? String(body.sourcePage).trim() : "",
    timestamp: new Date().toISOString(),
  };

  try {
    await appendSignupRow(data);
  } catch (err) {
    console.error("[community-signup] error escribiendo al sheet", err.message);
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[community-signup] RESEND_API_KEY no configurada; correo omitido", {
      timestamp: data.timestamp,
      type: data.type,
    });
    return res.status(200).json({ ok: true, emailSent: false });
  }

  const fromEmail = process.env.EVENT_FROM_EMAIL || "ListenUp! <hola@listenuplatam.com>";
  const notifyEmail = process.env.EVENT_NOTIFY_EMAIL || "fer@noisia.ai";
  const replyTo = process.env.EVENT_REPLY_TO || "hola@listenuplatam.com";

  const isPatrocinador = data.type === "patrocinador";

  const attendeeEmail = {
    from: fromEmail,
    to: data.email,
    reply_to: replyTo,
    subject: isPatrocinador
      ? "Gracias por tu interes en patrocinar ListenUp!"
      : "Bienvenido a la comunidad ListenUp!",
    html: isPatrocinador ? patrocinadorAttendeeHtml(data) : invitadoAttendeeHtml(data),
  };

  const teamEmail = {
    from: fromEmail,
    to: notifyEmail,
    reply_to: data.email,
    subject: isPatrocinador
      ? "Nuevo lead de patrocinio · ListenUp!"
      : "Nuevo miembro · ListenUp! comunidad",
    html: isPatrocinador ? patrocinadorTeamHtml(data) : invitadoTeamHtml(data),
  };

  const resend = new Resend(apiKey);

  try {
    const [attendeeResult, teamResult] = await Promise.all([
      resend.emails.send(attendeeEmail),
      resend.emails.send(teamEmail),
    ]);

    if (attendeeResult.error || teamResult.error) {
      throw new Error("resend_send_error");
    }

    return res.status(200).json({ ok: true, emailSent: true });
  } catch (error) {
    console.error("[community-signup] error enviando correo via Resend", {
      name: error.name,
      message: error.message,
      timestamp: data.timestamp,
      type: data.type,
    });
    return res.status(502).json({ error: "email_send_failed" });
  }
}
