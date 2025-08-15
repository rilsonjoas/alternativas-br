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
import { Product } from '@/types';

class ProductService {
  private collection = collection(db, COLLECTIONS.PRODUCTS);

  // Buscar todos os produtos
  async getAll(): Promise<Product[]> {
    try {
      const q = query(this.collection, orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Retornar todos os produtos do Firestore
      return allProducts;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao carregar produtos');
    }
  }

  // Buscar produto por slug
  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const q = query(this.collection, where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Product;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  }

  // Buscar produtos por categoria
  async getByCategory(categorySlug: string): Promise<Product[]> {
    try {
      const q = query(
        this.collection, 
        where('categorySlug', '==', categorySlug),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Filtrar apenas produtos brasileiros
      return products.filter(product => 
        product.location && product.location.includes('BR')
      );
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return [];
    }
  }

  // Buscar produtos em destaque
  async getFeatured(limitCount: number = 4): Promise<Product[]> {
    try {
      const q = query(
        this.collection, 
        where('isFeatured', '==', true),
        orderBy('rating', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return [];
    }
  }

  // Buscar produtos unicórnio
  async getUnicorns(): Promise<Product[]> {
    try {
      const q = query(
        this.collection, 
        where('isUnicorn', '==', true),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Erro ao buscar unicórnios:', error);
      return [];
    }
  }

  // Buscar produtos relacionados
  async getRelated(categorySlug: string, excludeId: string, limitCount: number = 3): Promise<Product[]> {
    try {
      const q = query(
        this.collection, 
        where('categorySlug', '==', categorySlug),
        orderBy('rating', 'desc'),
        limit(limitCount + 1) // +1 para excluir o produto atual
      );
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Filtrar o produto atual e limitar
      return products
        .filter(product => product.id !== excludeId)
        .slice(0, limitCount);
    } catch (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      return [];
    }
  }

  // Buscar por texto
  async search(searchTerm: string): Promise<Product[]> {
    try {
      // Firestore não tem full-text search nativo
      // Esta é uma implementação básica
      const snapshot = await getDocs(this.collection);
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      const term = searchTerm.toLowerCase();
      return allProducts.filter(product => {
        // Filtrar apenas produtos brasileiros
        if (!product.location || !product.location.includes('BR')) {
          return false;
        }
        
        // Busca por nome, descrição ou tags
        return product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.tags.some(tag => tag.toLowerCase().includes(term));
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  // Criar novo produto
  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(this.collection, {
        ...productData,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Falha ao criar produto');
    }
  }

  // Atualizar produto
  async update(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Falha ao atualizar produto');
    }
  }

  // Deletar produto
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw new Error('Falha ao deletar produto');
    }
  }
}

export const productService = new ProductService();
