/**
 * Module: Form Validation
 * Input sanitization, anti-abuse checks and accessible feedback helpers.
 */

const OFFENSIVE_WORDS = [
    'porra', 'caralho', 'puta', 'merda', 'fdp', 'desgraca', 'cacete',
    'buceta', 'cu', 'viado', 'bicha', 'arrombado', 'corno', 'vagabundo',
    'idiota', 'imbecil', 'burro', 'estupido', 'retardado', 'lixo',
    'viagra', 'casino', 'poker', 'bitcoin', 'crypto', 'forex'
];

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const DISPOSABLE_EMAIL_DOMAINS = [
    'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc'
];

const NON_PRINTABLE_REGEX = /[\u0000-\u001F\u007F]/g;
const HTML_TAG_REGEX = /<[^>]*>/g;

function normalizeForModeration(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function updateAriaDescribedBy(field, errorIdToRemove) {
    const describedBy = (field.getAttribute('aria-describedby') || '')
        .split(' ')
        .map(token => token.trim())
        .filter(Boolean)
        .filter(token => token !== errorIdToRemove);

    if (describedBy.length > 0) {
        field.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
        field.removeAttribute('aria-describedby');
    }
}

export function sanitizeInput(value, options = {}) {
    const {
        maxLength = 1000,
        allowLineBreaks = true
    } = options;

    if (typeof value !== 'string') {
        return '';
    }

    let sanitized = value
        .normalize('NFKC')
        .replace(NON_PRINTABLE_REGEX, '');

    if (allowLineBreaks) {
        sanitized = sanitized
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n{3,}/g, '\n\n');
    } else {
        sanitized = sanitized.replace(/[\r\n]+/g, ' ');
    }

    sanitized = sanitized
        .replace(HTML_TAG_REGEX, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

    if (maxLength > 0 && sanitized.length > maxLength) {
        return sanitized.slice(0, maxLength);
    }

    return sanitized;
}

export function sanitizeEmail(email) {
    return sanitizeInput(email, { maxLength: 254, allowLineBreaks: false }).toLowerCase();
}

export function normalizeContactPayload(rawData) {
    return {
        name: sanitizeInput(rawData?.name || '', { maxLength: 100, allowLineBreaks: false }),
        email: sanitizeEmail(rawData?.email || ''),
        message: sanitizeInput(rawData?.message || '', { maxLength: 1000, allowLineBreaks: true }),
        company: sanitizeInput(rawData?.company || '', { maxLength: 100, allowLineBreaks: false })
    };
}

export function validateEmail(email) {
    const trimmedEmail = sanitizeEmail(email);

    if (!trimmedEmail) {
        return {
            valid: false,
            message: 'Por favor, informe seu email.'
        };
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
        return {
            valid: false,
            message: 'Por favor, informe um email válido.'
        };
    }

    if (trimmedEmail.length > 254) {
        return {
            valid: false,
            message: 'Email muito longo. Máximo de 254 caracteres.'
        };
    }

    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) {
        return {
            valid: false,
            message: 'Formato de email inválido.'
        };
    }

    const [localPart, domain] = parts;

    if (localPart.length === 0 || localPart.length > 64) {
        return {
            valid: false,
            message: 'Email inválido.'
        };
    }

    const isDisposable = DISPOSABLE_EMAIL_DOMAINS.some(disposableDomain => domain.endsWith(disposableDomain));
    if (isDisposable) {
        return {
            valid: false,
            message: 'Por favor, use um email permanente.'
        };
    }

    return {
        valid: true,
        message: ''
    };
}

