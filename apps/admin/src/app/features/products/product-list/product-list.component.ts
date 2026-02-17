import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  startWith,
  combineLatest,
  map
} from 'rxjs';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';

type FilterType = 'all' | 'brazilian' | 'foreign';

/**
 * Componente de listagem de produtos demonstrando:
 * - RxJS operators (debounceTime, distinctUntilChanged, switchMap)
 * - Angular Signals para estado local
 * - Paginação e ordenação client-side
 * - Reactive Forms para busca
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatCardModule
  ],
  template: `
    <div class="product-list-container">
      <header class="page-header">
        <div class="header-content">
          <h1>Gerenciar Produtos</h1>
          <p>{{ productService.stats().total }} produtos cadastrados</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/products/new">
          <mat-icon>add</mat-icon>
          Novo Produto
        </a>
      </header>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <!-- Search Input com RxJS -->
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar produtos</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input
                matInput
                [formControl]="searchControl"
                placeholder="Digite para buscar..."
              />
              @if (searchControl.value) {
                <button matSuffix mat-icon-button (click)="searchControl.reset()">
                  <mat-icon>close</mat-icon>
                </button>
              }
            </mat-form-field>

            <!-- Origin Filter -->
            <mat-button-toggle-group
              [value]="filterType()"
              (change)="setFilter($event.value)"
            >
              <mat-button-toggle value="all">
                Todos ({{ productService.stats().total }})
              </mat-button-toggle>
              <mat-button-toggle value="brazilian">
                🇧🇷 Brasileiros ({{ productService.stats().brazilian }})
              </mat-button-toggle>
              <mat-button-toggle value="foreign">
                🌍 Estrangeiros ({{ productService.stats().foreign }})
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading -->
      @if (productService.loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Carregando produtos...</p>
        </div>
      } @else {
        <!-- Table -->
        <mat-card class="table-card">
          <table mat-table [dataSource]="paginatedProducts()" matSort (matSortChange)="sortData($event)">
            <!-- Logo Column -->
            <ng-container matColumnDef="logo">
              <th mat-header-cell *matHeaderCellDef>Logo</th>
              <td mat-cell *matCellDef="let product">
                <div class="product-logo">
                  @if (product.logo?.startsWith('http')) {
                    <img [src]="product.logo" [alt]="product.name" />
                  } @else {
                    <span class="emoji-logo">{{ product.logo || '📦' }}</span>
                  }
                </div>
              </td>
            </ng-container>

            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
              <td mat-cell *matCellDef="let product">
                <div class="product-name">
                  <strong>{{ product.name }}</strong>
                  @if (product.companyInfo?.foundedYear) {
                    <small>Fundada em {{ product.companyInfo.foundedYear }}</small>
                  }
                </div>
              </td>
            </ng-container>

            <!-- Tags Column -->
            <ng-container matColumnDef="tags">
              <th mat-header-cell *matHeaderCellDef>Tags</th>
              <td mat-cell *matCellDef="let product">
                <div class="tags-container">
                  @for (tag of product.tags?.slice(0, 3); track tag) {
                    <mat-chip>{{ tag }}</mat-chip>
                  }
                  @if (product.tags?.length > 3) {
                    <mat-chip>+{{ product.tags.length - 3 }}</mat-chip>
                  }
                </div>
              </td>
            </ng-container>

            <!-- Origin Column -->
            <ng-container matColumnDef="origin">
              <th mat-header-cell *matHeaderCellDef>Origem</th>
              <td mat-cell *matCellDef="let product">
                <span class="origin-badge" [class.brazilian]="productService.isBrazilian(product)">
                  {{ productService.getCountryFlag(product) }}
                  {{ product.location?.country || 'N/A' }}
                </span>
              </td>
            </ng-container>

            <!-- Featured Column -->
            <ng-container matColumnDef="featured">
              <th mat-header-cell *matHeaderCellDef>Destaque</th>
              <td mat-cell *matCellDef="let product">
                <button
                  mat-icon-button
                  [matTooltip]="product.isFeatured ? 'Remover destaque' : 'Destacar'"
                  (click)="toggleFeatured(product)"
                >
                  <mat-icon [class.featured]="product.isFeatured">
                    {{ product.isFeatured ? 'star' : 'star_border' }}
                  </mat-icon>
                </button>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let product">
                <a mat-icon-button [routerLink]="['/products', product.id, 'edit']" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </a>
                <button mat-icon-button color="warn" matTooltip="Excluir" (click)="confirmDelete(product)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <!-- No Data Row -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">
                Nenhum produto encontrado para "{{ searchControl.value }}"
              </td>
            </tr>
          </table>

          <mat-paginator
            [length]="filteredProducts().length"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25, 50]"
            [pageIndex]="pageIndex()"
            (page)="handlePageEvent($event)"
            showFirstLastButtons
          >
          </mat-paginator>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .header-content h1 {
        margin: 0;
        font-size: 2rem;
      }

      .header-content p {
        margin: 4px 0 0;
        color: #666;
      }
    }

    .filters-card {
      margin-bottom: 24px;
    }

    .filters-row {
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 300px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;

      p {
        margin-top: 16px;
        color: #666;
      }
    }

    .table-card {
      overflow: hidden;
    }

    table {
      width: 100%;
    }

    .product-logo {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 8px;

      img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: 4px;
      }

      .emoji-logo {
        font-size: 1.5rem;
      }
    }

    .product-name {
      display: flex;
      flex-direction: column;

      small {
        color: #666;
        font-size: 0.85rem;
      }
    }

    .tags-container {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;

      mat-chip {
        font-size: 0.75rem;
      }
    }

    .origin-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: #f5f5f5;
      border-radius: 16px;
      font-size: 0.875rem;

      &.brazilian {
        background: #e8f5ef;
        color: #107047;
      }
    }

    mat-icon.featured {
      color: #e6b422;
    }

    .no-data {
      text-align: center;
      padding: 24px;
      color: #666;
    }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);

  // Controle de busca com RxJS
  searchControl = new FormControl('');

  // Signals para estado local
  filterType = signal<FilterType>('all');
  pageIndex = signal(0);
  pageSize = signal(10);
  sortField = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Subject para cleanup
  private destroy$ = new Subject<void>();

  displayedColumns = ['logo', 'name', 'tags', 'origin', 'featured', 'actions'];

  // Computed: produtos filtrados por tipo e busca
  filteredProducts = computed(() => {
    let products = this.productService.products();
    const filter = this.filterType();
    const search = this.searchControl.value?.toLowerCase() || '';

    // Filtrar por origem
    if (filter === 'brazilian') {
      products = products.filter(p => this.productService.isBrazilian(p));
    } else if (filter === 'foreign') {
      products = products.filter(p => !this.productService.isBrazilian(p));
    }

    // Filtrar por busca
    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.tags?.some(t => t.toLowerCase().includes(search))
      );
    }

    // Ordenar
    const field = this.sortField() as keyof Product;
    const direction = this.sortDirection();
    products = [...products].sort((a, b) => {
      const aValue = a[field] ?? '';
      const bValue = b[field] ?? '';
      const comparison = String(aValue).localeCompare(String(bValue));
      return direction === 'asc' ? comparison : -comparison;
    });

    return products;
  });

  // Computed: produtos paginados
  paginatedProducts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredProducts().slice(start, end);
  });

  ngOnInit(): void {
    // Carrega produtos
    this.productService.loadProducts().subscribe();

    // Setup busca com debounce (RxJS)
    // Isso demonstra o uso de operadores RxJS importantes
    this.searchControl.valueChanges.pipe(
      debounceTime(300),           // Espera 300ms após digitação
      distinctUntilChanged(),      // Só emite se valor mudou
      takeUntil(this.destroy$)     // Cleanup automático
    ).subscribe(() => {
      // Reset página ao buscar
      this.pageIndex.set(0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFilter(filter: FilterType): void {
    this.filterType.set(filter);
    this.pageIndex.set(0);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  sortData(sort: Sort): void {
    this.sortField.set(sort.active);
    this.sortDirection.set(sort.direction || 'asc');
  }

  toggleFeatured(product: Product): void {
    this.productService.toggleFeatured(product.id, !product.isFeatured).subscribe(() => {
      // Recarrega para atualizar
      this.productService.loadProducts().subscribe();
    });
  }

  confirmDelete(product: Product): void {
    if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      this.productService.delete(product.id).subscribe(() => {
        this.productService.loadProducts().subscribe();
      });
    }
  }
}
