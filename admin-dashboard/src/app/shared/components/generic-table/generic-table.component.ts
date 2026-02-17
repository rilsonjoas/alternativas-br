import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnChanges,
  SimpleChanges,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Configuração de coluna para a tabela genérica
 */
export interface ColumnConfig<T> {
  /** Chave do campo no objeto */
  key: keyof T | string;
  /** Label exibido no header */
  label: string;
  /** Se a coluna é ordenável */
  sortable?: boolean;
  /** Função para formatar o valor */
  format?: (value: unknown, item: T) => string;
  /** Template customizado para a célula */
  template?: string;
  /** Largura da coluna (ex: '100px', '20%') */
  width?: string;
}

/**
 * Configuração de ação para cada linha
 */
export interface ActionConfig<T> {
  icon: string;
  label: string;
  color?: 'primary' | 'accent' | 'warn';
  action: (item: T) => void;
  show?: (item: T) => boolean;
}

/**
 * Componente de tabela genérica reutilizável.
 *
 * Demonstra uso avançado de Generics em Angular:
 * - Input/Output tipados com T
 * - ColumnConfig<T> para configuração flexível
 * - Computed signals para filtragem/paginação
 *
 * @example
 * ```html
 * <app-generic-table
 *   [data]="products()"
 *   [columns]="columns"
 *   [actions]="actions"
 *   [loading]="loading()"
 *   [searchPlaceholder]="'Buscar produtos...'"
 *   (rowClick)="onRowClick($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule
  ],
  template: `
    <mat-card class="table-container">
      <!-- Search -->
      @if (searchable) {
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>{{ searchPlaceholder }}</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [formControl]="searchControl" />
          @if (searchControl.value) {
            <button matSuffix mat-icon-button (click)="searchControl.reset()">
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>
      }

      <!-- Loading -->
      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <!-- Table -->
        <div class="table-wrapper">
          <table mat-table [dataSource]="paginatedData()" matSort (matSortChange)="onSort($event)">

            <!-- Dynamic Columns -->
            @for (column of columns; track column.key) {
              <ng-container [matColumnDef]="column.key.toString()">
                <th mat-header-cell *matHeaderCellDef
                    [mat-sort-header]="column.sortable ? column.key.toString() : ''"
                    [disabled]="!column.sortable"
                    [style.width]="column.width">
                  {{ column.label }}
                </th>
                <td mat-cell *matCellDef="let item" [style.width]="column.width">
                  @if (column.template && cellTemplates[column.template]) {
                    <ng-container
                      [ngTemplateOutlet]="cellTemplates[column.template]"
                      [ngTemplateOutletContext]="{ $implicit: item, column: column }">
                    </ng-container>
                  } @else if (column.format) {
                    {{ column.format(getValue(item, column.key), item) }}
                  } @else {
                    {{ getValue(item, column.key) }}
                  }
                </td>
              </ng-container>
            }

            <!-- Actions Column -->
            @if (actions.length > 0) {
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef style="width: 120px">Ações</th>
                <td mat-cell *matCellDef="let item">
                  <div class="actions-cell">
                    @for (action of actions; track action.label) {
                      @if (!action.show || action.show(item)) {
                        <button
                          mat-icon-button
                          [color]="action.color"
                          [matTooltip]="action.label"
                          (click)="action.action(item); $event.stopPropagation()">
                          <mat-icon>{{ action.icon }}</mat-icon>
                        </button>
                      }
                    }
                  </div>
                </td>
              </ng-container>
            }

            <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
            <tr mat-row
                *matRowDef="let row; columns: displayedColumns();"
                [class.clickable]="rowClickable"
                (click)="onRowClick(row)">
            </tr>

            <!-- Empty State -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell empty-row" [attr.colspan]="displayedColumns().length">
                @if (searchControl.value) {
                  Nenhum resultado para "{{ searchControl.value }}"
                } @else {
                  {{ emptyMessage }}
                }
              </td>
            </tr>
          </table>
        </div>

        <!-- Paginator -->
        @if (paginated) {
          <mat-paginator
            [length]="filteredData().length"
            [pageSize]="pageSize()"
            [pageSizeOptions]="pageSizeOptions"
            [pageIndex]="pageIndex()"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        }
      }
    </mat-card>
  `,
  styles: [`
    .table-container {
      overflow: hidden;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
      margin: 16px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    .actions-cell {
      display: flex;
      gap: 4px;
    }

    tr.clickable {
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    }

    .empty-row {
      text-align: center;
      padding: 48px !important;
      color: #666;
    }
  `]
})
export class GenericTableComponent<T extends Record<string, unknown>> implements OnChanges {
  // Inputs
  @Input() data: T[] = [];
  @Input() columns: ColumnConfig<T>[] = [];
  @Input() actions: ActionConfig<T>[] = [];
  @Input() loading = false;
  @Input() searchable = true;
  @Input() searchPlaceholder = 'Buscar...';
  @Input() searchFields: (keyof T)[] = [];
  @Input() paginated = true;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Input() defaultPageSize = 10;
  @Input() rowClickable = false;
  @Input() emptyMessage = 'Nenhum dado encontrado';
  @Input() cellTemplates: Record<string, TemplateRef<unknown>> = {};

  // Outputs
  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<Sort>();

  // State
  searchControl = new FormControl('');
  pageIndex = signal(0);
  pageSize = signal(this.defaultPageSize);
  sortField = signal<string>('');
  sortDirection = signal<'asc' | 'desc' | ''>('');

  // Computed: colunas exibidas
  displayedColumns = computed(() => {
    const cols = this.columns.map(c => c.key.toString());
    if (this.actions.length > 0) {
      cols.push('actions');
    }
    return cols;
  });

  // Computed: dados filtrados
  filteredData = computed(() => {
    let result = [...this.data];
    const search = this.searchControl.value?.toLowerCase() || '';

    // Filtrar por busca
    if (search && this.searchFields.length > 0) {
      result = result.filter(item =>
        this.searchFields.some(field => {
          const value = item[field];
          return String(value).toLowerCase().includes(search);
        })
      );
    }

    // Ordenar
    const field = this.sortField();
    const direction = this.sortDirection();
    if (field && direction) {
      result.sort((a, b) => {
        const aVal = a[field as keyof T];
        const bVal = b[field as keyof T];
        const comparison = String(aVal).localeCompare(String(bVal));
        return direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  });

  // Computed: dados paginados
  paginatedData = computed(() => {
    if (!this.paginated) {
      return this.filteredData();
    }
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredData().slice(start, end);
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultPageSize']) {
      this.pageSize.set(this.defaultPageSize);
    }
  }

  getValue(item: T, key: keyof T | string): unknown {
    // Suporta nested keys como "location.country"
    const keys = String(key).split('.');
    let value: unknown = item;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value ?? '-';
  }

  onSort(sort: Sort): void {
    this.sortField.set(sort.active);
    this.sortDirection.set(sort.direction);
    this.sortChange.emit(sort);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onRowClick(item: T): void {
    if (this.rowClickable) {
      this.rowClick.emit(item);
    }
  }
}
