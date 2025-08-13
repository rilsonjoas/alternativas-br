import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Script para promover um usuário a administrador
 * Execute este script no console do navegador ou crie um botão temporário
 */

export async function promoteUserToAdmin(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'admin'
    });
    console.log(`✅ Usuário ${userId} promovido a administrador com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error);
    throw error;
  }
}

/**
 * Execute no console do navegador:
 * 
 * import { promoteUserToAdmin } from './src/scripts/promoteToAdmin';
 * promoteUserToAdmin('SEU_USER_ID_AQUI');
 * 
 * Para encontrar seu user ID, faça login e execute:
 * console.log(firebase.auth().currentUser?.uid);
 */
