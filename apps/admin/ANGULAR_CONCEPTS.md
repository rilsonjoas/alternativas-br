# Conceitos Angular Implementados

Este documento explica como cada conceito avançado do Angular foi implementado neste projeto, servindo como referência técnica e material de estudo.

---

## Sumário

1. [Standalone Components](#1-standalone-components)
2. [Signals (Angular 17+)](#2-signals-angular-17)
3. [Reactive Forms](#3-reactive-forms)
4. [RxJS Operators](#4-rxjs-operators)
5. [Generics TypeScript](#5-generics-typescript)
6. [Dependency Injection](#6-dependency-injection)
7. [Route Guards](#7-route-guards)
8. [Lazy Loading](#8-lazy-loading)
9. [AngularFire (Firebase)](#9-angularfire-firebase)
10. [Google Analytics 4](#10-google-analytics-4)

---

## 1. Standalone Components

### O que é?
A partir do Angular 14+, componentes podem ser **standalone**, ou seja, não precisam pertencer a um NgModule. Isso simplifica a arquitetura e melhora o tree-shaking.

### Como foi implementado?

**Arquivo:** `src/app/features/dashboard/dashboard.component.ts`

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,  // ← Componente standalone
  imports: [         // ← Importa dependências diretamente
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `...`,
  styles: [`...`]
})
export class DashboardComponent implements OnInit {
  // ...
}
```

### Por que usar?
- **Menos boilerplate**: Não precisa criar/manter NgModules
- **Melhor tree-shaking**: Bundler sabe exatamente o que é usado
- **Mais simples**: Cada componente é auto-contido

### Onde está no projeto?
Todos os componentes do projeto são standalone:
- `app.component.ts`
- `dashboard.component.ts`
- `product-list.component.ts`
- `product-form.component.ts`
- `login.component.ts`
- `generic-table.component.ts`

---

## 2. Signals (Angular 17+)

### O que é?
Signals são primitivos reativos que notificam automaticamente quando seu valor muda. São mais simples que RxJS para estado local e melhoram a performance com change detection granular.

### Como foi implementado?

**Arquivo:** `src/app/core/services/product.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService extends BaseFirestoreService<Product> {
  // Signals privados (escrita)
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal(false);

  // Signals públicos (somente leitura)
  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  // Computed: valores derivados que atualizam automaticamente
  readonly stats = computed<ProductStats>(() => {
    const products = this.productsSignal();
    return {
      total: products.length,
      brazilian: products.filter(p => this.isBrazilian(p)).length,
      foreign: products.filter(p => !this.isBrazilian(p)).length,
      featured: products.filter(p => p.isFeatured).length
    };
  });

  // Atualizar signal
  loadProducts(): Observable<Product[]> {
    this.loadingSignal.set(true);  // ← set() para atualizar

    return this.getAll().pipe(
      tap(products => {
        this.productsSignal.set(products);
        this.loadingSignal.set(false);
      })
    );
  }
}
```

**Arquivo:** `src/app/features/products/product-list/product-list.component.ts`

```typescript
export class ProductListComponent {
  // Signals para estado local do componente
  filterType = signal<FilterType>('all');
  pageIndex = signal(0);
  pageSize = signal(10);
  sortField = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed: filtra e ordena produtos automaticamente
  filteredProducts = computed(() => {
    let products = this.productService.products();
    const filter = this.filterType();

    if (filter === 'brazilian') {
      products = products.filter(p => this.productService.isBrazilian(p));
    }
    // ...
    return products;
  });

  // Computed: pagina os produtos filtrados
  paginatedProducts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredProducts().slice(start, end);
  });

  // Atualizar signal em evento
  setFilter(filter: FilterType): void {
    this.filterType.set(filter);  // ← Atualiza, UI reage automaticamente
    this.pageIndex.set(0);
  }
}
```

### Usando no template

```html
<!-- Lendo signal (note os parênteses) -->
@if (productService.loading()) {
  <mat-spinner></mat-spinner>
}

<!-- Iterando computed -->
@for (product of paginatedProducts(); track product.id) {
  <tr>{{ product.name }}</tr>
}

<!-- Stats computados -->
<span>Total: {{ productService.stats().total }}</span>
```

### Por que usar?
- **Mais simples que RxJS** para estado local
- **Performance**: Change detection granular
- **Computed**: Valores derivados sem boilerplate

---

## 3. Reactive Forms

### O que é?
Reactive Forms são formulários onde a lógica está no TypeScript, não no template. Permitem validação complexa, transformações e melhor testabilidade.

### Como foi implementado?

**Arquivo:** `src/app/features/products/product-form/product-form.component.ts`

#### 3.1 FormGroup com grupos aninhados

```typescript
private initForm(): void {
  this.form = this.fb.group({
    // Campos simples
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    website: ['', [Validators.required, urlValidator]],  // ← Validador customizado
    logo: [''],

    // FormGroup aninhado: location
    location: this.fb.group({
      country: ['', Validators.required],
      state: [''],
      city: [''],
      flag: ['']
    }),

    // FormGroup aninhado: companyInfo
    companyInfo: this.fb.group({
      foundedYear: [null, foundedYearValidator],  // ← Validador customizado
      size: ['startup']
    }),

    // FormGroup aninhado: pricing
    pricing: this.fb.group({
      type: ['freemium'],
      currency: ['BRL'],
      description: ['']
    }),

    // FormArrays para listas dinâmicas
    features: this.fb.array([]),
    tags: this.fb.array([]),

    isFeatured: [false]
  });
}
```

#### 3.2 Validadores Customizados

```typescript
/**
 * Validador customizado: verifica se URL é válida
 */
function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  try {
    new URL(control.value);
    return null;  // ← Válido
  } catch {
    return { invalidUrl: true };  // ← Inválido, retorna erro
  }
}

/**
 * Validador customizado: ano de fundação válido
 */
function foundedYearValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const year = Number(control.value);
  const currentYear = new Date().getFullYear();

  if (year < 1800 || year > currentYear) {
    return { invalidYear: { min: 1800, max: currentYear } };
  }

  return null;
}
```

#### 3.3 FormArray para campos dinâmicos

```typescript
// Getter para acessar o FormArray
get features(): FormArray {
  return this.form.get('features') as FormArray;
}

get tags(): FormArray {
  return this.form.get('tags') as FormArray;
}

// Adicionar item ao array
addFeature(): void {
  this.features.push(this.fb.control(''));
}

// Remover item do array
removeFeature(index: number): void {
  this.features.removeAt(index);
}
```

#### 3.4 Template com feedback de erros

```html
<mat-form-field appearance="outline">
  <mat-label>Website</mat-label>
  <input matInput formControlName="website" placeholder="https://..." />

  <!-- Mensagens de erro condicionais -->
  @if (form.get('website')?.hasError('required')) {
    <mat-error>Website é obrigatório</mat-error>
  }
  @if (form.get('website')?.hasError('invalidUrl')) {
    <mat-error>URL inválida</mat-error>
  }
</mat-form-field>

<!-- FormGroup aninhado -->
<div formGroupName="location">
  <mat-form-field>
    <mat-label>País</mat-label>
    <mat-select formControlName="country">
      <mat-option value="Brasil">🇧🇷 Brasil</mat-option>
      <!-- ... -->
    </mat-select>
  </mat-form-field>
</div>

<!-- FormArray dinâmico -->
<div formArrayName="features">
  @for (feature of features.controls; track $index) {
    <div class="array-item">
      <input matInput [formControlName]="$index" />
      <button mat-icon-button (click)="removeFeature($index)">
        <mat-icon>remove_circle</mat-icon>
      </button>
    </div>
  }
</div>
```

### Por que usar?
- **Validação complexa**: Validadores síncronos e assíncronos
- **Testabilidade**: Lógica no TypeScript, fácil de testar
- **Transformações**: Manipular dados antes de enviar
- **FormArray**: Campos dinâmicos (adicionar/remover)

---

## 4. RxJS Operators

### O que é?
RxJS é a biblioteca de programação reativa do Angular. Operadores transformam, filtram e combinam streams de dados.

### Como foi implementado?

**Arquivo:** `src/app/features/products/product-list/product-list.component.ts`

#### 4.1 Busca com debounce

```typescript
ngOnInit(): void {
  // Busca reativa com debounce
  this.searchControl.valueChanges.pipe(
    debounceTime(300),        // ← Espera 300ms após parar de digitar
    distinctUntilChanged(),   // ← Só emite se valor mudou
    takeUntil(this.destroy$)  // ← Cleanup automático
  ).subscribe(() => {
    this.pageIndex.set(0);    // Reset página ao buscar
  });
}

ngOnDestroy(): void {
  this.destroy$.next();       // ← Emite para cancelar subscriptions
  this.destroy$.complete();
}
```

#### 4.2 Operadores usados

| Operador | Propósito | Arquivo |
|----------|-----------|---------|
| `debounceTime(300)` | Espera 300ms após última emissão | product-list |
| `distinctUntilChanged()` | Ignora valores duplicados | product-list |
| `switchMap()` | Cancela requisição anterior | auth.service |
| `takeUntil()` | Unsubscribe automático | product-list |
| `tap()` | Side effects sem transformar | product.service |
| `map()` | Transforma valores | auth.service |
| `filter()` | Filtra emissões | analytics.service |
| `from()` | Converte Promise para Observable | base-firestore |

#### 4.3 Exemplo com switchMap

**Arquivo:** `src/app/core/services/auth.service.ts`

```typescript
loginWithEmail(email: string, password: string): Observable<AppUser> {
  return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
    map(credential => this.mapUser(credential.user))  // ← Transforma resultado
  );
}
```

### Por que usar?
- **Evita requisições desnecessárias**: debounce + distinctUntilChanged
- **Cancela requisições antigas**: switchMap
- **Cleanup automático**: takeUntil
- **Composição**: Combinar múltiplos streams

---

## 5. Generics TypeScript

### O que é?
Generics permitem criar código reutilizável que funciona com qualquer tipo, mantendo type safety.

### Como foi implementado?

**Arquivo:** `src/app/core/services/base-firestore.service.ts`

```typescript
/**
 * Serviço base genérico para CRUD no Firestore.
 * T deve ter um campo 'id' opcional.
 */
export abstract class BaseFirestoreService<T extends { id?: string }> {
  protected firestore = inject(Firestore);
  protected collectionRef: CollectionReference;

  constructor(protected collectionName: string) {
    this.collectionRef = collection(this.firestore, collectionName);
  }

  // Métodos genéricos que funcionam com qualquer tipo T

  getAll(): Observable<T[]> {
    return collectionData(this.collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  getById(id: string): Observable<T | undefined> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return docData(docRef, { idField: 'id' }) as Observable<T | undefined>;
  }

  create(data: Omit<T, 'id'>): Observable<string> {  // ← Omit remove 'id' do tipo
    const dataWithTimestamp = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return from(addDoc(this.collectionRef, dataWithTimestamp)).pipe(
      map((docRef: DocumentReference) => docRef.id)
    );
  }

  update(id: string, data: Partial<T>): Observable<void> {  // ← Partial torna campos opcionais
    const docRef = doc(this.firestore, this.collectionName, id);
    return from(updateDoc(docRef, { ...data, updatedAt: Timestamp.now() }));
  }

  delete(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(docRef));
  }
}
```

**Arquivo:** `src/app/core/services/product.service.ts`

```typescript
// Extende o serviço genérico com tipo específico
@Injectable({ providedIn: 'root' })
export class ProductService extends BaseFirestoreService<Product> {
  constructor() {
    super('products');  // ← Nome da coleção no Firestore
  }

  // Métodos específicos de Product
  getFeatured(): Observable<Product[]> {
    return this.query(this.whereEqual('isFeatured', true));
  }

  isBrazilian(product: Product): boolean {
    // ...
  }
}
```

**Arquivo:** `src/app/shared/components/generic-table/generic-table.component.ts`

```typescript
// Interfaces genéricas para configuração
export interface ColumnConfig<T> {
  key: keyof T | string;        // ← keyof T garante que key existe em T
  label: string;
  sortable?: boolean;
  format?: (value: unknown, item: T) => string;
}

export interface ActionConfig<T> {
  icon: string;
  label: string;
  action: (item: T) => void;    // ← Callback tipado
  show?: (item: T) => boolean;
}

// Componente genérico
@Component({...})
export class GenericTableComponent<T extends Record<string, unknown>> {
  @Input() data: T[] = [];
  @Input() columns: ColumnConfig<T>[] = [];
  @Input() actions: ActionConfig<T>[] = [];

  @Output() rowClick = new EventEmitter<T>();  // ← Emite tipo T
}
```

### Por que usar?
- **Reutilização**: Um serviço/componente para qualquer entidade
- **Type Safety**: Erros de tipo em compile-time
- **IntelliSense**: Autocomplete funciona corretamente
- **DRY**: Não repetir código para cada entidade

---

## 6. Dependency Injection

### O que é?
DI é um padrão onde dependências são injetadas em vez de criadas. Angular gerencia o ciclo de vida dos serviços.

### Como foi implementado?

#### 6.1 Função inject() (moderno)

```typescript
// ✅ Forma moderna (Angular 14+)
export class ProductListComponent {
  productService = inject(ProductService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
}
```

#### 6.2 providedIn: 'root' (Singleton)

```typescript
@Injectable({
  providedIn: 'root'  // ← Singleton em toda aplicação
})
export class ProductService {
  // ...
}
```

#### 6.3 Providers no app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),

    // Firebase providers
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
```

### Por que usar?
- **Desacoplamento**: Componentes não criam dependências
- **Testabilidade**: Fácil mockar serviços
- **Singleton**: Uma instância compartilhada
- **Lazy loading**: Serviços carregados sob demanda

---

## 7. Route Guards

### O que é?
Guards protegem rotas, permitindo ou bloqueando acesso baseado em condições (autenticação, permissões, etc.).

### Como foi implementado?

**Arquivo:** `src/app/core/guards/auth.guard.ts`

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional (Angular 15+) para proteger rotas.
 * Redireciona para /login se não autenticado.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;  // ← Permite acesso
  }

  // Redireciona para login
  router.navigate(['/login']);
  return false;  // ← Bloqueia acesso
};
```

**Arquivo:** `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
    // ← Sem guard, rota pública
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]  // ← Protegida com guard
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component')
      .then(m => m.ProductListComponent),
    canActivate: [authGuard]  // ← Protegida com guard
  }
];
```

### Por que usar?
- **Segurança**: Protege rotas sensíveis
- **UX**: Redireciona automaticamente
- **Separação**: Lógica de autorização isolada

---

## 8. Lazy Loading

### O que é?
Lazy loading carrega módulos/componentes sob demanda, reduzindo o bundle inicial e melhorando o tempo de carregamento.

### Como foi implementado?

**Arquivo:** `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    // ← loadComponent carrega apenas quando acessar a rota
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component')
        .then(m => m.ProductListComponent)
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./features/products/product-form/product-form.component')
        .then(m => m.ProductFormComponent)
  }
];
```

### Resultado no build

```
Lazy chunk files    | Names                  |  Raw size
chunk-...js         | product-list-component | 273.64 kB   ← Carregado sob demanda
chunk-...js         | product-form-component | 122.51 kB   ← Carregado sob demanda
chunk-...js         | login-component        |  11.61 kB   ← Carregado sob demanda
chunk-...js         | dashboard-component    |  10.84 kB   ← Carregado sob demanda
```

### Por que usar?
- **Performance**: Bundle inicial menor
- **Velocidade**: Carrega só o necessário
- **UX**: Primeira renderização mais rápida

---

## 9. AngularFire (Firebase)

### O que é?
AngularFire é a biblioteca oficial para integrar Firebase com Angular, fornecendo Observables e injeção de dependência.

### Como foi implementado?

**Arquivo:** `src/app/app.config.ts`

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    // Firebase providers
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
```

