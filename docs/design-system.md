# Design system — Officina 404

Referência central do sistema visual e das convenções de desenvolvimento do site.
Os tokens vivem em [`css/style.css`](../css/style.css) (bloco `:root`); este documento
descreve o que eles significam e como aplicá-los. Quando houver divergência, o CSS é a
fonte de verdade — atualize este arquivo junto com a mudança.

O tema oficial é **escuro por padrão**. Light mode está fora de escopo para preservar a
identidade dark, técnica e industrial da marca (`color-scheme: dark` no `:root` e no
`<meta name="color-scheme">` de cada página).

---

## 1. Propósito e personalidade

A Officina 404 é o laboratório autoral de Junior Godoi para hardware, software, IoT,
infraestrutura e segurança. A interface precisa soar como uma bancada de engenharia:

- **Calma e honesta.** Sem linguagem comercial, sem promessas grandiosas, sem métricas
  inventadas. O que funciona aparece medido; o que falta continua visível.
- **Técnica sem ser hermética.** Densidade de informação alta, ruído visual baixo.
- **Sóbria.** Fundo quase preto, um único verde-neon de acento, tipografia monoespaçada
  na marca. Nada de gradientes chamativos, brilhos exagerados ou estética cyberpunk.
- **Movimento discreto.** Transições curtas, reveals sutis, sempre condicionados a
  `prefers-reduced-motion`.

---

## 2. Cores

Paleta única em `:root`. Não introduzir cores fora desta tabela sem registrá-las aqui.

### Fundo e superfícies

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-bg` | `#04050a` | Fundo principal do documento |
| `--color-surface` | `#0d111a` | Cards, formulários, superfícies base |
| `--color-surface-muted` | `#161b26` | Inputs e superfícies secundárias |
| `--color-surface-raised` | `#111722` | Elementos elevados, skip link |
| `--color-backdrop` | `rgba(4, 5, 10, 0.72)` | Overlays e camadas de escurecimento |

O `.page` aplica um gradiente radial verde muito sutil no canto superior direito sobre
um gradiente linear entre tons de fundo — é o único "brilho" ambiente permitido.

### Texto

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-text` | `#f2f4f7` | Texto principal e títulos |
| `--color-reading` | `#c6d1e3` | Corpo de leitura longa (`.article-body`) |
| `--color-muted` | `#99a4b6` | Texto de apoio, metadados, legendas |

### Bordas

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-border` | `#232b37` | Bordas neutras (`--card-border`) |
| `--color-border-strong` | `rgba(46, 211, 140, 0.38)` | Bordas de destaque, skip link |

Bordas "vivas" pontuais usam `rgba(255, 255, 255, 0.05–0.2)` para separadores internos e
`rgba(46, 211, 140, 0.2–0.5)` para realce em hover/foco.

### Acento e estados

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-accent` | `#2ed38c` | **Verde-neon oficial** (ver seção 3) |
| `--color-accent-dark` | `#22a571` | Hover de botões primários |
| `--color-warm` | `#c96d2f` | Acento cobre da marca (faixa superior dos blog cards) |
| `--color-success` | `#6ff5be` | Feedback positivo; brilho do logotipo em hover/foco |
| `--color-warning` | `#f4b860` | Alertas (uso futuro) |
| `--color-danger` | `#ff8e8e` | Texto de erro |
| `--color-danger-strong` | `#ea6b6b` | Borda de campo com erro |
| `--color-focus` | `#7cf6bd` | Anel de foco visível (`--focus-ring`) |

---

## 3. Verde-neon oficial

`--color-accent` (`#2ed38c`) é a assinatura da marca. Usar com parcimônia, sempre com
função clara:

- o **"404"** do logotipo;
- **um** call-to-action primário por tela (`.btn-primary`);
- links dentro de texto (`a`);
- realce de foco/hover (bordas, marcadores de lista, cabeçalho de tabela);
- `::marker` de listas em artigos e faixa de topo dos cards.

