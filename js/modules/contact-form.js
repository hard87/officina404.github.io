import {
    validateEmail,
    validateName,
    validateMessage,
    checkOffensiveWords,
    normalizeContactPayload,
    showFieldError,
    clearFieldError,
    clearFormFeedback,
    showSuccessMessage,
    showFormError
} from './form-validation.js';

const REQUEST_TIMEOUT_MS = 10000;
const DEFAULT_FALLBACK_EMAIL = 'contato@officina404.com.br';

function getContactFields(form) {
    return {
        name: form.querySelector('input[name="nome"]'),
        email: form.querySelector('input[name="email"]'),
        message: form.querySelector('textarea[name="mensagem"]'),
        company: form.querySelector('input[name="empresa"]'),
        submitButton: form.querySelector('button[type="submit"]')
    };
}

function setSubmittingState(form, submitButton, isSubmitting) {
    form.dataset.submitting = isSubmitting ? 'true' : 'false';
    form.classList.toggle('is-submitting', isSubmitting);
    form.setAttribute('aria-busy', String(isSubmitting));

    if (!submitButton) {
        return;
    }

    const defaultLabel = submitButton.dataset.submitText || submitButton.textContent || 'Enviar';

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? 'Preparando...' : defaultLabel;
}

function getSafeFallbackEmail(form) {
    const configuredEmail = (form.dataset.fallbackEmail || DEFAULT_FALLBACK_EMAIL).trim();
    const safeEmail = configuredEmail.replace(/[^\w.+@-]/g, '');

    return safeEmail || DEFAULT_FALLBACK_EMAIL;
}

function buildMailtoUrl(email, payload) {
    const subject = `Briefing técnico - ${payload.name}`;
    const body = [
        `Nome: ${payload.name}`,
        `Email: ${payload.email}`,
        '',
        'Desafio:',
        payload.message
    ].join('\n');

    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function dispatchContactPayload(form, payload) {
    const endpoint = (form.dataset.formEndpoint || '').trim();

    if (!endpoint) {
        window.location.href = buildMailtoUrl(getSafeFallbackEmail(form), payload);
        return {
            mode: 'mailto'
        };
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
            credentials: 'omit'
        });

        if (!response.ok) {
            throw new Error(`Erro no envio (${response.status})`);
        }

        return {
            mode: 'endpoint'
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

export function initContactForms() {
    const forms = document.querySelectorAll('.contato-form');

    forms.forEach(form => {
        const {
            name: nameField,
            email: emailField,
            message: messageField,
            company: companyField,
            submitButton
        } = getContactFields(form);

        if (!nameField || !emailField || !messageField || !submitButton) {
            return;
        }

        const userFields = [nameField, emailField, messageField];

        userFields.forEach(field => {
            field.addEventListener('input', () => clearFieldError(field));
        });

        form.addEventListener('submit', async event => {
            event.preventDefault();

            if (form.dataset.submitting === 'true') {
                return;
            }

            clearFormFeedback(form);
            userFields.forEach(field => clearFieldError(field));

            const payload = normalizeContactPayload({
                name: nameField.value,
                email: emailField.value,
                message: messageField.value,
                company: companyField?.value || ''
            });

            nameField.value = payload.name;
            emailField.value = payload.email;
            messageField.value = payload.message;

            if (payload.company) {
                showSuccessMessage(form, 'Recebido. Obrigado pelo contato.');
                form.reset();
                return;
            }

            const nameValidation = validateName(payload.name);
            if (!nameValidation.valid) {
                showFieldError(nameField, nameValidation.message);
                return;
            }

            const emailValidation = validateEmail(payload.email);
            if (!emailValidation.valid) {
                showFieldError(emailField, emailValidation.message);
                return;
            }

            const messageValidation = validateMessage(payload.message);
            if (!messageValidation.valid) {
                showFieldError(messageField, messageValidation.message);
                return;
            }

            const nameModeration = checkOffensiveWords(payload.name);
            if (!nameModeration.clean) {
                showFieldError(nameField, nameModeration.message);
                return;
            }

            const messageModeration = checkOffensiveWords(payload.message);
            if (!messageModeration.clean) {
                showFieldError(messageField, messageModeration.message);
                return;
            }

            setSubmittingState(form, submitButton, true);

            try {
                const result = await dispatchContactPayload(form, {
                    ...payload,
                    source: window.location.pathname,
                    submittedAt: new Date().toISOString()
                });

                const successMessage = result?.mode === 'mailto'
                    ? 'Briefing validado. Seu cliente de email foi preparado; se ele não abrir, envie para contato@officina404.com.br.'
                    : 'Obrigado! Retornaremos com um plano técnico objetivo.';

                showSuccessMessage(form, successMessage);
                form.reset();
            } catch (error) {
                showFormError(form, 'Falha ao enviar agora. Tente novamente em alguns instantes.');
            } finally {
                setSubmittingState(form, submitButton, false);
            }
        });
    });
}
