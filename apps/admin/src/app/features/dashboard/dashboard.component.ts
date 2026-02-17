import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Gerencie todos os produtos da plataforma AlternativasBR</p>
      </header>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <a mat-raised-button color="primary" routerLink="/products">
          <mat-icon>inventory_2</mat-icon>
          Gerenciar Produtos
        </a>
        <a mat-raised-button color="accent" routerLink="/products/new">
          <mat-icon>add</mat-icon>
          Novo Produto
        </a>
      </div>

      <!-- Loading State -->
      @if (productService.loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Carregando estatísticas...</p>
        </div>
      } @else {
        <!-- Statistics Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card stat-total">
            <mat-card-header>
              <mat-icon mat-card-avatar>bar_chart</mat-icon>
              <mat-card-title>{{ productService.stats().total }}</mat-card-title>
              <mat-card-subtitle>Total de Produtos</mat-card-subtitle>
            </mat-card-header>
          </mat-card>

          <mat-card class="stat-card stat-brazilian">
            <mat-card-header>
              <span mat-card-avatar class="flag-avatar">🇧🇷</span>
              <mat-card-title>{{ productService.stats().brazilian }}</mat-card-title>
              <mat-card-subtitle>Brasileiros</mat-card-subtitle>
            </mat-card-header>
          </mat-card>

          <mat-card class="stat-card stat-foreign">
            <mat-card-header>
              <span mat-card-avatar class="flag-avatar">🌍</span>
              <mat-card-title>{{ productService.stats().foreign }}</mat-card-title>
              <mat-card-subtitle>Estrangeiros</mat-card-subtitle>
            </mat-card-header>
          </mat-card>

          <mat-card class="stat-card stat-featured">
            <mat-card-header>
              <mat-icon mat-card-avatar>star</mat-icon>
              <mat-card-title>{{ productService.stats().featured }}</mat-card-title>
              <mat-card-subtitle>Em Destaque</mat-card-subtitle>
            </mat-card-header>
          </mat-card>
        </div>
      }

      <!-- Info Card -->
      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>info</mat-icon>
          <mat-card-title>Sobre este Dashboard</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            Este painel administrativo foi desenvolvido em <strong>Angular 18</strong>
            como projeto de estudo, demonstrando:
          </p>
          <ul>
            <li><strong>Standalone Components</strong> - Arquitetura moderna sem NgModules</li>
            <li><strong>Signals</strong> - Estado reativo nativo do Angular</li>
            <li><strong>AngularFire</strong> - Integração com Firebase/Firestore</li>
            <li><strong>Lazy Loading</strong> - Carregamento sob demanda de rotas</li>
            <li><strong>Angular Material</strong> - Design system enterprise</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 32px;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 8px;
        color: #107047;
      }

      p {
        color: #666;
        font-size: 1.1rem;
      }
    }

    .quick-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 32px;

      a {
        display: flex;
        align-items: center;
        gap: 8px;
      }
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      text-align: center;

      mat-card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
      }

      mat-card-title {
        font-size: 2.5rem !important;
        font-weight: bold;
        margin: 8px 0 !important;
      }

      mat-icon[mat-card-avatar], .flag-avatar {
        font-size: 2rem;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .stat-total {
      border-left: 4px solid #107047;
      mat-icon { color: #107047; }
      mat-card-title { color: #107047; }
    }

    .stat-brazilian {
      border-left: 4px solid #2b8c58;
      mat-card-title { color: #2b8c58; }
    }

    .stat-foreign {
      border-left: 4px solid #5cb98c;
      mat-card-title { color: #5cb98c; }
    }

    .stat-featured {
      border-left: 4px solid #e6b422;
      mat-icon { color: #e6b422; }
      mat-card-title { color: #e6b422; }
    }

    .info-card {
      mat-card-content {
        padding-top: 16px;

        ul {
          margin-top: 12px;
          padding-left: 20px;

          li {
            margin-bottom: 8px;
          }
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  productService = inject(ProductService);

  ngOnInit(): void {
    // Carrega os produtos para calcular as estatísticas
    this.productService.loadProducts().subscribe();
  }
}