Não usar verde para grandes áreas preenchidas, texto corrido longo ou vários elementos
concorrentes na mesma dobra. `--color-success` (`#6ff5be`) é a versão "mais brilhante"
reservada a feedback positivo e ao micro-hover do logotipo.

---

## 4. Logotipo

Composição fixa: **"Officina" em branco + "404" em verde-neon**, tipografia
monoespaçada (`--font-mono`), `letter-spacing` levemente aberto.

```html
<a class="logo" href="…">Officina <span class="logo__accent">404</span></a>
<a class="footer-logo" href="…">Officina <span class="logo__accent">404</span></a>
```

- **Implementação centralizada.** `.logo__accent` (em `css/style.css`) é a única regra do
  acento e é compartilhada por cabeçalho (`.logo`), rodapé (`.footer-logo`) e pelo
  _eyebrow_ da marca em `index.html` e `404.html`. **Não** replicar o estilo por página
  nem por elemento; para exibir a marca, use a marcação acima.
- **Páginas geradas.** O template em [`scripts/build-content.js`](../scripts/build-content.js)
  emite a mesma marcação; rodar `npm run build:content` propaga a marca para `blog/` e
  `projetos/`.
- **Hover / foco.** Só o "404" reage: transição de `--color-accent` para
  `--color-success` com um brilho discreto (`text-shadow: 0 0 8px rgba(46,211,140,.32)`),
  duração `--duration-fast` (0.16 s). "Officina" permanece branco. Sem deslocamento,
  escala ou animação. O link inteiro mantém o anel de foco padrão (`:focus-visible`),
  garantindo legibilidade em foco, hover e navegação por teclado.
- `prefers-reduced-motion: reduce` zera a duração da transição (o acento troca de cor
  instantaneamente).

---

## 5. Tipografia

| Token | Valor | Uso |
| --- | --- | --- |
| `--font-sans` | `Inter`, `Segoe UI`, `system-ui`, sans-serif | Texto e interface |
| `--font-mono` | `JetBrains Mono`, `Courier New`, monospace | Marca, rótulos, tags, metadados, blocos de código |

Fontes carregadas do Google Fonts (`Inter` 300–700, `JetBrains Mono` 400/700) com
`preconnect`. Toda família tem fallback de sistema real.

### Escala

| Token | Valor | Uso |
| --- | --- | --- |
| `--text-xs` | `0.78rem` | Badges, datas, microcopy, tags mono |
| `--text-sm` | `0.86rem` | Feedback de formulário, metadados |
| `--text-base` | `1rem` | Corpo padrão |
| `--text-md` | `1.05rem` | Corpo de artigo (`.article-body`) |
| `--text-lg` | `1.2rem` | Títulos de card |

Títulos fluidos com `clamp()`:

| Contexto | Regra |
| --- | --- |
| `.hero h1` | `clamp(1.95rem, 8.8vw, 4.85rem)` / linha 1.04 |
| `.section-heading h1/h2` | `clamp(2rem, 3vw, 2.6rem)` |
| `.article-title` | `clamp(2rem, 5vw, 3rem)` / linha 1.12 |
| `.article-deck` | `clamp(1.06rem, 2.4vw, 1.3rem)`, peso 600 |
| `.article-body h2` | `clamp(1.5rem, 3.2vw, 2rem)` com borda inferior sutil |
| `.article-body h3` | `clamp(1.14rem, 2.5vw, 1.4rem)` |

### Pesos e alturas de linha

- Pesos usados: 300 (leve, opcional), 400 (corpo), 600 (ênfase, títulos de card,
  botões), 700 (marca, rótulos mono, ícones sociais).
- `--line-tight: 1.25` (headings compactos), `--line-base: 1.6` (texto geral),
  `--line-relaxed: 1.82` (artigos longos).
- **Legibilidade mínima:** corpo nunca abaixo de `1rem`; `--color-muted` (`#99a4b6`)
  sobre `--color-bg` é o menor contraste aceito e fica reservado a texto de apoio, nunca
  a leitura longa. Rótulos mono em maiúsculas usam `letter-spacing` ≥ `0.02em`
  (eyebrow: `0.3em`).