export function validateName(name) {
    const trimmedName = sanitizeInput(name, { maxLength: 100, allowLineBreaks: false });

    if (!trimmedName) {
        return {
            valid: false,
            message: 'Por favor, informe seu nome.'
        };
    }

    if (trimmedName.length < 2) {
        return {
            valid: false,
            message: 'Nome deve ter pelo menos 2 caracteres.'
        };
    }

    const nameRegex = /^[\p{L}\s.'-]+$/u;
    if (!nameRegex.test(trimmedName)) {
        return {
            valid: false,
            message: 'Nome deve conter apenas letras e espaços.'
        };
    }

    return {
        valid: true,
        message: ''
    };
}

export function validateMessage(message) {
    const trimmedMessage = sanitizeInput(message, { maxLength: 1000, allowLineBreaks: true });

    if (!trimmedMessage) {
        return {
            valid: false,
            message: 'Por favor, escreva sua mensagem.'
        };
    }

    if (trimmedMessage.length < 10) {
        return {
            valid: false,
            message: 'Mensagem muito curta. Mínimo de 10 caracteres.'
        };
    }

    return {
        valid: true,
        message: ''
    };
}

export function checkOffensiveWords(text) {
    const normalizedText = normalizeForModeration(text || '');

    if (!normalizedText) {
        return {
            clean: true,
            foundWords: [],
            message: ''
        };
    }

    const foundWords = [];

    for (const word of OFFENSIVE_WORDS) {
        const pattern = word
            .split('')
            .map(char => {
                const variations = {
                    a: '[a@4]',
                    e: '[e3]',
                    i: '[i1!]',
                    o: '[o0]',
                    s: '[s$5]',
                    t: '[t7]'
                };

                return variations[char] || char;
            })
            .join('');

        const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
        if (regex.test(normalizedText)) {
            foundWords.push(word);
        }
    }

    if (foundWords.length > 0) {
        return {
            clean: false,
            foundWords,
            message: 'Sua mensagem contém linguagem inapropriada. Ajuste o texto para continuar.'
        };
    }

    return {
        clean: true,
        foundWords: [],
        message: ''
    };
}

export function clearFieldError(field) {
    if (!field || !field.parentNode) {
        return;
    }

    const errorId = `${field.id}-error`;

    field.classList.remove('field-error');
    field.removeAttribute('aria-invalid');

    const errorMessage = field.parentNode.querySelector(`#${errorId}`);
    if (errorMessage) {
        errorMessage.remove();
    }

    updateAriaDescribedBy(field, errorId);
}

export function showFieldError(field, message) {
    if (!field || !field.parentNode) {
        return;
    }

    if (!field.id) {
        field.id = `field-${Math.random().toString(36).slice(2, 8)}`;
    }

    clearFieldError(field);

    field.classList.add('field-error');
    field.setAttribute('aria-invalid', 'true');

    const errorElement = document.createElement('span');
    const errorId = `${field.id}-error`;

    errorElement.id = errorId;
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');

    field.parentNode.insertBefore(errorElement, field.nextSibling);

    const describedBy = (field.getAttribute('aria-describedby') || '')
        .split(' ')
        .map(token => token.trim())
        .filter(Boolean);

    if (!describedBy.includes(errorId)) {
        describedBy.push(errorId);
        field.setAttribute('aria-describedby', describedBy.join(' '));
    }

    field.focus();
}

export function clearFormFeedback(form) {
    if (!form) {
        return;
    }

    const feedbackElement = form.querySelector('[data-form-feedback]');
    if (!feedbackElement) {
        return;
    }

    feedbackElement.textContent = '';
    feedbackElement.classList.remove('is-success', 'is-error');
}

function setFormFeedback(form, message, tone) {
    const feedbackElement = form.querySelector('[data-form-feedback]');
    if (!feedbackElement) {
        return;
    }

    feedbackElement.textContent = message;
    feedbackElement.classList.remove('is-success', 'is-error');

    if (tone === 'success') {
        feedbackElement.classList.add('is-success');
    } else {
        feedbackElement.classList.add('is-error');
    }
}

export function showSuccessMessage(form, message) {
    setFormFeedback(form, message, 'success');
}

export function showFormError(form, message) {
    setFormFeedback(form, message, 'error');
}
