const FORM_DEFINITIONS = Object.freeze({
  registration: {
    sheetProperty: 'REGISTRATION_SHEET_ID',
    page: 'registration.html',
    subject: 'BrainHack Donostia 2026 registration',
    fields: [
      'full_name', 'email', 'institution', 'position', 'interests',
      'previous_brainhack', 'programming', 'expectations', 'propose_project',
      'support', 'comments', 'privacy_consent', 'registration_fee'
    ],
    multipleFields: ['interests'],
    requiredFields: ['full_name', 'email', 'privacy_consent', 'registration_fee'],
    allowedValues: {
      position: [
        'Undergraduate student / Estudiante de grado',
        'Master’s student / Estudiante de máster',
        'PhD student / Estudiante de doctorado',
        'Postdoctoral researcher / Investigador/a posdoctoral',
        'Researcher or lecturer / Investigador/a o docente',
        'Research engineer or technical staff / Ingeniero/a o personal técnico',
        'Other / Otra'
      ],
      interests: [
        'Neuroscience / Neurociencias',
        'Psychology and cognitive science / Psicología y ciencias cognitivas',
        'Linguistics / Lingüística',
        'Data analysis and statistics / Análisis de datos y estadística',
        'Programming / Programación', 'Neuroimaging / Neuroimagen',
        'EEG and physiological signals / EEG y señales fisiológicas',
        'Eye-tracking / Seguimiento ocular',
        'Artificial intelligence / Inteligencia artificial',
        'Data visualisation / Visualización de datos',
        'Open science / Ciencia abierta', 'Other / Otra'
      ],
      previous_brainhack: ['Yes / Sí', 'No'],
      programming: [
        'No experience yet / Sin experiencia', 'Beginner / Principiante',
        'Intermediate / Intermedio', 'Advanced / Avanzado'
      ],
      propose_project: [
        'Yes / Sí', 'Maybe / Quizá',
        'I prefer to join a project / Prefiero unirme a un proyecto'
      ],
      privacy_consent: ['accepted'],
      registration_fee: [
        '10€ BCBL members then 20€ / 10€ miembros del BCBL después 20€',
        'Others 20€ then 30€ / Otr@s 20€ después 30€',
        'Volunteers FREE / Voluntari@s GRATIS'
      ]
    }
  },
  project: {
    sheetProperty: 'PROJECT_SHEET_ID',
    page: 'project-submission.html',
    subject: 'BrainHack Donostia 2026 project submission',
    fields: [
      'full_name', 'email', 'institution', 'contributors', 'title', 'description',
      'resources', 'skills', 'equipment', 'links', 'comments', 'privacy_consent',
      'template_read', 'forms_read'
    ],
    multipleFields: [],
    requiredFields: [
      'full_name', 'email', 'institution', 'title', 'description', 'resources',
      'privacy_consent', 'template_read', 'forms_read'
    ],
    allowedValues: {
      privacy_consent: ['accepted'],
      template_read: ['accepted'],
      forms_read: ['accepted']
    }
  },
  preregistration: {
    sheetProperty: 'PRE_REGISTRATION_SHEET_ID',
    sheetNameProperty: 'PRE_REGISTRATION_SHEET_NAME',
    page: 'pre-registration.html',
    subject: 'BrainHack Donostia 2026 pre-registration',
    fields: [
      'full_name', 'email', 'institution', 'institution_other',
      'registration_fee', 'privacy_consent'
    ],
    multipleFields: [],
    requiredFields: [
      'full_name', 'email', 'institution', 'registration_fee', 'privacy_consent'
    ],
    requiredIf: {
      institution_other: { field: 'institution', equals: 'Other / Otra' }
    },
    allowedValues: {
      institution: [
        'BCBL', 'UPV/EHU', 'Ikerbasque', 'DIPC', 'Biodonostia',
        'International / Internacional', 'Other / Otra'
      ],
      registration_fee: [
        '10€ BCBL members then 20€ / 10€ miembros del BCBL después 20€',
        'Others 20€ then 30€ / Otr@s 20€ después 30€',
        'Volunteers FREE / Voluntari@s GRATIS'
      ],
      privacy_consent: ['accepted']
    },
    confirmationBody: function (data, organizerEmail) {
      return 'Thank you, ' + data.full_name + '.\n\n' +
        'We have received your pre-registration for BrainHack Donostia 2026. ' +
        'We will email you as soon as official registration opens.\n\n' +
        'Gracias, ' + data.full_name + '.\n\n' +
        'Hemos recibido tu pre-inscripción para BrainHack Donostia 2026. ' +
        'Te avisaremos por correo en cuanto se abra la inscripción oficial.\n\n' +
        'Contact / Contacto: ' + organizerEmail;
    }
  }
});

