# AlternativasBR

Plataforma curada pra descobrir softwares e serviços nacionais que rivalizam
com as melhores ferramentas internacionais — fortalece o ecossistema tech
brasileiro com um catálogo de produtos 100% brasileiros.

🔗 [alternativasbr.com.br](https://www.alternativasbr.com.br/)

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
