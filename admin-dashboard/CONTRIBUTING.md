# Guia de Contribuição - Admin Dashboard

Bem-vindo ao painel administrativo do AlternativasBR! Este guia vai te ajudar a configurar o ambiente e contribuir com o projeto.

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Setup do Ambiente](#setup-do-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rodando o Projeto](#rodando-o-projeto)
- [Padrões de Código](#padrões-de-código)
- [Padrões de Commit](#padrões-de-commit)
- [Fluxo de Trabalho](#fluxo-de-trabalho)
- [Testes](#testes)
- [Dúvidas Frequentes](#dúvidas-frequentes)

---

## Pré-requisitos

Certifique-se de ter instalado:

| Ferramenta | Versão Mínima | Verificar |
|------------|---------------|-----------|
| Node.js | 18.x | `node -v` |
| pnpm | 8.x | `pnpm -v` |
| Angular CLI | 18.x | `ng version` |
| Git | 2.x | `git --version` |

### Instalando dependências globais

```bash
# Instalar pnpm (se não tiver)
npm install -g pnpm

# Instalar Angular CLI (se não tiver)
npm install -g @angular/cli
```

---

## Setup do Ambiente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd alternativas-br/admin-dashboard
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

O projeto usa Firebase. As credenciais já estão configuradas em `src/environments/`.

Para desenvolvimento local, não é necessário configurar nada adicional.

### 4. Rode o projeto

```bash
pnpm start
# ou
ng serve --port 4201
```

Acesse: http://localhost:4201

---

## Estrutura do Projeto

```
src/app/
├── core/                    # Serviços singleton e guards
│   ├── guards/
│   │   └── auth.guard.ts    # Proteção de rotas
│   └── services/
│       ├── auth.service.ts      # Autenticação Firebase
│       ├── product.service.ts   # CRUD de produtos
│       ├── analytics.service.ts # Google Analytics 4
│       └── base-firestore.service.ts  # CRUD genérico
│
├── features/                # Módulos por funcionalidade
│   ├── auth/
│   │   └── login/           # Página de login
│   ├── dashboard/           # Dashboard principal
│   └── products/
│       ├── product-list/    # Listagem de produtos
│       └── product-form/    # Formulário de produto
│
├── shared/                  # Componentes e utilitários reutilizáveis
│   ├── components/
│   │   └── generic-table/   # Tabela genérica <T>
│   ├── models/
│   │   └── product.model.ts # Interfaces TypeScript
│   ├── pipes/
│   └── directives/
│
├── app.component.ts         # Layout principal
├── app.config.ts            # Configuração (Firebase, etc)
└── app.routes.ts            # Rotas com lazy loading
```

### Convenções de nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes | `kebab-case` | `product-list.component.ts` |
| Serviços | `camelCase` + `.service.ts` | `auth.service.ts` |
| Interfaces | `PascalCase` | `Product`, `ColumnConfig<T>` |
| Signals | `camelCase` + sufixo descritivo | `loadingSignal`, `productsSignal` |

---

## Rodando o Projeto

### Desenvolvimento

```bash
pnpm start          # Servidor de dev (http://localhost:4201)
pnpm build          # Build de produção
pnpm test           # Rodar testes unitários
pnpm lint           # Verificar código
```

### Portas

| Serviço | Porta |
|---------|-------|
| Admin Angular | 4201 |
| Site React | 5173 |
| Firebase Emulator | 8080 |

---

## Padrões de Código

### TypeScript

- Use `strict: true` (já configurado)
- Prefira `interface` sobre `type` para objetos
- Use Generics para código reutilizável

```typescript
// ✅ Bom: Service genérico
export abstract class BaseFirestoreService<T extends { id?: string }> {
  abstract collectionName: string;

  getAll(): Observable<T[]> { ... }
}

// ❌ Ruim: Service sem tipagem
export class DataService {
  getAll(): Observable<any[]> { ... }
}
```

### Angular

- Use **Standalone Components** (sem NgModules)
- Prefira **Signals** sobre BehaviorSubject para estado local
- Use **inject()** ao invés de constructor injection

```typescript
// ✅ Bom: Signals + inject
export class MyComponent {
  private service = inject(MyService);
  loading = signal(false);
  data = computed(() => this.service.items());
}

// ❌ Ruim: Decoradores antigos
export class MyComponent {
  constructor(private service: MyService) {}
  loading = new BehaviorSubject(false);
}
```

### RxJS

- Use operadores para evitar múltiplas requisições
- Sempre faça unsubscribe (ou use `takeUntilDestroyed`)

```typescript
// ✅ Bom: Busca com debounce
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.service.search(term)),
  takeUntilDestroyed()
).subscribe();
```

### CSS/SCSS

- Use variáveis CSS do tema (`var(--br-primary)`)
- Prefira flexbox/grid sobre floats
- Mobile-first quando aplicável

---

## Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos permitidos

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (não afeta código) |
| `refactor` | Refatoração |
| `test` | Testes |
| `chore` | Manutenção (deps, configs) |

### Exemplos

```bash
# Nova feature
git commit -m "feat(products): adicionar filtro por categoria"

# Correção
git commit -m "fix(auth): corrigir redirect após login"

# Documentação
git commit -m "docs: atualizar README com instruções de setup"
```

---

## Fluxo de Trabalho

### 1. Crie uma branch

```bash
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/descricao-do-bug
```

### 2. Faça suas alterações

- Escreva código seguindo os padrões
- Adicione/atualize testes se necessário
- Verifique com `pnpm lint`

### 3. Commit e push

```bash
git add .
git commit -m "feat(escopo): descrição"
git push origin feat/nome-da-feature
```

### 4. Abra um Pull Request

- Descreva o que foi feito
- Adicione screenshots se for UI
- Aguarde review

---

## Testes

### Rodar testes

```bash
pnpm test              # Watch mode
pnpm test:ci           # Single run (CI)
pnpm test:coverage     # Com cobertura
```

### Estrutura de testes

```typescript
describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return products', () => {
    // ...
  });
});
```

---

## Dúvidas Frequentes

### Como adicionar uma nova página?

1. Crie o componente em `src/app/features/nome-feature/`
2. Adicione a rota em `app.routes.ts` com lazy loading
3. Proteja com `authGuard` se necessário

```typescript
{
  path: 'nova-pagina',
  loadComponent: () => import('./features/nova/nova.component').then(m => m.NovaComponent),
  canActivate: [authGuard]
}
```

### Como usar o Firebase?

O Firebase já está configurado. Use os serviços:

```typescript
// Injetar serviço
private productService = inject(ProductService);

// Usar
this.productService.getAll().subscribe(products => {
  console.log(products);
});
```

### Como debugar?

1. Abra DevTools (F12)
2. Use `console.log` ou breakpoints
3. Para RxJS, use o operador `tap`:

```typescript
this.data$.pipe(
  tap(data => console.log('Debug:', data)),
  // ...
)
```

---

## Contato

Dúvidas? Abra uma issue ou entre em contato com o mantenedor do projeto.

---

**Bom código!** 🇧🇷
