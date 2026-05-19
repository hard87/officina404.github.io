# Officina 404

Officina 404 é a marca pessoal que conecta hardware, software, IoT, infraestrutura e segurança com o rigor de um laboratório técnico profissional.
Esta versão refatorada prioriza clareza da proposta, estética minimalista industrial-tech e manutenção escalável sem abrir mão da identidade autoral.

---

## Visão técnica

- Apresentar a proposta de valor da Officina 404 em segundos, destacando áreas de atuação e projetos estratégicos.
- Manter a presença de JavaScript modular (menu, formulários e animações discretas) sem recorrer a efeitos cenográficos.
- Organizar CSS em tokens, componentes e seções para garantir consistência e facilidade de extensão futura.
- Conservar boas práticas de SEO, semântica e acessibilidade: navegação com `aria`, foco visível, `prefers-reduced-motion` e contrastes adequados.
- Tratar a prova social como evidência verificável, sem métricas, logos ou depoimentos fictícios.

---

## Estrutura principal

```
/index.html            ← homepage refinada com hero claro, áreas de atuação e projetos estratégicos
/css/style.css        ← tokens, base, layout, componentes, seções e utilitários organizados em blocos claros
/js/main.js           ← ponto de entrada, controla menu, smooth scroll, formulários e inicializa os módulos
/js/modules/         ← módulos JavaScript reutilizáveis (menu, navegação, animações, validações)
/404.html             ← página 404 útil e sóbria alinhada à nova identidade
/em-construcao.html   ← placeholder técnico explicando o que está em revisão
/assets/              ← imagens e ícones usados pela homepage e seções auxiliares
/docs/design-system.md ← tokens, estados e decisões visuais auditadas
```

---

## CSS e design tokens

- **Tokens:** `:root` concentra paleta escura (#04050a, #0d111a, #2ed38c, cobre), estados semânticos e espaçamentos (`--spacing-*`), bordas (`--radius-*`) e sombras.
- **Organização:** o arquivo segue sequência lógica: tokens → reset/base → layout → header → hero → seções específicas → componentes (botões, cards, tags, formulários) → estados e utilitários.
- **Componentização:** classes como `.btn`, `.project-card`, `.area-card`, `.evidence-card`, `.tag`, `.hero-cta` e `[data-animate]` foram projetadas para reaproveitamento.
- **Acessibilidade:** contém foco visível, `prefers-reduced-motion` e regras para impressão.
- **Referência:** os tokens auditados estão documentados em `docs/design-system.md`.

---

## JavaScript modular

- `menu.js`: controla o menu móvel com `aria-expanded`, rótulo dinâmico, foco no botão e fechamento automático.
- `scroll-animations.js`: revela cards com `IntersectionObserver` e desliga animações quando a preferência é reduzida.
- `form-validation.js`: validações de nome, email e mensagem, detecção básica de palavras ofensivas e mensagens de feedback.
- `contact-form.js`: valida dados, aplica honeypot e usa endpoint configurado ou fallback seguro por email.
- `main.js`: inicializa os módulos, habilita smooth scroll com ajuste do header fixo e valida formulários.

---

## Páginas auxiliares

- `404.html`: mantém o branding e oferece caminhos rápidos para home/projetos.
- `em-construcao.html`: explica os itens em revisão e aponta para contato imediato.

---

## Publicação e segurança

- As páginas usam CSP via `<meta>` como defesa mínima para hospedagem estática. Em produção, prefira enviar CSP, `X-Content-Type-Options`, `Permissions-Policy` e demais headers pela infraestrutura.
- O formulário não simula entrega quando não há backend: ele valida localmente e abre um email de fallback para `contato@officina404.com.br`.
- Para captura real, configure `data-form-endpoint` no formulário e libere o domínio correspondente em `connect-src`.
- A página de teste local foi removida da superfície pública para evitar exposição de artefatos internos.

---

## Próximos passos sugeridos

1. Criar templates para blog e páginas de projeto reutilizando a mesma estrutura (cards, grids, tokens).
2. Adicionar testes automáticos (lighthouse, CSS lint) para garantir contraste e performance.
3. Integrar formulários com serviço de backend ou Netlify/Forms para captura real.
4. Reforçar documentação de design tokens em um arquivo separado se o projeto crescer.

---

> Esta base foi construída para escalar: mantenha o padrão de tokens, documente novas classes e preserve a clareza do conteúdo técnico.
