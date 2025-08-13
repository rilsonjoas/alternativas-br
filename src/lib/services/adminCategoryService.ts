import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types';

export interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
  isActive: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

class AdminCategoryService {
  private collectionName = 'categories';

  // Criar nova categoria
  async createCategory(data: CategoryFormData): Promise<string> {
    try {
      // Verificar se slug já existe
      const existingCategory = await this.getCategoryBySlug(data.slug);
      if (existingCategory) {
        throw new Error('Já existe uma categoria com este slug');
      }

      const categoryData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        productCount: 0
      };

      const docRef = await addDoc(collection(db, this.collectionName), categoryData);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }

  // Atualizar categoria
  async updateCategory(id: string, data: Partial<CategoryFormData>): Promise<void> {
    try {
      const categoryRef = doc(db, this.collectionName, id);
      
      // Se está atualizando o slug, verificar se não existe outro
      if (data.slug) {
        const existingCategory = await this.getCategoryBySlug(data.slug);
        if (existingCategory && existingCategory.id !== id) {
          throw new Error('Já existe uma categoria com este slug');
        }
      }

      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };

      await updateDoc(categoryRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  }

  // Deletar categoria
  async deleteCategory(id: string): Promise<void> {
    try {
      // Verificar se existem produtos nesta categoria
      const category = await this.getCategoryById(id);
      if (category && category.productCount > 0) {
        throw new Error('Não é possível deletar uma categoria que possui produtos');
      }

      const categoryRef = doc(db, this.collectionName, id);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  }

  // Obter categoria por ID
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const categoryRef = doc(db, this.collectionName, id);
      const categorySnap = await getDoc(categoryRef);
      
      if (categorySnap.exists()) {
        return {
          id: categorySnap.id,
          ...categorySnap.data()
        } as Category;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      throw error;
    }
  }

  // Obter categoria por slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const categoriesQuery = query(
        collection(db, this.collectionName),
        orderBy('name')
      );
      const snapshot = await getDocs(categoriesQuery);
      
      const category = snapshot.docs.find(doc => 
        doc.data().slug === slug
      );
      
      if (category) {
        return {
          id: category.id,
          ...category.data()
        } as Category;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar categoria por slug:', error);
      throw error;
    }
  }

  // Listar todas as categorias para admin
  async getAllCategoriesForAdmin(): Promise<Category[]> {
    try {
      const categoriesQuery = query(
        collection(db, this.collectionName),
        orderBy('name')
      );
      const snapshot = await getDocs(categoriesQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      throw error;
    }
  }

  // Gerar slug a partir do nome
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-'); // Remove hífens duplos
  }

  // Ativar/desativar categoria
  async toggleCategoryStatus(id: string, isActive: boolean): Promise<void> {
    try {
      const categoryRef = doc(db, this.collectionName, id);
      await updateDoc(categoryRef, {
        isActive,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao alterar status da categoria:', error);
      throw error;
    }
  }
}

export const adminCategoryService = new AdminCategoryService();
