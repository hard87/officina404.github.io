# Design system - Officina 404

Este documento registra os tokens auditados e consolidados em `css/style.css`. O tema oficial do site e escuro por padrao. Light mode fica fora do escopo atual para preservar a identidade dark, tecnica e industrial da marca.

## Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-bg` | `#04050a` | Fundo principal |
| `--color-surface` | `#0d111a` | Cards, formularios e superficies |
| `--color-surface-muted` | `#161b26` | Inputs e superficies secundarias |
| `--color-surface-raised` | `#111722` | Elementos elevados e skip link |
| `--color-border` | `#232b37` | Bordas neutras |
| `--color-border-strong` | `rgba(46, 211, 140, 0.38)` | Bordas de destaque |
| `--color-text` | `#f2f4f7` | Texto principal |
| `--color-muted` | `#99a4b6` | Texto de apoio |
| `--color-accent` | `#2ed38c` | Acento primario |
| `--color-accent-dark` | `#22a571` | Hover do acento |
| `--color-warm` | `#c96d2f` | Acento cobre da marca |
| `--color-success` | `#6ff5be` | Feedback positivo |
| `--color-warning` | `#f4b860` | Alertas futuros |
| `--color-danger` | `#ff8e8e` | Erros |
| `--color-danger-strong` | `#ea6b6b` | Bordas de erro |
| `--color-focus` | `#7cf6bd` | Foco visivel |

## Tipografia

| Token | Valor | Uso |
| --- | --- | --- |
| `--font-sans` | `Inter`, `Segoe UI`, system UI | Texto e interface |
| `--font-mono` | `JetBrains Mono`, `Courier New`, monospace | Marca, labels, tags e metadados |
| `--text-xs` | `0.78rem` | Badges, datas e microcopy |
| `--text-sm` | `0.86rem` | Feedback e metadados |
| `--text-base` | `1rem` | Corpo |
| `--text-md` | `1.05rem` | Artigos |
| `--text-lg` | `1.2rem` | Titulos de cards |
| `--line-tight` | `1.25` | Headings compactos |
| `--line-base` | `1.6` | Texto geral |
| `--line-relaxed` | `1.82` | Artigos longos |

## Espacamento

| Token | Valor |
| --- | --- |
| `--spacing-xs` | `0.5rem` |
| `--spacing-sm` | `1rem` |
| `--spacing-md` | `1.5rem` |
| `--spacing-lg` | `2.5rem` |
| `--spacing-xl` | `3.5rem` |
| `--spacing-2xl` | `5rem` |

## Forma, sombra e movimento

| Token | Valor | Uso |
| --- | --- | --- |
| `--radius-xs` | `4px` | Foco e detalhes |
| `--radius-base` | `8px` | Inputs e blocos |
| `--radius-card` | `8px` | Cards |
| `--radius-pill` | `999px` | Tags, botoes e nav pills |
| `--shadow-soft` | `0 10px 30px rgba(0, 0, 0, 0.35)` | Sombras discretas |
| `--shadow-card` | `0 18px 42px rgba(0, 0, 0, 0.38)` | Cards elevados |
| `--duration-fast` | `0.16s` | Estados rapidos |
| `--duration-base` | `0.28s` | Transicoes principais |
| `--duration-slow` | `0.55s` | Reveals com scroll |
| `--easing-standard` | `ease` | Curva padrao |

## Estados interativos auditados

- Links, botoes, itens de navegacao, cards clicaveis, campos e tabela rolavel usam `:focus-visible` com foco claro.
- Hover preserva a identidade verde/cobre e usa `transform` ou `opacity` quando ha movimento.
- `:disabled`, `aria-busy`, `.is-submitting`, `.field-error`, `.is-success` e `.is-error` estao padronizados para formularios.
- O hover do logo continua herdando o comportamento de link da marca, preservando a interacao existente.

## Midia

- O hero usa `assets/images/og-image.webp` como versao leve da arte principal, com fallback para `og-image.png`.
- Thumbnails do blog seguem preparadas em `<picture>` com WebP e fallback JPG.
- Imagens de blog mais coloridas devem ser substituidas futuramente por screenshots, bancadas, dashboards, terminais ou diagramas em paleta sobria quando houver material real.
