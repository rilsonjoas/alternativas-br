import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * Serviço de Analytics com Google Analytics 4.
 *
 * Rastreia:
 * - Page views automáticos (via Router events)
 * - Eventos customizados (CRUD, login, etc.)
 *
 * O GA4 é carregado via script no index.html.
 * Este serviço fornece uma API tipada para eventos.
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private router = inject(Router);
  private initialized = false;

  // Usar o mesmo ID do projeto React
  private readonly GA_MEASUREMENT_ID = 'G-7FTVYGNH79';

  /**
   * Inicializa o GA4 e configura tracking automático de page views
   */
  init(): void {
    if (this.initialized || !environment.production) {
      return;
    }

    // Carregar script do GA4
    this.loadGtagScript();

    // Rastrear mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEvent = event as NavigationEnd;
      this.logPageView(navEvent.urlAfterRedirects);
    });

    this.initialized = true;
  }

  /**
   * Carrega o script do Google Analytics 4
   */
  private loadGtagScript(): void {
    // Criar script do gtag
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Inicializar dataLayer e gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.GA_MEASUREMENT_ID, {
      send_page_view: false // Vamos enviar manualmente
    });
  }

  /**
   * Registra uma visualização de página
   */
  logPageView(path?: string): void {
    if (!environment.production) {
      console.log('[Analytics] Page view:', path || window.location.pathname);
      return;
    }

    window.gtag?.('event', 'page_view', {
      page_path: path || window.location.pathname,
      page_title: document.title
    });
  }

  /**
   * Registra um evento customizado
   */
  logEvent(eventName: string, params?: Record<string, unknown>): void {
    if (!environment.production) {
      console.log('[Analytics] Event:', eventName, params);
      return;
    }

    window.gtag?.('event', eventName, params);
  }

  // ===== Eventos específicos do Admin =====

  /**
   * Evento: Login realizado
   */
  logLogin(method: 'email' | 'google'): void {
    this.logEvent('login', { method });
  }

  /**
   * Evento: Logout realizado
   */
  logLogout(): void {
    this.logEvent('logout');
  }

  /**
   * Evento: Produto criado
   */
  logProductCreated(productName: string): void {
    this.logEvent('product_created', {
      product_name: productName,
      content_type: 'product'
    });
  }

  /**
   * Evento: Produto atualizado
   */
  logProductUpdated(productId: string, productName: string): void {
    this.logEvent('product_updated', {
      product_id: productId,
      product_name: productName,
      content_type: 'product'
    });
  }

  /**
   * Evento: Produto deletado
   */
  logProductDeleted(productId: string): void {
    this.logEvent('product_deleted', {
      product_id: productId,
      content_type: 'product'
    });
  }

  /**
   * Evento: Busca realizada
   */
  logSearch(searchTerm: string, resultsCount: number): void {
    this.logEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  /**
   * Evento: Filtro aplicado
   */
  logFilter(filterType: string, filterValue: string): void {
    this.logEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue
    });
  }
}
