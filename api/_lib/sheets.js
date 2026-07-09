import { google } from "googleapis";

const ROW = (data) => [
  data.name,
  data.email,
  data.company,
  data.role,
  data.city,
  data.linkedin || "",
  data.shareBuzzmonitor ? "Sí" : "No",
];

export async function appendSignupRow(data) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTab = process.env.GOOGLE_SHEET_TAB || "Sheet1";

  if (!clientEmail || !rawKey || !sheetId) {
    console.log("[sheets] Variables de Google no configuradas; fila omitida");
    return;
  }

  // Normalizar la private key: convierte \n literales a saltos de linea reales
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetTab}!A:G`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [ROW(data)] },
  });
}
