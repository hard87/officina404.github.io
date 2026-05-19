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

const SIMULATED_SUBMIT_DELAY_MS = 900;
const REQUEST_TIMEOUT_MS = 10000;

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

    if (!submitButton) {
        return;
    }

    const defaultLabel = submitButton.dataset.submitText || submitButton.textContent || 'Enviar';

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? 'Enviando...' : defaultLabel;
}

async function dispatchContactPayload(form, payload) {
    const endpoint = (form.dataset.formEndpoint || '').trim();

    if (!endpoint) {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_SUBMIT_DELAY_MS));
        return;
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
                await dispatchContactPayload(form, {
                    ...payload,
                    source: window.location.pathname,
                    submittedAt: new Date().toISOString()
                });

                showSuccessMessage(form, 'Obrigado! Retornaremos com um plano tecnico objetivo.');
                form.reset();
            } catch (error) {
                showFormError(form, 'Falha ao enviar agora. Tente novamente em alguns instantes.');
            } finally {
                setSubmittingState(form, submitButton, false);
            }
        });
    });
}
