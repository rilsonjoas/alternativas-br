import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser
} from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();

  // Signals para estado de autenticação
  private userSignal = signal<AppUser | null>(null);
  private loadingSignal = signal(true);

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  constructor() {
    // Configurar Google Provider
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
    this.googleProvider.setCustomParameters({ prompt: 'select_account' });

    // Listener para mudanças de autenticação
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        this.userSignal.set(this.mapUser(firebaseUser));
      } else {
        this.userSignal.set(null);
      }
      this.loadingSignal.set(false);
    });
  }

  private mapUser(firebaseUser: FirebaseUser): AppUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    };
  }

  /**
   * Login com email e senha
   */
  loginWithEmail(email: string, password: string): Observable<AppUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(credential => this.mapUser(credential.user))
    );
  }

  /**
   * Login com Google
   */
  loginWithGoogle(): Observable<AppUser> {
    return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
      map(credential => this.mapUser(credential.user))
    );
  }

  /**
   * Logout
   */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Traduz erros do Firebase para português
   */
  getErrorMessage(errorCode: string): string {
    const messages: Record<string, string> = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Conta desabilitada',
      'auth/too-many-requests': 'Muitas tentativas. Aguarde.',
      'auth/network-request-failed': 'Erro de conexão',
      'auth/invalid-credential': 'Credenciais inválidas',
      'auth/popup-closed-by-user': 'Login cancelado',
      'auth/popup-blocked': 'Popup bloqueado pelo navegador'
    };
    return messages[errorCode] || 'Erro ao fazer login';
  }
}
