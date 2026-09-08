/**
 * Mails the resume to whoever asks for it on the card, and logs the address.
 *
 * Deploy: script.google.com -> new project -> paste this -> Deploy -> New
 * deployment -> Web app -> Execute as ME, Access ANYONE. Copy the /exec URL
 * into RESUME_ENDPOINT in index.html.
 *
 * The endpoint is public and it sends mail from your Google account, so the
 * message body is fixed here and never built from anything the caller sends.
 * That keeps the worst case at "a stranger receives my resume" rather than
 * "my account relays someone else's message". The caps below stop it burning
 * your daily Gmail quota.
 */

const RESUME_URL   = "https://soumilbhandari.github.io/resume.pdf";
const CARD_URL     = "https://soumilbhandari.github.io";
const FROM_NAME    = "Soumil Bhandari";
const ATTACH_AS    = "Soumil-Bhandari-Resume.pdf";

const MAX_PER_DAY  = 40;   // well under the consumer Gmail limit of 100
const REPEAT_HOURS = 24;   // ignore the same address again inside this window

function doPost(e) {
  try {
    const body  = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const email = String(body.email || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return reply({ ok: false, error: "invalid_email" });
    }
    if (sentRecently_(email)) {
      return reply({ ok: true, note: "already_sent" });   // looks like success to them
    }
    if (sentToday_() >= MAX_PER_DAY) {
      return reply({ ok: false, error: "daily_cap" });
    }

    const pdf = UrlFetchApp.fetch(RESUME_URL).getBlob().setName(ATTACH_AS);

    MailApp.sendEmail({
      to: email,
      name: FROM_NAME,
      subject: "Resume: " + FROM_NAME,
      body:
        "Thanks for scanning my card. My resume is attached.\n\n" +
        "Everything else is at " + CARD_URL + "\n\n" +
        FROM_NAME,
      htmlBody:
        '<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a">' +
        "<p>Thanks for scanning my card. My resume is attached.</p>" +
        '<p>Everything else is at <a href="' + CARD_URL + '">' + CARD_URL.replace(/^https:\/\//, "") + "</a>.</p>" +
        "<p>" + FROM_NAME + "</p></div>",
      attachments: [pdf],
    });

    log_(email, String(body.source || ""));
    return reply({ ok: true });

  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

/** Lets you confirm the deployment is live from a browser. */
function doGet() {
  return reply({ ok: true, service: "mail-resume" });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  const ss = SpreadsheetApp.openById(scriptProp_("SHEET_ID"));
  let sh = ss.getSheetByName("leads");
  if (!sh) {
    sh = ss.insertSheet("leads");
    sh.appendRow(["timestamp", "email", "source"]);
  }
  return sh;
}

function scriptProp_(key) {
  const v = PropertiesService.getScriptProperties().getProperty(key);
  if (!v) throw new Error("Set the script property " + key + " to your spreadsheet id");
  return v;
}

function log_(email, source) {
  sheet_().appendRow([new Date(), email, source]);
}

function sentRecently_(email) {
  const rows = sheet_().getDataRange().getValues();
  const cutoff = Date.now() - REPEAT_HOURS * 3600 * 1000;
  for (let i = rows.length - 1; i > 0; i--) {
    const when = new Date(rows[i][0]).getTime();
    if (when < cutoff) break;                       // rows are chronological
    if (String(rows[i][1]).toLowerCase() === email.toLowerCase()) return true;
  }
  return false;
}

function sentToday_() {
  const rows = sheet_().getDataRange().getValues();
  const cutoff = Date.now() - 24 * 3600 * 1000;
  let n = 0;
  for (let i = rows.length - 1; i > 0; i--) {
    if (new Date(rows[i][0]).getTime() < cutoff) break;
    n++;
  }
  return n;
}
