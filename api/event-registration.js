import { Resend } from "resend";
import { EVENT } from "./_lib/event.js";
import { buildEventIcs } from "./_lib/ics.js";
import { attendeeEmailHtml, teamEmailHtml } from "./_lib/email-templates.js";
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

  return Object.keys(errors).length ? errors : null;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }

  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
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
  } catch (error) {
    return res.status(400).json({ error: "invalid_json" });
  }

  // Honeypot anti-spam: si el campo oculto viene lleno, respondemos 200 sin procesar.
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
    formType: "registro",
    consent: Boolean(body.consent),
    sourcePage: body.sourcePage ? String(body.sourcePage).trim() : "",
    timestamp: new Date().toISOString(),
  };

  // Escribir al sheet (awaited para que no se corte en serverless; fallo no bloquea respuesta)
  try {
    await appendSignupRow(data);
  } catch (err) {
    console.error("[event-registration] error escribiendo al sheet", err.message);
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[event-registration] RESEND_API_KEY no configurada; correo omitido", {
      timestamp: data.timestamp,
      sourcePage: data.sourcePage || null,
    });
    return res.status(200).json({ ok: true, emailSent: false });
  }

  const fromEmail = process.env.EVENT_FROM_EMAIL || "ListenUp! <hola@listenuplatam.com>";
  const notifyEmail = process.env.EVENT_NOTIFY_EMAIL || "fer@noisia.ai";
  const replyTo = process.env.EVENT_REPLY_TO || "hola@listenuplatam.com";

  const icsContent = buildEventIcs();
  const icsAttachment = {
    filename: "listenup-5-0.ics",
    content: Buffer.from(icsContent, "utf-8").toString("base64"),
  };

  const resend = new Resend(apiKey);

  try {
    const [attendeeResult, teamResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: `Tu lugar para ${EVENT.name}`,
        html: attendeeEmailHtml(data),
        reply_to: replyTo,
        attachments: [icsAttachment],
      }),
      resend.emails.send({
        from: fromEmail,
        to: notifyEmail,
        subject: `Nuevo registro ${EVENT.name}`,
        html: teamEmailHtml(data),
        reply_to: data.email,
      }),
    ]);

    if (attendeeResult.error || teamResult.error) {
      throw new Error("resend_send_error");
    }

    return res.status(200).json({ ok: true, emailSent: true });
  } catch (error) {
    console.error("[event-registration] error enviando correo via Resend", {
      name: error.name,
      message: error.message,
      timestamp: data.timestamp,
    });
    return res.status(502).json({ error: "email_send_failed" });
  }
}
