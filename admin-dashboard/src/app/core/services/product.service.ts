import { Injectable, signal, computed } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { BaseFirestoreService } from './base-firestore.service';
import { Product } from '../../shared/models/product.model';

export interface ProductStats {
  total: number;
  brazilian: number;
  foreign: number;
  featured: number;
}

/**
 * Serviço de produtos que estende o CRUD genérico.
 * Adiciona lógica específica para produtos brasileiros vs estrangeiros.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseFirestoreService<Product> {
  // Signals para estado reativo (Angular 17+)
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal(false);

  // Computed values derivados dos signals
  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly stats = computed<ProductStats>(() => {
    const products = this.productsSignal();
    return {
      total: products.length,
      brazilian: products.filter(p => this.isBrazilian(p)).length,
      foreign: products.filter(p => !this.isBrazilian(p)).length,
      featured: products.filter(p => p.isFeatured).length
    };
  });

  readonly brazilianProducts = computed(() =>
    this.productsSignal().filter(p => this.isBrazilian(p))
  );

  readonly foreignProducts = computed(() =>
    this.productsSignal().filter(p => !this.isBrazilian(p))
  );

  constructor() {
    super('products');
  }

  /**
   * Carrega todos os produtos e atualiza o signal
   */
  loadProducts(): Observable<Product[]> {
    this.loadingSignal.set(true);

    return this.getAll().pipe(
      tap(products => {
        this.productsSignal.set(products);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Busca produtos por nome (para autocomplete/busca)
   */
  searchByName(term: string): Observable<Product[]> {
    // Firestore não suporta busca parcial, então filtramos no cliente
    return this.getAll().pipe(
      map(products =>
        products.filter(p =>
          p.name.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  /**
   * Retorna produtos em destaque
   */
  getFeatured(): Observable<Product[]> {
    return this.query(
      this.whereEqual('isFeatured', true),
      this.limitTo(10)
    );
  }

  /**
   * Retorna apenas produtos brasileiros
   */
  getBrazilianProducts(): Observable<Product[]> {
    return this.query(
      this.whereEqual('location.country', 'Brasil')
    );
  }

  /**
   * Toggle destaque do produto
   */
  toggleFeatured(id: string, isFeatured: boolean): Observable<void> {
    return this.update(id, { isFeatured });
  }

  /**
   * Verifica se o produto é brasileiro
   */
  isBrazilian(product: Product): boolean {
    const country = product.location?.country?.toLowerCase() || '';
    return country === 'brasil' || country === 'brazil' || country === 'br';
  }

  /**
   * Retorna a bandeira do país (emoji)
   */
  getCountryFlag(product: Product): string {
    if (product.location?.flag) {
      return product.location.flag;
    }
    return this.isBrazilian(product) ? '🇧🇷' : '🌍';
  }
}
