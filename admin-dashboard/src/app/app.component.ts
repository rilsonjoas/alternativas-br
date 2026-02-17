import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from './core/services/auth.service';
import { AnalyticsService } from './core/services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    @if (authService.isAuthenticated()) {
      <!-- Layout com Sidebar (usuário logado) -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav mode="side" opened class="sidenav">
          <div class="sidenav-header">
            <h2>🇧🇷 AlternativasBR</h2>
            <span class="subtitle">Admin Dashboard</span>
          </div>

          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>

            <a mat-list-item routerLink="/products" routerLinkActive="active">
              <mat-icon matListItemIcon>inventory_2</mat-icon>
              <span matListItemTitle>Produtos</span>
            </a>

            <mat-divider></mat-divider>

            <a mat-list-item href="https://alternativas-br.vercel.app" target="_blank">
              <mat-icon matListItemIcon>open_in_new</mat-icon>
              <span matListItemTitle>Ver Site</span>
            </a>
          </mat-nav-list>

          <div class="sidenav-footer">
            <!-- User info -->
            @if (authService.user(); as user) {
              <div class="user-info">
                @if (user.photoURL) {
                  <img [src]="user.photoURL" [alt]="user.displayName" class="user-avatar" />
                } @else {
                  <mat-icon class="user-avatar-icon">account_circle</mat-icon>
                }
                <span class="user-name">{{ user.displayName || user.email }}</span>
              </div>
            }

            <button
              mat-stroked-button
              class="logout-btn"
              (click)="logout()"
              matTooltip="Sair da conta"
            >
              <mat-icon>logout</mat-icon>
              Sair
            </button>
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet />
        </mat-sidenav-content>
      </mat-sidenav-container>
    } @else {
      <!-- Sem sidebar (página de login) -->
      <router-outlet />
    }
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, #107047 0%, #0a5535 100%);
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidenav-header {
      padding: 24px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);

      h2 {
        margin: 0;
        font-size: 1.5rem;
      }

      .subtitle {
        opacity: 0.8;
        font-size: 0.875rem;
      }
    }

    mat-nav-list {
      flex: 1;
      padding-top: 16px;

      a {
        color: rgba(255,255,255,0.9);
        margin: 4px 12px;
        border-radius: 8px;

        &:hover {
          background: rgba(255,255,255,0.1);
        }

        &.active {
          background: rgba(255,255,255,0.2);
          color: white;
        }

        mat-icon {
          color: rgba(255,255,255,0.8);
        }
      }

      mat-divider {
        margin: 16px 0;
        border-color: rgba(255,255,255,0.1);
      }
    }

    .sidenav-footer {
      padding: 16px;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 12px;

      .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-bottom: 8px;
        border: 2px solid rgba(255,255,255,0.3);
      }

      .user-avatar-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        opacity: 0.8;
      }

      .user-name {
        font-size: 0.875rem;
        opacity: 0.9;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .logout-btn {
      width: 100%;
      color: white !important;
      border-color: rgba(255,255,255,0.5) !important;
      --mdc-outlined-button-label-text-color: white !important;
      --mdc-text-button-label-text-color: white !important;

      mat-icon {
        margin-right: 8px;
        color: white !important;
      }

      &:hover {
        background: rgba(255,255,255,0.15);
        border-color: white !important;
      }
    }

    .main-content {
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private analytics = inject(AnalyticsService);

  constructor() {
    // Inicializa Google Analytics 4
    this.analytics.init();
  }

  logout(): void {
    this.analytics.logLogout();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