const SYSTEM_COLUMNS = Object.freeze([
  'submitted_at_utc', 'submission_id', 'organizer_email_status',
  'confirmation_email_status'
]);

const MAX_FIELD_LENGTH = 10000;
const MIN_FORM_AGE_MS = 2000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const OPENING_NOTIFIED_COLUMN = 'opening_notified_at';

/**
 * Public Web App entry point. Deploy as the dedicated Gmail account and allow
 * anyone to execute it. Configuration belongs in Apps Script Properties.
 */
function doPost(event) {
  let formType = '';

  try {
    const parameters = event && event.parameters ? event.parameters : {};
    formType = firstValue_(parameters, 'form_type');
    const definition = FORM_DEFINITIONS[formType];

    if (!definition) {
      throw new Error('Unknown form type.');
    }

    // Do not reveal the honeypot result to automated senders.
    if (firstValue_(parameters, 'website')) {
      return successPage_(formType);
    }

    validateFormAge_(firstValue_(parameters, 'form_started_at'));
    validateRecaptcha_(
      firstValue_(parameters, 'recaptcha_token'),
      formType
    );

    const submissionId = validateSubmissionId_(firstValue_(parameters, 'submission_id'));
    const data = collectAndValidate_(parameters, definition);
    const storedRow = appendOrFindSubmission_(definition, data, submissionId);
    const emailStatuses = sendEmails_(definition, data, storedRow.emailStatuses);
    storedRow.sheet.getRange(storedRow.rowNumber, 3, 1, 2).setValues([[
      emailStatuses.organizer,
      emailStatuses.confirmation
    ]]);

    return successPage_(formType);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return errorPage_(formType, publicErrorCode_(error));
  }
}

/**
 * Run once from the Apps Script editor after setting Script Properties. It
 * creates the header row in each empty destination sheet.
 */
function setupSheets() {
  Object.keys(FORM_DEFINITIONS).forEach(function (formType) {
    const definition = FORM_DEFINITIONS[formType];
    const sheet = destinationSheet_(definition);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SYSTEM_COLUMNS.concat(definition.fields));
      sheet.setFrozenRows(1);
    }
  });
}

/**
 * Optional hourly time-driven trigger. Retries only the messages whose status
 * is not "sent", without duplicating messages that already succeeded.
 */
function retryPendingEmails() {
  Object.keys(FORM_DEFINITIONS).forEach(function (formType) {
    const definition = FORM_DEFINITIONS[formType];
    const sheet = destinationSheet_(definition);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return;

    const rows = sheet.getRange(2, 1, lastRow - 1, SYSTEM_COLUMNS.length + definition.fields.length)
      .getValues();

    rows.forEach(function (row, index) {
      const currentStatuses = { organizer: row[2], confirmation: row[3] };
      if (currentStatuses.organizer === 'sent' && currentStatuses.confirmation === 'sent') return;

      const data = {};
      definition.fields.forEach(function (field, fieldIndex) {
        data[field] = cleanText_(row[SYSTEM_COLUMNS.length + fieldIndex]);
      });
      const updated = sendEmails_(definition, data, currentStatuses);
      sheet.getRange(index + 2, 3, 1, 2).setValues([[
        updated.organizer,
        updated.confirmation
      ]]);
    });
  });
}

/**
 * Run manually when official registration opens. Sends the "registration is
 * now open" email to every pre-registrant (deduplicated) and records the
 * timestamp in the OPENING_NOTIFIED_COLUMN so re-runs do not resend.
 */
