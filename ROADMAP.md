# Roadmap de Engenharia — AlternativasBR

Primeiro roadmap de engenharia formal deste projeto — antes só existia o
`README.md` de produto. Segue o padrão comum documentado em
`hetzner-infra/PADRAO-DE-ENGENHARIA.md`. Levantamento real feito em
2026-08-22, minerado do histórico de commits (51 no total) e da nota
`AlternativasBR.md` no vault, não escrito do zero.

---

## P0 — Segurança

- [ ] **Achado real — chave do Firebase commitada em 7 lugares do
      histórico** (mesmo valor, `AIzaSyBiUNvJc-...`, em
      `apps/admin/src/environments/`, `apps/web/scripts/prerender.ts`,
      `apps/web/scripts/generate-docs-sitemap.js`, versões antigas de
      `admin-dashboard/` e `src/lib/firebase-config.ts`). **Não é um
      segredo no sentido tradicional** — API key web do Firebase é
      *feita* pra ser pública: todo SDK client-side do Firebase expõe
      essa chave no bundle JS por design (ela identifica o projeto, não
      autentica acesso privilegiado). A segurança real vem das
      **Security Rules do Firestore**, não de esconder a chave. Ainda
      assim, dois pontos não confirmados que valem checar:
      1. As Security Rules do Firestore realmente restringem
         leitura/escrita como deveriam? (não auditado)
      2. A chave tem restrição de domínio/referrer configurada no
         Google Cloud Console, pra impedir uso da mesma chave por outro
         site? (não confirmado)
- [ ] **Achado real — 108 vulnerabilidades reportadas (`pnpm audit
      --prod`), 3 críticas**. Number real, mas **não confiável como
      está**: o monorepo pnpm compartilha um lockfile só, então o
      audit mistura dependências do `apps/web` (o que vai pro público)
      com as do `apps/admin` (Angular CLI, toolchain de build) — a
      maioria das críticas encontradas (`node-tar`, `protobufjs`,
      `shell-quote`) aparenta vir do Angular CLI/Firebase Admin
      tooling, não do bundle que o navegador do usuário carrega, mas
      isso não foi isolado de verdade ainda. Próximo passo: auditar
      `apps/web` isolado (workspace filter ou lockfile próprio) pra
      saber o que é risco real de produção vs. ruído de dev tooling.

## P1 — Infra & Deploy

- [x] `apps/web` no Vercel — confirmado no ar (`200 OK`, testado
      2026-08-08)
- [x] Firebase (Firestore + Auth) — gerenciado pelo Google, sem VPS
      próprio pra essa parte
- [ ] `apps/admin` (Angular) — onde roda em produção não está
      documentado em lugar nenhum (README não menciona deploy do
      admin, só do web)

## P2 — Saúde & Resiliência

- [ ] Não auditado

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

- [ ] Só 4 arquivos de teste em `apps/web` — gap real, sem cobertura
      da lógica de negócio (catálogo, busca, prerender)

## P5 — Monitoramento & Logs

- [ ] Não auditado — sem Sentry (ou equivalente) confirmado em nenhum
      dos dois apps

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
- [ ] Acessibilidade — não auditada além do que o Lighthouse CI já
      cobre (contraste, aria-labels nos botões de compartilhar)

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
- [ ] README não documenta onde/como o `apps/admin` é deployado (ver P1)

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
