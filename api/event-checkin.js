import { searchEventAttendees, checkInAttendee } from "./_lib/sheets.js";

function json(res, status, body) {
  res.status(status).json(body);
}

function validateToken(req) {
  const secret = process.env.CHECKIN_ACCESS_TOKEN;
  if (!secret) return false;
  const token =
    req.headers["x-checkin-token"] ||
    req.query.token ||
    (req.body && req.body.token);
  return token === secret;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!validateToken(req)) {
    return json(res, 401, { error: "No autorizado" });
  }

  if (req.method === "GET") {
    const q = (req.query.q || "").trim();
    try {
      const results = await searchEventAttendees(q);
      return json(res, 200, { results });
    } catch (err) {
      console.error("[event-checkin] search error", err);
      return json(res, 500, { error: "Error al buscar en el sheet" });
    }
  }

  if (req.method === "POST") {
    const rowIndex = Number(req.body && req.body.rowIndex);
    if (!rowIndex || rowIndex < 2) {
      return json(res, 400, { error: "rowIndex inválido" });
    }
    try {
      await checkInAttendee(rowIndex);
      return json(res, 200, { ok: true });
    } catch (err) {
      console.error("[event-checkin] check-in error", err);
      return json(res, 500, { error: "Error al registrar check-in" });
    }
  }

  return json(res, 405, { error: "Método no permitido" });
}