function notifyPreRegistrants() {
  const definition = FORM_DEFINITIONS.preregistration;
  const properties = PropertiesService.getScriptProperties();
  const siteUrl = requiredProperty_(properties, 'SITE_URL').replace(/\/$/, '');
  const organizerEmail = requiredProperty_(properties, 'ORGANIZER_EMAIL');
  const sheet = destinationSheet_(definition);

  if (sheet.getLastRow() < 2) return 0;

  const fieldColumnCount = SYSTEM_COLUMNS.length + definition.fields.length;
  const emailColumnIndex = SYSTEM_COLUMNS.length + definition.fields.indexOf('email') + 1;
  const registrationUrl = siteUrl + '/registration.html';

  const header = sheet.getRange(1, 1, 1, Math.max(fieldColumnCount, sheet.getLastColumn())).getValues()[0];
  let notifiedColumnIndex = header.indexOf(OPENING_NOTIFIED_COLUMN) + 1;
  if (notifiedColumnIndex === 0) {
    notifiedColumnIndex = fieldColumnCount + 1;
    sheet.getRange(1, notifiedColumnIndex).setValue(OPENING_NOTIFIED_COLUMN);
  }

  const lastRow = sheet.getLastRow();
  const emails = sheet.getRange(2, emailColumnIndex, lastRow - 1, 1).getValues();
  const notified = sheet.getRange(2, notifiedColumnIndex, lastRow - 1, 1).getValues();

  const seen = {};
  let sentCount = 0;

  for (let i = 0; i < emails.length; i++) {
    const email = cleanText_(emails[i][0]);
    if (!email || seen[email]) continue;
    seen[email] = true;
    if (cleanText_(notified[i][0])) continue;

    try {
      MailApp.sendEmail({
        to: email,
        replyTo: organizerEmail,
        name: 'BrainHack Donostia',
        subject: 'BrainHack Donostia 2026 — registration is now open / la inscripción ya está abierta',
        body: openingEmailBody_(registrationUrl, organizerEmail)
      });
      sheet.getRange(i + 2, notifiedColumnIndex).setValue(new Date().toISOString());
      sentCount++;
    } catch (error) {
      console.error(error);
    }
  }

  return sentCount;
}

function openingEmailBody_(registrationUrl, organizerEmail) {
  return 'Dear BrainHack Donostia community,\n\n' +
    'Official registration for BrainHack Donostia 2026 (November 3–6) is now open!\n' +
    'You pre-registered your interest, so we are writing to let you know first.\n\n' +
    'Register here: ' + registrationUrl + '\n\n' +
    'Querida comunidad de BrainHack Donostia,\n\n' +
    '¡La inscripción oficial de BrainHack Donostia 2026 (3–6 de noviembre) ya está abierta!\n' +
    'Te escribimos porque te pre-inscribiste, para avisarte antes que nadie.\n\n' +
    'Inscríbete aquí: ' + registrationUrl + '\n\n' +
    'Contact / Contacto: ' + organizerEmail;
}

function collectAndValidate_(parameters, definition) {
  const data = {};

  definition.fields.forEach(function (field) {
    const values = (parameters[field] || []).map(cleanText_).filter(Boolean);
    const allowedValues = definition.allowedValues[field];
    if (allowedValues && values.some(function (value) {
      return allowedValues.indexOf(value) < 0;
    })) {
      throw new Error('An invalid option was submitted.');
    }
    const value = definition.multipleFields.indexOf(field) >= 0
      ? values.join(' | ')
      : cleanText_(values[0] || '');

    if (value.length > MAX_FIELD_LENGTH) {
      throw new Error('A field is too long.');
    }

    data[field] = value;
  });

  definition.requiredFields.forEach(function (field) {
    if (!data[field]) {
      throw new Error('A required field is missing.');
    }
  });

  Object.keys(definition.requiredIf || {}).forEach(function (field) {
    const rule = definition.requiredIf[field];
    if (data[rule.field] === rule.equals && !data[field]) {
      throw new Error('A required field is missing.');
    }
  });

  if (data.privacy_consent !== 'accepted') {
    throw new Error('Privacy consent is missing.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('The email address is invalid.');
  }

  return data;
}

function validateSubmissionId_(submissionId) {
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(submissionId)) {
    throw new Error('Invalid submission ID.');
  }
  return submissionId;
}

