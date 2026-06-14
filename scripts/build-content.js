const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://officina404.com.br';
const CONTENT_ROOT = path.join(ROOT, 'assets', 'conteudo');
const INDEX_PATH = path.join(ROOT, 'index.html');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const DEFAULT_COVER = 'assets/images/og-image.webp';
const DEFAULT_COVER_FALLBACK = 'assets/images/og-image.png';
const WORDS_PER_MINUTE = 190;
const PUBLIC_STATUSES = new Set(['publicado', 'published', 'public']);

const COLLECTIONS = [
    {
        type: 'article',
        sourceDir: path.join(CONTENT_ROOT, 'artigos'),
        outputDir: path.join(ROOT, 'blog'),
        outputBase: 'blog',
        markerStart: '<!-- BLOG_CARDS_START -->',
        markerEnd: '<!-- BLOG_CARDS_END -->',
        cardClass: 'blog-card',
        linkClass: 'blog-card__link',
        dateClass: 'blog-card__date',
        eyebrow: 'Blog técnico',
        defaultCategory: 'Artigo técnico'
    },
    {
        type: 'project',
        sourceDir: path.join(CONTENT_ROOT, 'projetos'),
        outputDir: path.join(ROOT, 'projetos'),
        outputBase: 'projetos',
        markerStart: '<!-- PROJECT_CARDS_START -->',
        markerEnd: '<!-- PROJECT_CARDS_END -->',
        cardClass: 'project-card',
        linkClass: 'blog-card__link',
        dateClass: 'blog-card__date',
        eyebrow: 'Projeto técnico',
        defaultCategory: 'Projeto'
    }
];

function readText(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    if (fs.existsSync(filePath) && readText(filePath) === value) {
        return false;
    }

    fs.writeFileSync(filePath, value, 'utf8');
    return true;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
}

