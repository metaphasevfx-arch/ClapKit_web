# Google Sheets Storage For Survey

Use Google Apps Script as a lightweight webhook that writes survey responses into a Google Sheet.

## 1. Create spreadsheet

1. Create a new Google Spreadsheet.
2. Open **Extensions -> Apps Script**.
3. Replace default code with the script below.

## 2. Apps Script code

```javascript
const SHEET_NAME = "SurveyResponses";
const WEBHOOK_TOKEN = "CHANGE_ME_TO_LONG_RANDOM_TOKEN";

const HEADER = [
  "received_at",
  "response_id",
  "submitted_at",
  "locale",
  "department",
  "source",
  "role_in_cinema",
  "apps_on_phone",
  "work_sequence_on_set",
  "phone_tasks",
  "data_storage_places",
  "time_consuming_actions",
  "info_loss_or_handoff_errors",
  "hard_to_find_data",
  "automation_wishes",
  "open_ideas",
  "answers_json"
];

function doPost(e) {
  try {
    const token = (e && e.parameter && e.parameter.token) ? String(e.parameter.token) : "";
    if (WEBHOOK_TOKEN && token !== WEBHOOK_TOKEN) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }

    const payload = parsePayload_(e);
    const answers = payload.answers || {};
    const sheet = getSheet_();
    ensureHeader_(sheet);

    sheet.appendRow([
      new Date(),
      payload.responseId || "",
      payload.submittedAt || "",
      payload.locale || "",
      payload.department || "",
      payload.source || "",
      answers.role_in_cinema || "",
      answers.apps_on_phone || "",
      answers.work_sequence_on_set || "",
      answers.phone_tasks || "",
      answers.data_storage_places || "",
      answers.time_consuming_actions || "",
      answers.info_loss_or_handoff_errors || "",
      answers.hard_to_find_data || "",
      answers.automation_wishes || "",
      answers.open_ideas || "",
      JSON.stringify(payload.answers || {})
    ]);

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) });
  }
}

function parsePayload_(e) {
  const raw = (e && e.postData && e.postData.contents) ? String(e.postData.contents) : "{}";
  return JSON.parse(raw);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(HEADER);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy web app

1. Click **Deploy -> New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Deploy and copy URL like:
   `https://script.google.com/macros/s/XXXXXXXXXXXX/exec`

## 4. Put URL into ClapKit config

Edit `survey-config.js`:

```js
window.CK_SURVEY_CONFIG = {
  mode: "webhook",
  webhookUrl: "https://script.google.com/macros/s/XXXXXXXXXXXX/exec",
  webhookNoCors: true,
  webhookToken: "THE_SAME_TOKEN_AS_IN_APPS_SCRIPT"
};
```

## 5. Verify

1. Submit one test response on `/survey/`.
2. Open sheet `SurveyResponses`.
3. Ensure a new row appears with answers.