**Arquivo:** `src/app/core/services/base-firestore.service.ts`

```typescript
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';

export abstract class BaseFirestoreService<T> {
  protected firestore = inject(Firestore);  // ← Injeta Firestore

  getAll(): Observable<T[]> {
    // collectionData retorna Observable que atualiza em tempo real
    return collectionData(this.collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  create(data: Omit<T, 'id'>): Observable<string> {
    // from() converte Promise para Observable
    return from(addDoc(this.collectionRef, data)).pipe(
      map(docRef => docRef.id)
    );
  }
}
```

**Arquivo:** `src/app/core/services/auth.service.ts`

```typescript
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from '@angular/fire/auth';

export class AuthService {
  private auth = inject(Auth);  // ← Injeta Auth

  loginWithGoogle(): Observable<AppUser> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      map(credential => this.mapUser(credential.user))
    );
  }
}
```

### Por que usar?
- **Observables**: Integração natural com Angular
- **Real-time**: Atualizações automáticas do Firestore
- **DI**: Injeção de dependência padrão Angular

---

## 10. Google Analytics 4

### O que é?
GA4 é a versão mais recente do Google Analytics, focada em eventos e medição cross-platform.

### Como foi implementado?

**Arquivo:** `src/app/core/services/analytics.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  private readonly GA_MEASUREMENT_ID = 'G-7FTVYGNH79';

  /**
   * Inicializa GA4 e configura tracking automático
   */
  init(): void {
    if (!environment.production) return;

    // Carrega script do GA4
    this.loadGtagScript();

    // Rastreia mudanças de rota automaticamente
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.logPageView((event as NavigationEnd).urlAfterRedirects);
    });
  }

  /**
   * Registra visualização de página
   */
  logPageView(path?: string): void {
    window.gtag?.('event', 'page_view', {
      page_path: path || window.location.pathname
    });
  }

  /**
   * Eventos específicos do admin
   */
  logProductCreated(productName: string): void {
    this.logEvent('product_created', { product_name: productName });
  }

  logProductUpdated(productId: string): void {
    this.logEvent('product_updated', { product_id: productId });
  }

  logLogin(method: 'email' | 'google'): void {
    this.logEvent('login', { method });
  }
}
```