---

## 6. Espaçamento e containers

| Token | Valor |
| --- | --- |
| `--spacing-xs` | `0.5rem` |
| `--spacing-sm` | `1rem` |
| `--spacing-md` | `1.5rem` |
| `--spacing-lg` | `2.5rem` |
| `--spacing-xl` | `3.5rem` |
| `--spacing-2xl` | `5rem` |

- `section` usa `--spacing-xl` vertical (`2.5rem` abaixo de 576 px).
- `.container`: `width: min(100% - 2rem, var(--max-width))`, centralizado.
  `--max-width: 1200px`; `--container-gutter` sobe de `1rem` para `1.5rem` em ≥ 768 px.
- `.article-shell`: `max-width: 860px`; `.article-body`: `max-width: 760px`.
- Cards: `--card-padding: 1.5rem`, `--card-gap: 0.85rem`.

---

## 7. Forma, borda, sombra e movimento

| Token | Valor | Uso |
| --- | --- | --- |
| `--radius-xs` | `4px` | Foco, detalhes, `code` inline |
| `--radius-base` | `8px` | Inputs, blocos, botões-fantasma |
| `--radius-card` | `8px` | Cards, tabelas, blocos de código |
| `--radius-pill` | `999px` | Tags, botões, nav pills, chips de metadados |
| `--shadow-soft` | `0 10px 30px rgba(0,0,0,.35)` | Header ao rolar |
| `--shadow-card` | `0 18px 42px rgba(0,0,0,.38)` | Cards elevados |
| `--focus-ring` | `2px solid var(--color-focus)` | Anel de foco (`--focus-offset: 4px`) |
| `--duration-fast` | `0.16s` | Cor de acento, estados rápidos |
| `--duration-base` | `0.28s` | Transições principais (`--transition-base`) |
| `--duration-slow` | `0.55s` | Reveals com scroll |
| `--easing-standard` | `ease` | Curva padrão |

---

## 8. Componentes

### Botões — `.btn`

- `min-height: 2.9rem`, `--radius-pill`, peso 600.
- `.btn-primary`: fundo `--color-accent`, texto `#041017`, sombra verde; hover →
  `--color-accent-dark` + `translateY(-2px)`.
- `.btn-secondary`: transparente, borda branca 30 %; hover → borda e texto verdes.
- `:disabled`: `opacity: 0.65`, `cursor: not-allowed`, sem `transform`.

### Links

`a` verde por padrão (inclusive `:visited`), hover `--color-accent-dark`. Links de
"seta" (`.blog-card__link`, `.back-to-blog`) deslocam a seta `3px` no hover/foco.

### Cards — `.content-card` / `.project-card` / `.blog-card`

- Base: `--color-surface`, `--card-border`, `--radius-card`, `--shadow-card`.
- `.project-card:hover`: `translateY(-4px)` + borda verde 50 %.
- `.blog-card`: faixa superior de `4px` em gradiente verde→cobre; mídia em `<picture>`
  16 : 10.
- Grades: `.content-grid` com `repeat(auto-fit, minmax(min(100%, 240–260px), 1fr))`.

### Tabelas — `.article-table`

Sempre dentro de `.article-table-wrap` (`role="region"`, `aria-label`, `tabindex="0"`,
`overflow-x: auto`). `min-width: 680px` (600 px em telas pequenas) — rolagem horizontal
fica **dentro** do wrapper, nunca no `body`. Cabeçalho mono, maiúsculas, fundo verde
14 %; linhas ímpares levemente destacadas; hover verde 7 %.

### Blocos de código — `.article-body pre`

Fundo `#080b12`, borda branca 10 %, `--radius-card`, `overflow-x: auto`. `code` inline
com fundo branco 8 % e `--radius-xs`. O build renderiza um subconjunto seguro de
Markdown e escapa HTML; blocos multilinha não recebem indentação artificial do template.

