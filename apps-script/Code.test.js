const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(__dirname + '/Code.gs', 'utf8');
const context = {
  console,
  LockService: {
    getScriptLock() {
      return { waitLock() {}, releaseLock() {} };
    }
  }
};
vm.createContext(context);
vm.runInContext(source + `
  globalThis.testApi = {
    registration: FORM_DEFINITIONS.registration,
    project: FORM_DEFINITIONS.project,
    preregistration: FORM_DEFINITIONS.preregistration,
    collectAndValidate_,
    validateSubmissionId_,
    safeSheetValue_,
    appendOrFindSubmission_,
    setDestinationSheet: function (factory) { destinationSheet_ = factory; }
  };
`, context);

const api = context.testApi;

function parameters(values) {
  const result = {};
  Object.keys(values).forEach(key => {
    result[key] = Array.isArray(values[key]) ? values[key] : [values[key]];
  });
  return result;
}

const registration = api.collectAndValidate_(parameters({
  full_name: 'Test Person',
  email: 'test@example.org',
  interests: ['Neuroscience / Neurociencias', 'Open science / Ciencia abierta'],
  registration_fee: '10€ BCBL members then 20€ / 10€ miembros del BCBL después 20€',
  privacy_consent: 'accepted'
}), api.registration);
assert.equal(registration.interests, 'Neuroscience / Neurociencias | Open science / Ciencia abierta');

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Test Person',
  email: 'test@example.org',
  interests: 'Invalid interest',
  privacy_consent: 'accepted'
}), api.registration), /invalid option/i);

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Test Person',
  email: 'test@example.org',
  privacy_consent: 'accepted'
}), api.registration), /required field/i);

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Test Person',
  email: 'test@example.org',
  registration_fee: 'Not a real fee option',
  privacy_consent: 'accepted'
}), api.registration), /invalid option/i);

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Project Owner',
  email: 'owner@example.org',
  title: 'Project',
  description: 'Description',
  resources: 'Open data',
  privacy_consent: 'accepted'
}), api.project), /required field/i);

const project = api.collectAndValidate_(parameters({
  full_name: 'Project Owner',
  email: 'owner@example.org',
  institution: 'Test Institute',
  title: 'Project',
  description: 'Description',
  resources: 'Open data',
  privacy_consent: 'accepted',
  template_read: 'accepted',
  forms_read: 'accepted'
}), api.project);
assert.equal(project.template_read, 'accepted');
assert.equal(project.forms_read, 'accepted');

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Project Owner',
  email: 'owner@example.org',
  institution: 'Test Institute',
  title: 'Project',
  description: 'Description',
  resources: 'Open data',
  privacy_consent: 'accepted',
  forms_read: 'accepted'
}), api.project), /required field/i);

const preregistration = api.collectAndValidate_(parameters({
  full_name: 'Pre Person',
  email: 'pre@example.org',
  institution: 'BCBL',
  registration_fee: 'Others 20€ then 30€ / Otr@s 20€ después 30€',
  privacy_consent: 'accepted'
}), api.preregistration);
assert.equal(preregistration.institution, 'BCBL');

const preregOther = api.collectAndValidate_(parameters({
  full_name: 'Pre Person',
  email: 'pre@example.org',
  institution: 'Other / Otra',
  institution_other: 'Some Lab',
  registration_fee: 'Volunteers FREE / Voluntari@s GRATIS',
  privacy_consent: 'accepted'
}), api.preregistration);
assert.equal(preregOther.institution_other, 'Some Lab');

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Pre Person',
  email: 'pre@example.org',
  registration_fee: 'Volunteers FREE / Voluntari@s GRATIS',
  privacy_consent: 'accepted'
}), api.preregistration), /required field/i);

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Pre Person',
  email: 'pre@example.org',
  institution: 'Other / Otra',
  registration_fee: 'Volunteers FREE / Voluntari@s GRATIS',
  privacy_consent: 'accepted'
}), api.preregistration), /required field/i);

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Pre Person',
  email: 'pre@example.org',
  institution: 'Unknown institution',
  registration_fee: 'Volunteers FREE / Voluntari@s GRATIS',
  privacy_consent: 'accepted'
}), api.preregistration), /invalid option/i);

assert.equal(api.validateSubmissionId_('12345678-1234-1234-1234-123456789abc'), '12345678-1234-1234-1234-123456789abc');
assert.throws(() => api.validateSubmissionId_('short'), /submission ID/i);
assert.equal(api.safeSheetValue_('=IMPORTXML("example")'), "'=IMPORTXML(\"example\")");

const rows = [];
const fakeSheet = {
  getLastRow() { return rows.length; },
  appendRow(row) { rows.push(row); },
  setFrozenRows() {},
  getRange(row, column, rowCount, columnCount) {
    return {
      createTextFinder(value) {
        return {
          matchEntireCell() { return this; },
          findNext() {
            const index = rows.findIndex((item, rowIndex) => rowIndex > 0 && item[1] === value);
            return index < 0 ? null : { getRow: () => index + 1 };
          }
        };
      },
      getValues() {
        return rows.slice(row - 1, row - 1 + rowCount)
          .map(item => item.slice(column - 1, column - 1 + columnCount));
      }
    };
  }
};
api.setDestinationSheet(() => fakeSheet);
const submissionId = '12345678-1234-1234-1234-123456789abc';
const first = api.appendOrFindSubmission_(api.registration, registration, submissionId);
const second = api.appendOrFindSubmission_(api.registration, registration, submissionId);
assert.equal(rows.length, 2, 'duplicate submission must not append another row');
assert.equal(first.rowNumber, second.rowNumber);

assert.throws(
  () => api.appendOrFindSubmission_(api.registration, registration, '99999999-9999-9999-9999-999999999999'),
  /already used/i
);
assert.equal(rows.length, 2, 'duplicate email must not append another row');

console.log('Apps Script validation tests passed');
