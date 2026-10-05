(function () {
  'use strict';

  const form = document.querySelector('form[data-form-type]');
  if (!form) return;

  const config = window.BHD_FORM_CONFIG || {};
  const formType = form.dataset.formType;
  const submitButton = form.querySelector('button[type="submit"]');
  const templateDownload = form.querySelector('[data-template-download]');
  const templateHint = document.getElementById('template-hint');
  const availabilityNotice = document.getElementById('form-availability');
  const status = document.getElementById('form-status');
  const startedAt = form.querySelector('input[name="form_started_at"]');
  const submissionId = form.querySelector('input[name="submission_id"]');
  const tokenInput = form.querySelector('input[name="recaptcha_token"]');
  const isOpen = config[formType + 'Open'] === true;
  let recaptchaReady = false;
  let submitting = false;
  // The project form also requires downloading the Word template first.
  let templateDownloaded = !templateDownload;

  // A closed form redirects to the currently open registration form (if any),
  // so visitors never land on a disabled page. The redirect is guarded by the
  // target's flag, so two closed forms can never bounce to each other.
  const closedRedirects = {
    registration: { target: 'pre-registration.html', targetFlag: 'preregistrationOpen' },
    preregistration: { target: 'registration.html', targetFlag: 'registrationOpen' }
  };
  const redirectRule = closedRedirects[formType];
  if (!isOpen && redirectRule && config[redirectRule.targetFlag] === true) {
    window.location.replace(redirectRule.target);
    return;
  }

  if (startedAt) startedAt.value = String(Date.now());
  if (submissionId) submissionId.value = createSubmissionId();

  if (!isOpen || !validConfiguration(config)) return;

  if (templateDownload) {
    templateDownload.addEventListener('click', function () {
      templateDownloaded = true;
      refreshSubmitState();
    });
  }

  form.action = config.endpoint;
  loadRecaptcha(config.recaptchaSiteKey)
    .then(function () {
      recaptchaReady = true;
      refreshSubmitState();
      if (availabilityNotice) availabilityNotice.hidden = true;
    })
    .catch(function () {
      setStatus(
        'The form could not be initialized. Please try again later. / ' +
        'No se ha podido iniciar el formulario. Inténtalo más tarde.'
      );
    });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (submitting || !recaptchaReady || !form.reportValidity()) return;

    submitting = true;
    submitButton.disabled = true;
    setStatus('Sending… / Enviando…');

    try {
      grecaptcha.ready(function () {
        grecaptcha.execute(config.recaptchaSiteKey, { action: formType })
          .then(function (token) {
            tokenInput.value = token;
            form.submit();
          })
          .catch(resetAfterError);
      });
    } catch (error) {
      resetAfterError();
    }
  });

  function refreshSubmitState() {
    submitButton.disabled = !(recaptchaReady && templateDownloaded);
    if (templateHint) templateHint.hidden = templateDownloaded;
  }

  function resetAfterError() {
    submitting = false;
    refreshSubmitState();
    tokenInput.value = '';
    setStatus(
      'The security check failed. Please try again. / ' +
      'La comprobación de seguridad ha fallado. Inténtalo de nuevo.'
    );
  }

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function validConfiguration(runtimeConfig) {
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(runtimeConfig.endpoint || '') &&
      Boolean(runtimeConfig.recaptchaSiteKey);
  }

  function createSubmissionId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    const random = Math.random().toString(36).slice(2);
    return String(Date.now()) + '_' + random + '_' + Math.random().toString(36).slice(2);
  }

  function loadRecaptcha(siteKey) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(siteKey);
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
})();
