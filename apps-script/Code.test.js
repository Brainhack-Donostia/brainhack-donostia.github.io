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
  attendance: ['November 3 / 3 de noviembre', 'November 4 / 4 de noviembre'],
  privacy_consent: 'accepted'
}), api.registration);
assert.equal(registration.attendance, 'November 3 / 3 de noviembre | November 4 / 4 de noviembre');

assert.throws(() => api.collectAndValidate_(parameters({
  full_name: 'Test Person',
  email: 'test@example.org',
  attendance: 'Invalid day',
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

console.log('Apps Script validation tests passed');