function stripTags(value) {
    return String(value ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function stripMarkdown(value) {
    return String(value ?? '')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_>#]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function truncateText(value, maxLength = 190) {
    const text = stripMarkdown(value);

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

function normalizeSlug(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/^artigo[_-]/i, '')
        .replace(/^projeto[_-]/i, '')
        .replace(/[_-]?officina404$/i, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'conteudo';
}

function parseScalar(value) {
    const trimmed = value.trim();

    if (!trimmed) {
        return '';
    }

    if (/^(true|false)$/i.test(trimmed)) {
        return trimmed.toLowerCase() === 'true';
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const inner = trimmed.slice(1, -1).trim();
        if (!inner) {
            return [];
        }

        return inner
            .split(',')
            .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean);
    }

    return trimmed.replace(/^['"]|['"]$/g, '');
}

function parseBoolean(value, defaultValue = false) {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        if (/^(true|sim|yes|1)$/i.test(value.trim())) {
            return true;
        }

        if (/^(false|nao|não|no|0)$/i.test(value.trim())) {
            return false;
        }
    }

    return defaultValue;
}

function normalizeStatus(value) {
    return String(value || 'publicado')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function isPublicStatus(status) {
    return PUBLIC_STATUSES.has(normalizeStatus(status));
}

function parseFrontmatter(markdown) {
    const normalized = markdown.replace(/^\uFEFF/, '');

    if (!normalized.startsWith('---\n') && !normalized.startsWith('---\r\n')) {
        return {
            data: {},
            body: normalized
        };
    }

    const endMatch = normalized.match(/\r?\n---\r?\n/);
    if (!endMatch || endMatch.index === undefined) {
        return {
            data: {},
            body: normalized
        };
    }

    const rawYaml = normalized.slice(4, endMatch.index);
    const body = normalized.slice(endMatch.index + endMatch[0].length);
    const data = {};

    rawYaml.split(/\r?\n/).forEach(line => {
        const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!match) {
            return;
        }

        data[match[1]] = parseScalar(match[2]);
    });

    return {
        data,
        body
    };
}

function findFirstHeading(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? stripMarkdown(match[1]) : '';
}

function removeFirstHeading(markdown) {
    return markdown.replace(/^#\s+.+\r?\n+/, '');
}

function findFirstBlockquote(markdown) {
    const match = markdown.match(/^>\s+(.+)$/m);
    return match ? stripMarkdown(match[1]) : '';
}

function findFirstParagraph(markdown) {
    const withoutHeading = removeFirstHeading(markdown);
    const blocks = withoutHeading.split(/\r?\n\s*\r?\n/);
    const paragraph = blocks.find(block => {
        const trimmed = block.trim();
        return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```') && !trimmed.startsWith('|');
    });

    return stripMarkdown(paragraph || '');
}

function calculateReadingTime(markdown) {
    const words = stripMarkdown(markdown).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function formatDateForMachine(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toISOString().slice(0, 10);
}

function formatDateForDisplay(dateValue) {
    const machine = formatDateForMachine(dateValue);
    if (!machine) {
        return 'Sem data';
    }

    const [year, month, day] = machine.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const months = ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'];

    return `${String(date.getUTCDate()).padStart(2, '0')} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function sanitizeHref(href) {
    const value = String(href ?? '').trim();

    if (!value) {
        return '#';
    }

    if (/^(https?:|mailto:|\/|\.\/|\.\.\/|#)/i.test(value)) {
        return value.replace(/[\u0000-\u001F\u007F]/g, '');
    }

    return '#';
}

function renderInline(raw) {
    const codeTokens = [];
    const tokenized = String(raw ?? '').replace(/`([^`]+)`/g, (_, code) => {
        const token = `@@CODE_${codeTokens.length}@@`;
        codeTokens.push(`<code>${escapeHtml(code)}</code>`);
        return token;
    });

    let html = escapeHtml(tokenized);

    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
        const safeSrc = sanitizeHref(src);
        return `<img src="${escapeAttr(safeSrc)}" alt="${escapeAttr(stripTags(alt))}" loading="lazy" decoding="async">`;
    });

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
        const safeHref = sanitizeHref(href);
        const external = /^https?:\/\//i.test(safeHref) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeAttr(safeHref)}"${external}>${label}</a>`;
    });

    html = html.replace(/&lt;(https?:\/\/[^&]+)&gt;/g, (_, href) => {
        const safeHref = sanitizeHref(href);
        return `<a href="${escapeAttr(safeHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(href)}</a>`;
    });

    html = html
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

    codeTokens.forEach((codeHtml, index) => {
        html = html.replace(`@@CODE_${index}@@`, codeHtml);
    });

    return html;
}

function closeList(listType) {
    if (!listType) {
        return '';
    }

    return listType === 'ol' ? '</ol>' : '</ul>';
}

function isMarkdownTableLine(line) {
    return /^\|.+\|$/.test(line.trim());
}

function isMarkdownTableDivider(line) {
    return /^\|(?:\s*:?-{3,}:?\s*\|)+$/.test(line.trim());
}

function parseMarkdownTableRow(line) {
    return line
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map(cell => cell.trim());
}

function renderMarkdownTable(rows) {
    if (rows.length < 2 || !isMarkdownTableDivider(rows[1])) {
        return rows.map(row => `<p>${renderInline(row)}</p>`).join('\n');
    }

    const headers = parseMarkdownTableRow(rows[0]);
    const bodyRows = rows.slice(2).map(parseMarkdownTableRow);

    return [
        '<div class="article-table-wrap" role="region" aria-label="Tabela do artigo" tabindex="0">',
        '    <table class="article-table">',
        '        <thead>',
        '            <tr>',
        ...headers.map(header => `                <th>${renderInline(header)}</th>`),
        '            </tr>',
        '        </thead>',
        '        <tbody>',
        ...bodyRows.map(row => [
            '            <tr>',
            ...row.map(cell => `                <td>${renderInline(cell)}</td>`),
            '            </tr>'
        ].join('\n')),
        '        </tbody>',
        '    </table>',
        '</div>'
    ].join('\n');
}

function renderMarkdown(markdown, titleToSkip) {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const html = [];
    let paragraph = [];
    let listType = null;
    let inCode = false;
    let codeLang = '';
    let codeLines = [];
    let skippedTitle = false;
    let tableRows = [];
    let ctaLines = null;

    const flushParagraph = () => {
        if (paragraph.length === 0) {
            return;
        }

        html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
        paragraph = [];
    };

    const flushTable = () => {
        if (tableRows.length === 0) {
            return;
        }

        html.push(renderMarkdownTable(tableRows));
        tableRows = [];
    };

    const flushCta = () => {
        if (!ctaLines) {
            return;
        }

        const ctaHtml = ctaLines
            .join(' ')
            .trim();

        if (ctaHtml) {
            html.push(`<div class="article-cta"><p>${renderInline(ctaHtml)}</p></div>`);
        }

        ctaLines = null;
    };

    const flushCode = () => {
        html.push(`<pre><code${codeLang ? ` class="language-${escapeAttr(codeLang)}"` : ''}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
        codeLang = '';
    };

    lines.forEach(line => {
        const trimmed = line.trim();

        if (ctaLines) {
            if (trimmed === ':::') {
                flushCta();
                return;
            }

            ctaLines.push(trimmed);
            return;
        }

        if (trimmed === ':::article-cta') {
            flushParagraph();
            flushTable();
            html.push(closeList(listType));
            listType = null;
            ctaLines = [];
            return;
        }

        if (trimmed.startsWith('```')) {
            if (inCode) {
                inCode = false;
                flushCode();
                return;
            }

            flushParagraph();
            flushTable();
            html.push(closeList(listType));
            listType = null;
            inCode = true;
            codeLang = normalizeSlug(trimmed.slice(3).trim());
            return;
        }

        if (inCode) {
            codeLines.push(line);
            return;
        }

        if (!trimmed) {
            flushParagraph();
            flushTable();
            html.push(closeList(listType));
            listType = null;
            return;
        }

        if (isMarkdownTableLine(trimmed)) {
            flushParagraph();
            html.push(closeList(listType));
            listType = null;
            tableRows.push(trimmed);
            return;
        }

        flushTable();

        const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (heading) {
            const level = heading[1].length;
            const text = stripMarkdown(heading[2]);

            if (level === 1 && !skippedTitle && text === titleToSkip) {
                skippedTitle = true;
                return;
            }

            flushParagraph();
            html.push(closeList(listType));
            listType = null;
            html.push(`<h${Math.min(level, 3)}>${renderInline(heading[2])}</h${Math.min(level, 3)}>`);
            return;
        }

        const unordered = trimmed.match(/^[-*]\s+(.+)$/);
        const ordered = trimmed.match(/^\d+\.\s+(.+)$/);

        if (unordered || ordered) {
            flushParagraph();
            const nextType = ordered ? 'ol' : 'ul';

            if (listType && listType !== nextType) {
                html.push(closeList(listType));
                listType = null;
            }

            if (!listType) {
                listType = nextType;
                html.push(listType === 'ol' ? '<ol>' : '<ul>');
            }

            html.push(`<li>${renderInline((unordered || ordered)[1])}</li>`);
            return;
        }

        if (trimmed.startsWith('>')) {
            flushParagraph();
            html.push(closeList(listType));
            listType = null;
            html.push(`<blockquote><p>${renderInline(trimmed.replace(/^>\s?/, ''))}</p></blockquote>`);
            return;
        }

        paragraph.push(trimmed);
    });

    if (inCode) {
        flushCode();
    }

    flushCta();
    flushParagraph();
    flushTable();
    html.push(closeList(listType));

    return html.filter(Boolean).join('\n');
}

function pickCover(meta, collectionType) {
    const cover = meta.cover || meta.image || DEFAULT_COVER;
    const fallback = meta.coverFallback || meta.imageFallback || (cover === DEFAULT_COVER
        ? DEFAULT_COVER_FALLBACK
        : cover.endsWith('.webp') ? cover.replace(/\.webp$/i, '.jpg') : cover);

    return {
        cover,
        fallback,
        alt: meta.coverAlt || meta.imageAlt || (collectionType === 'project' ? 'Imagem do projeto Officina 404' : 'Imagem do artigo Officina 404')
    };
}

function readCollectionItem(filePath, collection) {
    const raw = readText(filePath);
    const parsed = parseFrontmatter(raw);
    const sourceBody = parsed.body.trim();
    const fileBase = path.basename(filePath, path.extname(filePath));
    const status = parsed.data.status || 'publicado';
    const title = parsed.data.title || findFirstHeading(sourceBody) || fileBase;
    const heading = parsed.data.heading || title;
    const subtitle = parsed.data.subtitle || findFirstBlockquote(sourceBody) || '';
    const description = truncateText(parsed.data.description || subtitle || findFirstParagraph(sourceBody));
    const date = parsed.data.date || parsed.data.published || parsed.data.publishedAt || '';
    const machineDate = formatDateForMachine(date);
    const slug = normalizeSlug(parsed.data.slug || fileBase);
    const tags = Array.isArray(parsed.data.tags) ? parsed.data.tags : [];
    const category = parsed.data.category || collection.defaultCategory;
    const cleanBody = removeFirstHeading(sourceBody).trim();
    const cover = pickCover(parsed.data, collection.type);
    const publicItem = isPublicStatus(status);

    if (publicItem && !machineDate) {
        throw new Error(`Data obrigatória ausente ou inválida em ${filePath}`);
    }

    return {
        type: collection.type,
        sourcePath: filePath,
        title,
        heading,
        pageTitle: parsed.data.pageTitle || `${title} | Officina 404`,
        subtitle,
        description,
        date,
        machineDate,
        displayDate: formatDateForDisplay(date),
        author: parsed.data.author || 'Junior Godoi - Officina 404',
        displayAuthor: parsed.data.displayAuthor || parsed.data.author || 'Junior Godoi - Officina 404',
        category,
        tags,
        slug,
        readingTime: Number(parsed.data.readingTime) || calculateReadingTime(cleanBody),
        outputPath: path.join(collection.outputDir, `${slug}.html`),
        urlPath: `${collection.outputBase}/${slug}.html`,
        sourceBody: cleanBody,
        bodyHtml: renderMarkdown(cleanBody, title),
        cover,
        status,
        publicItem,
        featured: parseBoolean(parsed.data.featured, true),
        featuredOrder: Number(parsed.data.featuredOrder) || Number.POSITIVE_INFINITY
    };
}

function loadCollection(collection) {
    if (!fs.existsSync(collection.sourceDir)) {
        return [];
    }

    return fs.readdirSync(collection.sourceDir)
        .filter(file => file.toLowerCase().endsWith('.md'))
        .map(file => readCollectionItem(path.join(collection.sourceDir, file), collection))
        .sort((a, b) => String(b.machineDate).localeCompare(String(a.machineDate)) || a.title.localeCompare(b.title));
}

function renderPicture(item, prefix = '') {
    const cover = item.cover.cover;
    const fallback = item.cover.fallback || cover;
    const alt = item.cover.alt || item.title;
    const src = `${prefix}${cover}`;
    const fallbackSrc = `${prefix}${fallback}`;

    if (cover.endsWith('.webp')) {
        return [
            '<picture>',
            `    <source srcset="${escapeAttr(src)}" type="image/webp" />`,
            `    <img src="${escapeAttr(fallbackSrc)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async" width="1536" height="1024" />`,
            '</picture>'
        ].join('\n');
    }

    return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async" width="1536" height="1024" />`;
}

function renderCard(item, collection) {
    if (collection.type === 'project') {
        const tags = item.tags.slice(0, 3).map(tag => `                                <span class="project-tag">${escapeHtml(tag)}</span>`).join('\n');

        return [
            '                        <article class="project-card content-card" data-animate>',
            '                            <div class="project-card__body">',
            `                                <h3>${escapeHtml(item.title)}</h3>`,
            `                                <p>${escapeHtml(item.description)}</p>`,
            '                            </div>',
            '                            <div class="project-card__footer">',
            tags || `                                <span class="project-tag">${escapeHtml(item.category)}</span>`,
            '                            </div>',
            `                            <a class="blog-card__link" href="${escapeAttr(item.urlPath)}">Ver projeto <span class="link-arrow" aria-hidden="true">&rarr;</span></a>`,
            '                        </article>'
        ].join('\n');
    }

    return [
        '                        <article class="blog-card content-card" data-animate>',
        '                            <figure class="blog-card__media">',
        renderPicture(item).split('\n').map(line => `                                ${line}`).join('\n'),
        '                            </figure>',
        '                            <div class="blog-card__body">',
        `                                <p class="blog-card__date">${escapeHtml(item.displayDate)}</p>`,
        `                                <h3>${escapeHtml(item.title)}</h3>`,
        `                                <p>${escapeHtml(item.description)}</p>`,
        `                                <a class="blog-card__link" href="${escapeAttr(item.urlPath)}">Ler artigo <span class="link-arrow" aria-hidden="true">&rarr;</span></a>`,
        '                            </div>',
        '                        </article>'
    ].join('\n');
}

function renderTags(item) {
    if (!item.tags.length) {
        return '';
    }

    return [
        '                <div class="article-tags">',
        ...item.tags.map(tag => `                    <span class="article-tag">#${escapeHtml(tag)}</span>`),
        '                </div>'
    ].join('\n');
}

function sortFeaturedItems(items) {
    return [...items].sort((a, b) => {
        if (a.featuredOrder !== b.featuredOrder) {
            return a.featuredOrder - b.featuredOrder;
        }

        return String(b.machineDate).localeCompare(String(a.machineDate)) || a.title.localeCompare(b.title);
    });
}

function renderPage(item, collection) {
    const pageTitle = item.pageTitle || `${item.title} | Officina 404`;
    const absoluteUrl = `${SITE_URL}/${item.urlPath}`;
    const absoluteImage = `${SITE_URL}/${item.cover.cover}`;
    const bodyClass = collection.type === 'project' ? 'project-page' : 'article-page';
    const readableType = collection.type === 'project' ? 'Projeto' : 'Artigo';
    const backLabel = collection.type === 'project' ? 'Voltar aos Projetos' : 'Voltar ao Blog';
    const backHref = collection.type === 'project' ? '../index.html#projetos' : '../index.html#blog';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': collection.type === 'project' ? 'CreativeWork' : 'Article',
        headline: item.title,
        description: item.description,
        author: {
            '@type': 'Person',
            name: item.author
        },
        datePublished: item.machineDate || undefined,
        dateModified: item.machineDate || undefined,
        image: absoluteImage,
        mainEntityOfPage: absoluteUrl
    };
    const structuredData = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
    const structuredDataHash = crypto.createHash('sha256').update(structuredData).digest('base64');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' mailto:; connect-src 'self'; img-src 'self' https: data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'sha256-${structuredDataHash}'; upgrade-insecure-requests">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="format-detection" content="telephone=no">
    <meta name="color-scheme" content="dark">
    <meta name="description" content="${escapeAttr(item.description)}">
    <meta name="author" content="${escapeAttr(item.author)}">
    <meta name="robots" content="index, follow">
    <meta property="og:site_name" content="Officina 404">
    <meta property="og:title" content="${escapeAttr(pageTitle)}">
    <meta property="og:description" content="${escapeAttr(item.description)}">
    <meta property="og:type" content="${collection.type === 'project' ? 'website' : 'article'}">
    <meta property="og:url" content="${escapeAttr(absoluteUrl)}">
    <meta property="og:image" content="${escapeAttr(absoluteImage)}">
    <meta property="og:image:alt" content="${escapeAttr(item.cover.alt)}">
    <meta property="og:locale" content="pt_BR">
    ${item.machineDate ? `<meta property="article:published_time" content="${escapeAttr(item.machineDate)}">` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(pageTitle)}">
    <meta name="twitter:description" content="${escapeAttr(item.description)}">
    <meta name="twitter:image" content="${escapeAttr(absoluteImage)}">
    <title>${escapeHtml(pageTitle)}</title>
    <link rel="canonical" href="${escapeAttr(absoluteUrl)}">
    <link rel="icon" type="image/png" href="../assets/images/og-image.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <script type="application/ld+json">${structuredData}</script>
</head>
<body>
    <a class="skip-link" href="#conteudo-principal">Pular para o conteudo principal</a>
    <header id="header">
        <nav class="nav container" aria-label="Navegação principal">
            <a class="logo" href="../index.html#conteudo-principal">Officina 404</a>
            <button class="mobile-menu-toggle" type="button" aria-controls="nav-menu" aria-expanded="false" aria-label="Abrir menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="nav-menu">
                <li><a href="../index.html#projetos">Projetos</a></li>
                <li><a href="../index.html#blog">Blog</a></li>
                <li><a href="../index.html#sobre">Sobre</a></li>
                <li><a href="../index.html#contato">Contato</a></li>
            </ul>
        </nav>
    </header>

    <main class="${bodyClass}" id="conteudo-principal">
        <section class="article-header">
            <div class="container article-shell">
                <a href="${escapeAttr(backHref)}" class="back-to-blog">
                    <span aria-hidden="true">&larr;</span> ${escapeHtml(backLabel)}
                </a>
                <div class="article-meta" role="list" aria-label="Metadados do ${collection.type === 'project' ? 'projeto' : 'artigo'}">
                    <span class="article-meta__item" role="listitem">${escapeHtml(readableType)}</span>
                    <span class="article-meta__item" role="listitem">Autor: ${escapeHtml(item.displayAuthor)}</span>
                    <span class="article-meta__item" role="listitem">Publicado: ${escapeHtml(item.displayDate)}</span>
                    <span class="article-meta__item" role="listitem">Leitura: ${item.readingTime} min</span>
                </div>
                <h1 class="article-title">${escapeHtml(item.heading)}</h1>
                ${item.subtitle ? `<p class="article-deck">${escapeHtml(item.subtitle)}</p>` : ''}
                <p class="article-subtitle">${escapeHtml(item.description)}</p>
            </div>
        </section>

        <section class="article-content">
            <div class="container article-shell">
                <article class="article-body">
${item.bodyHtml.split('\n').map(line => `                    ${line}`).join('\n')}
${renderTags(item)}
                </article>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container footer-shell">
            <div class="footer-main">
                <div class="footer-brand">
                    <a class="footer-logo" href="../index.html#conteudo-principal">Officina 404</a>
                    <p class="footer-signature">Hardware, software, infraestrutura e segurança com postura técnica e entrega confiável.</p>
                </div>
                <nav class="footer-links" aria-label="Links úteis do rodapé">
                    <a href="../index.html#projetos">Projetos</a>
                    <a href="../index.html#blog">Blog</a>
                    <a href="../index.html#sobre">Sobre</a>
                    <a href="../index.html#contato">Contato</a>
                </nav>
                <ul class="footer-social" aria-label="Canais sociais da Officina 404">
                    <li>
                        <a href="https://github.com/hard87" target="_blank" rel="noopener noreferrer" aria-label="GitHub da Officina 404 (abre em nova aba)">
                            <span aria-hidden="true">GH</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://linkedin.com/in/juniorgodoi87" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Junior Godoi (abre em nova aba)">
                            <span aria-hidden="true">in</span>
                        </a>
                    </li>
                    <li>
                        <a href="mailto:contato@officina404.com.br" aria-label="Enviar email para Officina 404">
                            <span aria-hidden="true">@</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="footer-meta">
                <p>&copy; 2026 Officina 404 - Junior Godoi. Todos os direitos reservados.</p>
                <p>Do circuito ao código, com disciplina e clareza técnica.</p>
            </div>
        </div>
    </footer>

    <script src="../js/main.js" type="module"></script>
</body>
</html>
`;
}

function replaceMarkedSection(source, markerStart, markerEnd, generatedHtml, skipEmpty = false) {
    if (skipEmpty && !generatedHtml.trim()) {
        return source;
    }

    if (!source.includes(markerStart) || !source.includes(markerEnd)) {
        throw new Error(`Marcadores ausentes: ${markerStart} / ${markerEnd}`);
    }

    const pattern = new RegExp(`(${markerStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([\\s\\S]*?)(${markerEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`);

    return source.replace(pattern, `$1\n${generatedHtml}\n                        $3`);
}

function updateInlineScriptCspHashes(html) {
    const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
        .filter(match => !/\ssrc=/i.test(match[1]))
        .map(match => match[2]);

    if (!inlineScripts.length) {
        return html;
    }

    const hashes = inlineScripts.map(script => `'sha256-${crypto.createHash('sha256').update(script).digest('base64')}'`);

    return html.replace(/(script-src\s+)([^;"]+)/, (_, prefix, value) => {
        const preservedTokens = value
            .split(/\s+/)
            .map(token => token.trim())
            .filter(Boolean)
            .filter(token => !/^'sha256-/i.test(token));

        return `${prefix}${[...new Set([...preservedTokens, ...hashes])].join(' ')}`;
    });
}

function renderSitemap(items) {
    const paths = new Set(['', ...items.map(item => item.urlPath)]);

    const urls = Array.from(paths).sort((a, b) => {
        if (a === '') return -1;
        if (b === '') return 1;
        return a.localeCompare(b);
    });

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map(urlPath => [
            '    <url>',
            `        <loc>${SITE_URL}${urlPath ? `/${escapeHtml(urlPath)}` : '/'}</loc>`,
            `        <priority>${urlPath ? '0.7' : '1.0'}</priority>`,
            '    </url>'
        ].join('\n')),
        '</urlset>',
        ''
    ].join('\n');
}

function build() {
    const allItems = [];
    let indexHtml = readText(INDEX_PATH);

    COLLECTIONS.forEach(collection => {
        const items = loadCollection(collection).filter(item => item.publicItem);
        const featuredItems = sortFeaturedItems(items.filter(item => item.featured));
        allItems.push(...items);

        items.forEach(item => {
            writeText(item.outputPath, renderPage(item, collection));
        });

        const cards = featuredItems.map(item => renderCard(item, collection)).join('\n');
        indexHtml = replaceMarkedSection(indexHtml, collection.markerStart, collection.markerEnd, cards, collection.type === 'project');
    });

    indexHtml = updateInlineScriptCspHashes(indexHtml);

    writeText(INDEX_PATH, indexHtml);
    writeText(SITEMAP_PATH, renderSitemap(allItems));

    console.log(`Conteúdo gerado: ${allItems.length} item(ns).`);
}

build();
