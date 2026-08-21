# AlternativasBR

Plataforma curada pra descobrir softwares e serviços nacionais que rivalizam
com as melhores ferramentas internacionais — fortalece o ecossistema tech
brasileiro com um catálogo de produtos 100% brasileiros.

🔗 [alternativasbr.com.br](https://www.alternativasbr.com.br/)

## Por que isto existe

Quem procura uma ferramenta boa parte pra opção internacional por padrão, mesmo quando existe alternativa nacional tão boa quanto — não por falta de qualidade, mas por falta de descoberta. O ecossistema de tech brasileiro tem produto de verdade sendo feito; falta o catálogo que coloca isso lado a lado do concorrente gringo, pra quem tá decidindo o que usar.

Este é também um dos projetos que fazem parte de uma prioridade concreta de 2026: consolidar portfólio real em produção como parte de crescimento profissional deliberado — não é só vitrine, é engenharia de verdade (monorepo, Firebase, admin próprio) resolvendo um problema real de descoberta.

Hoje é um catálogo curado no ar. A visão de futuro é crescer em cobertura de categoria e virar referência de primeira busca antes de "existe algo brasileiro que faz X?" virar pergunta.

## Estrutura (monorepo pnpm)

- `apps/web` — site público (React + Vite)
- `apps/admin` — painel administrativo (Angular)

Ambos usam Firebase (Firestore + Auth) como backend.

## Rodando localmente

```bash
pnpm install
pnpm dev:web     # site público
pnpm dev:admin   # painel admin
```

## Build

```bash
pnpm build       # builda os dois apps
```
