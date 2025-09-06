import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';

class AuthService {
  private googleProvider = new GoogleAuthProvider();

  constructor() {
    // Configurar Google Provider
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
    
    // Configurações adicionais para produção
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  // Converter Firebase User para nosso User
  private async mapFirebaseUserToUser(firebaseUser: FirebaseUser): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      createdAt: userData?.createdAt?.toDate() || new Date(),
      role: userData?.role || 'user',
      preferences: userData?.preferences || {
        categories: [],
        notifications: true
      }
    };
  }

  // Criar documento do usuário no Firestore
  private async createUserDocument(firebaseUser: FirebaseUser, additionalData: Record<string, unknown> = {}) {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date(),
        role: 'user',
        preferences: {
          categories: [],
          notifications: true
        },
        ...additionalData
      };

      await setDoc(userRef, userData);
    }

    return userRef;
  }

  // Registrar com email/senha
  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const { email, password, displayName } = credentials;
      
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Atualizar perfil com nome
      await updateProfile(firebaseUser, { displayName });

      // Criar documento no Firestore
      await this.createUserDocument(firebaseUser, { displayName });

      return this.mapFirebaseUserToUser(firebaseUser);
    } catch (error: unknown) {
      const errorCode = (error as { code?: string })?.code || 'unknown';
      throw new Error(this.getErrorMessage(errorCode));
    }
  }

  // Login com email/senha
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const { email, password } = credentials;
      
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return this.mapFirebaseUserToUser(firebaseUser);
    } catch (error: unknown) {
      const errorCode = (error as { code?: string })?.code || 'unknown';
      throw new Error(this.getErrorMessage(errorCode));
    }
  }

  // Login com Google
  async loginWithGoogle(): Promise<User> {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, this.googleProvider);
      
      // Criar documento se não existir
      await this.createUserDocument(firebaseUser);

      return this.mapFirebaseUserToUser(firebaseUser);
    } catch (error: unknown) {
      const errorCode = (error as { code?: string })?.code || 'unknown';
      throw new Error(this.getErrorMessage(errorCode));
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      throw new Error('Erro ao fazer logout');
    }
  }

  // Reset de senha
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const errorCode = (error as { code?: string })?.code || 'unknown';
      throw new Error(this.getErrorMessage(errorCode));
    }
  }

  // Listener para mudanças de auth
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.mapFirebaseUserToUser(firebaseUser);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  // Traduzir erros do Firebase
  private getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Esta conta foi desabilitada',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/invalid-credential': 'Credenciais inválidas',
      'auth/operation-not-allowed': 'Operação não permitida',
      'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
      'auth/popup-blocked': 'Popup bloqueado pelo navegador'
    };

    return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente.';
  }
}

export const authService = new AuthService();
