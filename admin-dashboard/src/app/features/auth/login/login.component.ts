import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="logo">🇧🇷</div>
          <mat-card-title>AlternativasBR</mat-card-title>
          <mat-card-subtitle>Painel Administrativo</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Error message -->
          @if (error()) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              {{ error() }}
            </div>
          }

          <!-- Login Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" formControlName="email" />
              @if (form.get('email')?.hasError('required')) {
                <mat-error>Email é obrigatório</mat-error>
              }
              @if (form.get('email')?.hasError('email')) {
                <mat-error>Email inválido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input
                matInput
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword.set(!hidePassword())"
              >
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.hasError('required')) {
                <mat-error>Senha é obrigatória</mat-error>
              }
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width login-btn"
              [disabled]="loading()"
            >
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Entrar
              }
            </button>
          </form>

          <mat-divider class="divider">
            <span>ou</span>
          </mat-divider>

          <!-- Google Login -->
          <button
            mat-stroked-button
            class="full-width google-btn"
            (click)="loginWithGoogle()"
            [disabled]="loading()"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            Entrar com Google
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #107047 0%, #0a5535 50%, #1d2e27 100%);
      padding: 24px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 32px;

      mat-card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 32px;

        .logo {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        mat-card-title {
          font-size: 1.75rem;
          color: #107047;
        }

        mat-card-subtitle {
          font-size: 1rem;
        }
      }
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #ffebee;
      color: #c62828;
      border-radius: 8px;
      margin-bottom: 16px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .full-width {
      width: 100%;
    }

    .login-btn {
      margin-top: 16px;
      padding: 12px;
      font-size: 1rem;
    }

    .divider {
      margin: 24px 0;
      display: flex;
      align-items: center;

      span {
        padding: 0 16px;
        color: #666;
        font-size: 0.875rem;
      }
    }

    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px;

      img {
        width: 20px;
        height: 20px;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  hidePassword = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;

    this.authService.loginWithEmail(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(this.authService.getErrorMessage(err.code));
        this.loading.set(false);
      }
    });
  }

  loginWithGoogle(): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(this.authService.getErrorMessage(err.code));
        this.loading.set(false);
      }
    });
  }
}
