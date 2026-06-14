const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SKIPPED_DIRS = new Set(['.git', 'node_modules']);

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    entries.forEach(entry => {
        if (SKIPPED_DIRS.has(entry.name)) {
            return;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...walk(fullPath));
            return;
        }

        files.push(fullPath);
    });

    return files;
}

function readText(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function toSitePath(filePath) {
    return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function isExternalReference(value) {
    return /^(?:https?:|mailto:|tel:|data:|#|javascript:)/i.test(value);
}

function checkJavaScriptSyntax(files, errors) {
    files
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            try {
                execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
            } catch (error) {
                errors.push(`${toSitePath(file)}: JavaScript inválido`);
            }
        });
}

function checkLocalReferences(files, errors) {
    const attrPattern = /\b(?:href|src|srcset)="([^"]+)"/g;

    files
        .filter(file => file.endsWith('.html'))
        .forEach(file => {
            const html = readText(file);
            let match;

            while ((match = attrPattern.exec(html))) {
                const values = match[1].split(',');

                values.forEach(value => {
                    const target = value.trim().split(/\s+/)[0];

                    if (!target || isExternalReference(target)) {
                        return;
                    }

                    const cleanTarget = target.split('#')[0].split('?')[0];

                    if (!cleanTarget || cleanTarget.startsWith('/')) {
                        return;
                    }

                    const resolved = path.resolve(path.dirname(file), cleanTarget);

                    if (!fs.existsSync(resolved)) {
                        errors.push(`${toSitePath(file)}: referência local ausente (${target})`);
                    }
                });
            }
        });
}

function checkInlineScriptCsp(files, errors) {
    const cspPattern = /Content-Security-Policy[^>]+content="([^"]+)"/i;
    const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

    files
        .filter(file => file.endsWith('.html'))
        .forEach(file => {
            const html = readText(file);
            const csp = html.match(cspPattern)?.[1] || '';
            const allowedHashes = [...csp.matchAll(/sha256-([^'\s;]+)/g)].map(match => match[1]);
            let match;

            while ((match = scriptPattern.exec(html))) {
                if (/\ssrc=/i.test(match[1])) {
                    continue;
                }

                const hash = crypto.createHash('sha256').update(match[2]).digest('base64');

                if (!allowedHashes.includes(hash)) {
                    errors.push(`${toSitePath(file)}: hash CSP ausente ou divergente para script inline`);
                }
            }
        });
}

function validate() {
    const files = walk(ROOT);
    const errors = [];

    checkJavaScriptSyntax(files, errors);
    checkLocalReferences(files, errors);
    checkInlineScriptCsp(files, errors);

    if (errors.length > 0) {
        console.error(errors.join('\n'));
        process.exit(1);
    }

    console.log('Validação concluída sem erros.');
}

validate();
