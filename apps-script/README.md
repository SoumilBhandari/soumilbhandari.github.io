# Mailing the resume from the card

The card page has a "Send it to your inbox" box. A static page cannot send email,
so it posts to a small Google Apps Script that does. Free, no third-party account
beyond the Google one you already have, and every address lands in a spreadsheet.

**The section stays hidden until you configure it.** Nobody meets a broken form.

## Setup

1. Make a new Google Sheet. Copy its id out of the URL, the long string between
   `/d/` and `/edit`.
2. Go to [script.google.com](https://script.google.com), new project, paste in
   `mail-resume.gs`.
3. Project Settings, Script properties, add `SHEET_ID` set to that id.
4. Deploy, New deployment, type **Web app**. Execute as **Me**, access
   **Anyone**. Authorise it when prompted.
5. Copy the `/exec` URL it gives you.
6. In `index.html`, set:

```js
const RESUME_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
```

Push, and the section appears on the card.

Open the `/exec` URL in a browser first. It should return `{"ok":true,...}`. If it
asks you to sign in, the deployment access is still set to Me rather than Anyone.

## Why it posts as `text/plain`

Apps Script does not answer CORS preflight requests. Sending JSON with a
`text/plain` content type keeps it a "simple" request so the browser never sends a
preflight. The script parses the body as JSON regardless. Change that header to
`application/json` and every submission fails in the browser while working fine in
curl, which is a miserable thing to debug.

## The abuse question

This endpoint is public and sends mail from your account, so treat it as one:

- **The message is fixed in the script.** Nothing the caller sends reaches the
  subject, body or attachment, so it cannot be turned into a phishing relay. The
  worst case is a stranger receiving your resume.
- **40 sends a day**, under Gmail's consumer limit of 100, so a script kiddie
  cannot lock you out of your own email.
- **One send per address per 24 hours**, which stops someone mailbombing a person
  they dislike.

Raise `MAX_PER_DAY` if you genuinely hit it at a career fair. If the address is
ever abused hard, un-deploy the web app and the card falls back to the resume
button, which was always there.
