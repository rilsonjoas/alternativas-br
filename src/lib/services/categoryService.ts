import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import db from '../firebase';
import { COLLECTIONS } from '../firebase-config';
import { Category } from '@/types';

class CategoryService {
  private collection = collection(db, COLLECTIONS.CATEGORIES);

  // Buscar todas as categorias
  async getAll(): Promise<Category[]> {
    try {
      const q = query(this.collection, orderBy('title', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw new Error('Falha ao carregar categorias');
    }
  }

  // Buscar categoria por slug
  async getBySlug(slug: string): Promise<Category | null> {
    try {
      const q = query(this.collection, where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Category;
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      return null;
    }
  }

  // Buscar categorias em destaque
  async getFeatured(): Promise<Category[]> {
    try {
      const q = query(
        this.collection, 
        where('featured', '==', true),
        orderBy('title', 'asc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
    } catch (error) {
      console.error('Erro ao buscar categorias em destaque:', error);
      return [];
    }
  }

  // Criar nova categoria
  async create(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(this.collection, {
        ...categoryData,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw new Error('Falha ao criar categoria');
    }
  }

  // Atualizar categoria
  async update(id: string, updates: Partial<Category>): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw new Error('Falha ao atualizar categoria');
    }
  }

  // Deletar categoria
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw new Error('Falha ao deletar categoria');
    }
  }
}

export const categoryService = new CategoryService();
