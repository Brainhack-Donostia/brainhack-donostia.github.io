# BrainHack Donostia forms — Apps Script deployment

This directory contains the shared receiver for `registration.html` and
`project-submission.html`. It writes to two separate Google spreadsheets,
verifies reCAPTCHA v3, and sends organizer and submitter emails.

## 1. Create the Google resources

Using the dedicated Gmail account:

1. Create one spreadsheet for registrations and one for project submissions.
2. Copy each spreadsheet ID from its URL.
3. Create a standalone Apps Script project at <https://script.google.com/>.
4. Copy `Code.gs` into the project and enable the manifest in **Project
   settings**, then copy `appsscript.json`.

## 2. Configure Script Properties

In **Project settings → Script properties**, add:

| Property | Value |
|---|---|
| `REGISTRATION_SHEET_ID` | ID of the registrations spreadsheet |
| `PROJECT_SHEET_ID` | ID of the projects spreadsheet |
| `ORGANIZER_EMAIL` | Address receiving organizer notifications |
| `RECAPTCHA_SECRET` | reCAPTCHA v3 secret key (never put it in this repository) |
| `RECAPTCHA_MIN_SCORE` | Start with `0.5`, then adjust from observed traffic |
| `ALLOWED_HOSTNAMES` | `brainhack-donostia.github.io,localhost` while testing; remove `localhost` for production |
| `SITE_URL` | `https://brainhack-donostia.github.io` |

Run `setupSheets()` once from the editor and authorize the requested scopes.
Check that the first sheet in both files now has a frozen header row.

Create an hourly time-driven trigger for `retryPendingEmails`. It retries only
the organizer or confirmation message whose status is not `sent`, so a partial
mail failure does not duplicate the message that already succeeded.

## 3. Deploy the Web App

1. **Deploy → New deployment → Web app**.
2. Execute as the dedicated Gmail account.
3. Grant access to **Anyone**.
4. Copy the `/exec` URL.

Do not use the `/dev` URL in production. Every code change requires creating a
new deployment version.

## 4. Configure the static site

Edit `js/form-config.js`:

- set `endpoint` to the `/exec` URL;
- set `recaptchaSiteKey` to the public reCAPTCHA v3 site key;
- keep both `registrationOpen` and `projectOpen` set to `false` while testing;
- set each flag to `true` only after its end-to-end test succeeds.

The reCAPTCHA v3 key must authorize `brainhack-donostia.github.io`. The secret
key remains only in Apps Script Properties.

## 5. Required checks before opening

- Valid registration writes one row to the registrations spreadsheet.
- Valid project submission writes one row to the projects spreadsheet.
- Organizer notification and submitter confirmation are both received.
- Honeypot, missing consent, invalid/expired token, and submissions under two
  seconds do not write data.
- Reposting the same `submission_id` does not create a second row.
- Confirmation redirects to `thankyou.html` with the correct `type`.
- The privacy text and 12-month retention period have been approved.

Local validation of the pure server-side rules and duplicate protection:

```bash
node apps-script/Code.test.js
```

## Quota warning

A consumer Gmail account typically has an Apps Script mail quota of about 100
recipients per day. Two messages are sent per accepted submission, so the
practical capacity is about 50 submissions per day. Monitor **Executions** and
`MailApp.getRemainingDailyQuota()` during registration peaks.
