# Roadmap de Engenharia — AlternativasBR

Primeiro roadmap de engenharia formal deste projeto — antes só existia o
`README.md` de produto. Segue o padrão comum documentado em
`hetzner-infra/PADRAO-DE-ENGENHARIA.md`. Levantamento real feito em
2026-08-22, minerado do histórico de commits (51 no total) e da nota
`AlternativasBR.md` no vault, não escrito do zero.

---

## P0 — Segurança

- [x] **Security Rules do Firestore formalizadas (2026-08-31)**:
      Criado o arquivo `firestore.rules` e `firebase.json` garantindo leitura pública para o catálogo e restrição de escrita apenas para administradores autenticados.
- [x] **Audit de vulnerabilidades isolado por aplicativo (2026-08-31)**:
      Auditado e atualizadas as dependências do `apps/web`.

## P1 — Infra & Deploy

- [x] `apps/web` no Vercel — confirmado no ar (`200 OK`, testado
      2026-08-08)
- [x] Firebase (Firestore + Auth) — gerenciado pelo Google, sem VPS
      próprio pra essa parte
- [x] `apps/admin` (Angular) — Instruções e comandos de build/deploy documentados no `README.md` (2026-08-31)

## P2 — Saúde & Resiliência

- [x] **Error Boundary global em React (2026-08-31)**: Componente de fallback adicionado no `apps/web` para resguardar a aplicação contra crash de runtime.

## P3 — CI/CD

- [x] `.github/workflows/ci.yml` + `lighthouse.yml` existem e
      funcionam — histórico real de correções (pnpm v10 no CI, lint
      `no-explicit-any`, Lighthouse com threshold relaxado pra warning
      em vez de quebrar o build, aria-labels nos botões de
      compartilhar). Achado do dia (2026-08-08): CI quebrada desde
      julho por `environment.ts` do admin Angular lendo `process.env`
      (não existe em runtime de bundle Angular) — corrigido, nunca
      afetou produção (o `environment.prod.ts` já tinha o valor certo
      hardcoded, só dev/CI quebrava)

## P4 — Testes

- [x] **Cobertura de testes expandida no `apps/web` (2026-08-31)**:
      Testes criados para componentes de busca, filtros, cartões de produto e badges (24 testes passando no Vitest).

## P5 — Monitoramento & Logs

- [x] **Abordagem leve definida (2026-08-31)**:
      Sentry descartado por overengineering para o porte do projeto. Definido uso de **Uptime Kuma** para monitoramento externo de disponibilidade HTTP (ping 200 OK no site) combinado com o `ErrorBoundary` nativo no client-side.

## P6 — Backups & Recuperação

- N/A — dado vive no Firestore (Google gerencia a durabilidade), sem
  banco próprio que precise de rotina de backup deste lado

## P7 — UI/UX, acessibilidade e SEO

- [x] **Saga de SEO/AdSense, resolvida (2026-08-20)** — histórico bem
      documentado, real trabalho de várias sessões:
      - **Diagnóstico inicial**: AdSense rejeitou por "conteúdo de
        baixo valor" — é SPA 100% client-side, Googlebot via
        `<div id="root"></div>` vazio em toda página
      - **Solução**: `scripts/prerender.ts` busca dados do Firestore
        no build e gera HTML estático com conteúdo real dentro do
        `#root` — quando o JS carrega, React hidrata por cima. Sem
        Puppeteer (abandonado — falhava no CI por acesso ao Firestore)
      - Sitemap corrigido: tinha só 4 URLs (incluindo, por engano,
        `/admin` público — painel interno não deveria estar num
        sitemap). Reescrito pra buscar os produtos reais do Firestore:
        foi de 4 pra 55 URLs
      - Canonical duplicado removido, redirect 301 `/explorar` →
        `/alternativas`, og/twitter tags duplicadas do Vite removidas
      - Prerender resiliente: timeout de 15s + `exit 0` em falha (CI
        nunca quebra por falta de acesso ao Firestore)
      - Estado: deploy no Vercel, submetido ao Google, aguardando
        aprovação do AdSense (2026-08-20)
- [x] **Acessibilidade auditada e coberta (2026-08-31)**:
      Validado via Lighthouse CI (contraste, aria-labels, navegação) e testes unitários nos componentes de interface.

## P8 — Funcionalidades / entrega de valor

- Fora do escopo de engenharia — roadmap de produto (sugerir
  ferramenta, comparativos lado-a-lado, newsletter) fica só no
  `README.md`/vault
- **Nota estrutural**: `apps/admin` carrega dois objetivos diferentes
  no mesmo lugar — painel administrativo real do catálogo (produto) e
  um "Lab Angular" declarado como prática técnica pra vaga específica
  (Reactive Forms, RxJS, Signals). Não é bug, mas vale ter claro: se um
  dia o admin real crescer, considerar separar do que é
  prática/portfólio de Angular

## P9 — Documentação

- [x] Este arquivo, criado agora (2026-08-22) — gap identificado numa
      auditoria dos 10 projetos pessoais ativos, era o único (junto
      com nenhum outro, depois de conferir Bíblia na Arte que na
      verdade já tinha `docs/ROADMAP.md`) sem roadmap de engenharia
- [x] README documenta onde/como o `apps/admin` é deployado (2026-08-31)

---

## Ordem recomendada

Igual aos outros projetos: risco real primeiro. Nessa ordem:

1. **P0** — confirmar Security Rules do Firestore (bloqueador real de
   segurança, mesmo que a chave em si não seja o problema) e isolar o
   audit de vulnerabilidades pra saber o que é real
2. **P4** — testes, é o segundo gap mais concreto
3. **P1/P8** — documentar onde o admin roda, decidir se separa do "Lab
   Angular"
4. Resto conforme aparecer necessidade
