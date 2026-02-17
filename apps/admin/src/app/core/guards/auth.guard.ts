import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional para proteger rotas que exigem autenticação.
 * Redireciona para /login se o usuário não estiver autenticado.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se ainda está carregando, aguarda
  if (authService.loading()) {
    return true;
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para login
  router.navigate(['/login']);
  return false;
};