### Formulários

- `.form-group input/textarea`: fundo `--color-surface-muted`, foco → borda verde +
  `box-shadow: 0 0 0 3px rgba(46,211,140,.15)`.
- `.field-error`: borda `--color-danger-strong` + halo vermelho; `.error-message` em
  mono/`--text-xs`/`--color-danger`.
- Estados de envio: `.is-submitting`, `[aria-busy="true"]`, botão `:disabled` com rótulo
  "Preparando…". Feedback em `[data-form-feedback]` com `aria-live="polite"`;
  `.is-success` (verde-menta) / `.is-error` (vermelho).
- Honeypot: `.form-group--hidden` (fora da tela, `tabindex="-1"`, `aria-hidden`).

### Indicadores e chips

`.article-meta__item`, `.article-tag`, `.project-tag`, `.footer-links a`,
`.hero__signals li`: pílulas mono, `--text-xs`, borda branca sutil, fundo branco 2–3 %.

---

## 9. Estados interativos

| Estado | Regra |
| --- | --- |
| **Hover** | Preserva a identidade verde/cobre; movimento só via `transform`/`opacity` e curto |
| **Focus** | `:focus-visible` global em `a, button, input, textarea, select, [tabindex]:not([-1])` → `--focus-ring` com `--focus-offset`. Inputs de formulário usam borda + halo em vez do anel. `.article-table-wrap` recebe o anel ao focar |
| **Active** | Sem tratamento dedicado além do hover (mantém simplicidade) |
| **Disabled** | `cursor: not-allowed`; botões perdem sombra e `transform` |
| **Error** | `.field-error` + `.error-message`; feedback textual com `aria-live` |
| **Loading** | `.is-submitting` / `[aria-busy="true"]` no `<form>` |

O skip link (`.skip-link`) fica fora da tela e aparece em `:focus-visible` no canto
superior esquerdo.

---

## 10. Responsividade

Mobile-first. Breakpoints em uso:

| Largura | Efeito |
| --- | --- |
| `≤ 576px` | `section` compacta; tabelas `min-width: 600px`; chips de metadado ocupam a linha inteira |
| `≤ 768px` (`max-width: 900px` no CSS) | Nav vira menu lateral (`.mobile-menu-toggle`); `.contato-grid` e `.footer-main` em coluna única |
| `≥ 768px` | Container mais largo, nav horizontal, `.mobile-menu-toggle` oculto |
| `≥ 901px` | Hero ganha altura mínima e imagem lateral |
| `≥ 1440px` | `.hero h1` fixa em `4.85rem` |

Regras invioláveis:

- **Sem overflow horizontal no `body`.** `html`/`body` usam `overflow-x: clip`; conteúdo
  largo (tabelas, código, diagramas) rola dentro do próprio contêiner `overflow-x: auto`.
- Imagens: `img { max-width: 100%; display: block }`.
- Tipografia e espaços‑chave em unidades relativas / `clamp()`.

---

## 11. Acessibilidade

- HTML semântico: `header`/`main`/`footer`, `nav` com `aria-label`, um `<h1>` por página,
  hierarquia de headings sem saltos.
- Skip link para `#conteudo-principal` em todas as páginas de conteúdo.
- Foco sempre visível (seção 9); navegação completa por teclado, incluindo o menu móvel
  (`aria-expanded`, rótulo dinâmico, trap de foco, `Esc` para fechar).
- `prefers-reduced-motion: reduce`: desliga smooth scroll, zera durações de transição e
  animação, revela os `[data-animate]` imediatamente.
- Alvos de toque ≥ ~40 px (`.btn` 2.9rem, ícones sociais 2rem).
- Links que abrem nova aba: `target="_blank"` + `rel="noopener noreferrer"` +
  `aria-label` indicando "(abre em nova aba)".
- Contraste: texto principal `#f2f4f7` sobre `#04050a`; `--color-muted` só para apoio.

---

## 12. Convenções de código

### HTML