**Arquivo:** `src/app/app.component.ts`

```typescript
export class AppComponent {
  private analytics = inject(AnalyticsService);

  constructor() {
    // Inicializa GA4 ao carregar a aplicação
    this.analytics.init();
  }

  logout(): void {
    this.analytics.logLogout();  // ← Registra evento
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
```

### Por que usar?
- **Métricas**: Entender uso da aplicação
- **Eventos**: Rastrear ações específicas (CRUD, login)
- **Debug**: Console.log em dev, GA4 em prod

---

## Resumo

| Conceito | Benefício Principal |
|----------|---------------------|
| Standalone Components | Menos boilerplate, melhor tree-shaking |
| Signals | Estado reativo simples, performance |
| Reactive Forms | Validação complexa, testabilidade |
| RxJS | Controle de fluxo assíncrono |
| Generics | Código reutilizável e tipado |
| Dependency Injection | Desacoplamento, testabilidade |
| Route Guards | Segurança de rotas |
| Lazy Loading | Performance, bundle menor |
| AngularFire | Integração Firebase com Observables |
| Google Analytics | Métricas de uso |

---

## Próximos Passos

Para aprofundar, explore:

1. **Signals avançados**: `effect()`, `untracked()`
2. **RxJS avançado**: `combineLatest`, `forkJoin`, `retry`
3. **Forms avançados**: Validação assíncrona, cross-field validation
4. **State Management**: NgRx ou SignalStore
5. **Testing**: Jest, Cypress, Testing Library

---

**Criado como material de estudo para demonstrar domínio de Angular em nível Pleno.**