function validateFormAge_(startedAt) {
  const timestamp = Number(startedAt);
  const age = Date.now() - timestamp;

  if (!Number.isFinite(timestamp) || age < MIN_FORM_AGE_MS || age > MAX_FORM_AGE_MS) {
    throw new Error('Invalid form age.');
  }
}

function validateRecaptcha_(token, expectedAction) {
  if (!token) {
    throw new Error('Missing reCAPTCHA token.');
  }

  const properties = PropertiesService.getScriptProperties();
  const secret = requiredProperty_(properties, 'RECAPTCHA_SECRET');
  const response = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true
  });
  const result = JSON.parse(response.getContentText());
  const minimumScore = Number(properties.getProperty('RECAPTCHA_MIN_SCORE') || '0.5');
  const allowedHostnames = requiredProperty_(properties, 'ALLOWED_HOSTNAMES')
    .split(',')
    .map(function (hostname) { return hostname.trim().toLowerCase(); })
    .filter(Boolean);

  if (!result.success) {
    throw new Error('reCAPTCHA service rejected the token.');
  }

  if (result.action !== expectedAction) {
    throw new Error('Unexpected reCAPTCHA action.');
  }

  if (Number(result.score) < minimumScore) {
    throw new Error('reCAPTCHA score is too low.');
  }

  if (!allowedHostnames.length || allowedHostnames.indexOf(String(result.hostname).toLowerCase()) < 0) {
    throw new Error('Unexpected reCAPTCHA hostname.');
  }
}

function appendOrFindSubmission_(definition, data, submissionId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = destinationSheet_(definition);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SYSTEM_COLUMNS.concat(definition.fields));
      sheet.setFrozenRows(1);
    }

    if (sheet.getLastRow() > 1) {
      const match = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1)
        .createTextFinder(submissionId)
        .matchEntireCell(true)
        .findNext();
      if (match) {
        const statuses = sheet.getRange(match.getRow(), 3, 1, 2).getValues()[0];
        return {
          sheet: sheet,
          rowNumber: match.getRow(),
          emailStatuses: { organizer: statuses[0], confirmation: statuses[1] }
        };
      }
    }

    const row = [
      new Date().toISOString(),
      submissionId,
      'pending',
      'pending'
    ].concat(definition.fields.map(function (field) {
      return safeSheetValue_(data[field]);
    }));

    sheet.appendRow(row);
    return {
      sheet: sheet,
      rowNumber: sheet.getLastRow(),
      emailStatuses: { organizer: 'pending', confirmation: 'pending' }
    };
  } finally {
    lock.releaseLock();
  }
}

function destinationSheet_(definition) {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = requiredProperty_(properties, definition.sheetProperty);
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  if (definition.sheetNameProperty) {
    const sheetName = requiredProperty_(properties, definition.sheetNameProperty);
    const existing = spreadsheet.getSheetByName(sheetName);
    // Insert at the end so the first sheet (used by the registration form via
    // getSheets()[0]) is never displaced.
    return existing || spreadsheet.insertSheet(sheetName, spreadsheet.getSheets().length);
  }
  return spreadsheet.getSheets()[0];
}

function sendEmails_(definition, data, currentStatuses) {
  const properties = PropertiesService.getScriptProperties();
  const organizerEmail = requiredProperty_(properties, 'ORGANIZER_EMAIL');
  const labelsAndValues = definition.fields
    .filter(function (field) { return field !== 'privacy_consent'; })
    .map(function (field) { return field + ': ' + (data[field] || '—'); })
    .join('\n\n');
  const statuses = {
    organizer: currentStatuses.organizer || 'pending',
    confirmation: currentStatuses.confirmation || 'pending'
  };

  if (statuses.organizer !== 'sent') {
    try {
      MailApp.sendEmail({
        to: organizerEmail,
        replyTo: data.email,
        name: 'BrainHack Donostia',
        subject: '[BHD 2026] New ' + definition.subject,
        body: 'A new submission was received.\n\n' + labelsAndValues
      });
      statuses.organizer = 'sent';
    } catch (error) {
      statuses.organizer = 'failed: ' + cleanText_(error.message || error).slice(0, 200);
      console.error(error);
    }
  }

  if (statuses.confirmation !== 'sent') {
    try {
      const confirmationBody = definition.confirmationBody
        ? definition.confirmationBody(data, organizerEmail)
        : 'Thank you, ' + data.full_name + '.\n\n' +
          'We have received your ' + definition.subject + '. The BrainHack Donostia team will contact you if needed.\n\n' +
          'Gracias, ' + data.full_name + '.\n\n' +
          'Hemos recibido tu envío. El equipo de BrainHack Donostia se pondrá en contacto contigo si fuera necesario.\n\n' +
          'Contact / Contacto: ' + organizerEmail;
      MailApp.sendEmail({
        to: data.email,
        replyTo: organizerEmail,
        name: 'BrainHack Donostia',
        subject: definition.subject + ' received / recibida',
        body: confirmationBody
      });
      statuses.confirmation = 'sent';
    } catch (error) {
      statuses.confirmation = 'failed: ' + cleanText_(error.message || error).slice(0, 200);
      console.error(error);
    }
  }

  return statuses;
}

