import { google } from "googleapis";

const ROW = (data) => [
  data.name,
  data.email,
  data.company,
  data.role,
  data.city,
  data.formType || "",
  data.interest || "",
  data.linkedin || "",
  data.consent ? "Sí" : "No",
];

function getClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTab = process.env.GOOGLE_SHEET_TAB || "Sheet1";

  if (!clientEmail || !rawKey || !sheetId) return null;

  const privateKey = rawKey.replace(/\\n/g, "\n");
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, sheetId, sheetTab };
}

function normalize(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export async function appendSignupRow(data) {
  const client = getClient();
  if (!client) {
    console.log("[sheets] Variables de Google no configuradas; fila omitida");
    return;
  }
  const { sheets, sheetId, sheetTab } = client;

  // Determine next empty row by counting values in column A (row 1 = header)
  const colA = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetTab}!A:A`,
  });
  const nextRow = (colA.data.values || []).length + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${sheetTab}!A${nextRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [ROW(data)] },
  });
}

// Returns [{ rowIndex, name, email, company, checkedIn }] where rowIndex is 1-based sheet row
export async function searchEventAttendees(query) {
  const client = getClient();
  if (!client) return [];
  const { sheets, sheetId, sheetTab } = client;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetTab}!A:K`,
  });

  const rows = res.data.values || [];
  const normQuery = normalize(query);

  const results = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[0] || "";
    if (!name) continue;
    if (normQuery && !normalize(name).includes(normQuery)) continue;
    results.push({
      rowIndex: i + 1, // sheet rows are 1-indexed; row 1 = headers
      name,
      email: row[1] || "",
      company: row[2] || "",
      checkedIn: (row[9] || "") === "Sí",
    });
  }
  return results;
}

// Marks sheet row rowIndex (1-based) as checked in. Idempotent.
export async function checkInAttendee(rowIndex) {
  const client = getClient();
  if (!client) throw new Error("Google Sheets no configurado");
  const { sheets, sheetId, sheetTab } = client;

  const now = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: [
        { range: `${sheetTab}!J${rowIndex}`, values: [["Sí"]] },
        { range: `${sheetTab}!K${rowIndex}`, values: [[now]] },
      ],
    },
  });
}