- `lang="pt-BR"`, `<meta charset>` e `viewport` primeiro.
- CSP, `Referrer-Policy` e `color-scheme` via `<meta>` (defesa mínima para hosting
  estático — o ideal é headers na infraestrutura).
- Páginas manuais (`index.html`, `404.html`, `em-construcao.html`) usam indentação de
  **2 espaços**; páginas geradas em `blog/` e `projetos/` seguem o template
  (**4 espaços**). Não misturar dentro do mesmo arquivo.
- Atributos em `kebab-case`; classes em `kebab-case` com padrão BEM leve
  (`bloco__elemento`, `bloco--modificador`).

### CSS (`css/style.css`)

- Arquivo único, em blocos comentados e numerados: tokens → reset/base → header/nav →
  hero → seções e cards → artigo → contato → footer → utilitários/media queries.
- Indentação de **4 espaços**, uma propriedade por linha, cores sempre via token.
- Novas cores/medidas entram como token no `:root` e são registradas neste documento.
- Componentes reutilizáveis moram aqui — **nunca** CSS embutido nas páginas oficiais.

### JavaScript (`js/`)

- ES modules. `main.js` só compõe módulos independentes de `js/modules/`.
- Indentação de 4 espaços, aspas simples, ponto e vírgula, `const`/`let`.
- Sem dependências de runtime e sem build de JS: os arquivos são servidos como estão.
- Todo efeito visual consulta `prefers-reduced-motion` antes de animar.

---

## 13. Ferramentas de formatação e validação

O repositório **não usa** formatador automático (Prettier/ESLint/Stylelint) nem
`.editorconfig`. As convenções da seção 12 são mantidas manualmente. Não instalar essas
dependências sem necessidade real.

Ferramentas que existem de fato (`package.json`, sem dependências):

| Comando | O que faz |
| --- | --- |
| `npm run build:content` | Gera `blog/` e `projetos/` a partir de `assets/conteudo/**/*.md`, atualiza os cards da home e o `sitemap.xml`, recalcula hashes CSP de scripts inline |
| `npm run validate` | [`scripts/validate-site.js`](../scripts/validate-site.js): valida sintaxe JS (`node --check`), referências locais em `href/src/srcset` e hashes CSP de scripts inline. Ignora `.git`, `node_modules` e `mockups/` |
| `npm run check` | `build:content` + `validate` — rodar antes de considerar qualquer mudança concluída |

`mockups/` guarda protótipos de referência (com CSS/JS embutidos) e **não** é conteúdo
publicável; fica fora da validação e não deve ser editado como página do site.

---

## 14. Mídia

- O hero usa `assets/images/og-image.webp` (fallback `.png`) como arte de fundo, sob
  gradiente escuro.
- Thumbnails de blog em `<picture>` com WebP + fallback JPG, `loading="lazy"`,
  `decoding="async"`, `width`/`height` explícitos.
- Imagens muito coloridas devem dar lugar, quando houver material real, a screenshots,
  bancadas, dashboards, terminais ou diagramas em paleta sóbria.

---

## 15. Conteúdo por Markdown

Páginas de `blog/` e `projetos/` são **geradas** de `assets/conteudo/`. Editar o `.md`
de origem e rodar `npm run build:content` — nunca editar o HTML gerado à mão (o próximo
build sobrescreve).

- Frontmatter aceito: `title`, `heading`, `subtitle`, `description`, `pageTitle`,
  `author`, `displayAuthor`, `category`, `tags`, `date`, `slug`, `cover`, `coverAlt`,
  `status`, `featured`, `featuredOrder`, `readingTime`.
- Itens públicos (`status: "publicado"`) exigem `date` válida.
- Markdown suportado: títulos, parágrafos, listas, tabelas, links, citações (uma linha),
  código inline, blocos de código e o bloco `:::article-cta … :::`.
- Tom exigido para conteúdo institucional: humano, pessoal, calmo, tecnicamente honesto.
  Sem linguagem comercial, sem métricas inventadas, com as lacunas declaradas.