function successPage_(formType) {
  const siteUrl = requiredProperty_(PropertiesService.getScriptProperties(), 'SITE_URL')
    .replace(/\/$/, '');
  const destination = siteUrl + '/thankyou.html?type=' + encodeURIComponent(formType);
  return redirectPage_(destination, 'Submission received / Envío recibido');
}

function errorPage_(formType, errorCode) {
  const properties = PropertiesService.getScriptProperties();
  const siteUrl = (properties.getProperty('SITE_URL') || 'https://brainhack-donostia.github.io')
    .replace(/\/$/, '');
  const definition = FORM_DEFINITIONS[formType];
  const retryUrl = definition ? siteUrl + '/' + definition.page : siteUrl + '/';

  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<base target="_top">' +
    '<title>Submission error</title></head><body>' +
    '<main><h1>We could not process the submission</h1>' +
    '<p>No hemos podido procesar el envío.</p>' +
    '<p>Reference / Referencia: <strong>' + escapeHtml_(errorCode) + '</strong></p>' +
    '<p><a href="' + escapeHtml_(retryUrl) + '">Try again / Volver a intentarlo</a></p>' +
    '</main></body></html>'
  );
}

function publicErrorCode_(error) {
  const message = cleanText_(error && error.message ? error.message : error);
  const mappings = [
    [/Missing Script Property/, 'CONFIGURATION'],
    [/Missing reCAPTCHA token/, 'RECAPTCHA_TOKEN'],
    [/service rejected/, 'RECAPTCHA_SERVICE'],
    [/Unexpected reCAPTCHA action/, 'RECAPTCHA_ACTION'],
    [/score is too low/, 'RECAPTCHA_SCORE'],
    [/Unexpected reCAPTCHA hostname/, 'RECAPTCHA_HOST'],
    [/Invalid form age/, 'FORM_AGE'],
    [/Invalid submission ID/, 'SUBMISSION_ID'],
    [/required field/, 'REQUIRED_FIELD'],
    [/invalid option/, 'INVALID_OPTION'],
    [/email address is invalid/, 'EMAIL'],
    [/Privacy consent/, 'PRIVACY'],
    [/Unknown form type/, 'FORM_TYPE']
  ];
  const match = mappings.find(function (mapping) { return mapping[0].test(message); });
  return match ? match[1] : 'SERVER_ERROR';
}

function redirectPage_(destination, title) {
  const safeDestination = escapeHtml_(destination);
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<base target="_top">' +
    '<meta http-equiv="refresh" content="0;url=' + safeDestination + '">' +
    '<title>' + escapeHtml_(title) + '</title></head><body>' +
    '<script>window.top.location.replace(' + JSON.stringify(destination) + ');</script>' +
    '<p><a href="' + safeDestination + '">Continue / Continuar</a></p>' +
    '</body></html>'
  );
}

function firstValue_(parameters, name) {
  const values = parameters[name] || [];
  return cleanText_(values[0] || '');
}

function cleanText_(value) {
  return String(value).trim();
}

// Prevent spreadsheet formula injection when opening exported data.
function safeSheetValue_(value) {
  const text = cleanText_(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function requiredProperty_(properties, name) {
  const value = properties.getProperty(name);
  if (!value) {
    throw new Error('Missing Script Property: ' + name);
  }
  return value;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
