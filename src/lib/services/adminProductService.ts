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
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

export interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  website: string;
  logoUrl: string;
  category: string;
  categoryId: string;
  pricing: {
    type: 'free' | 'freemium' | 'paid' | 'enterprise';
    startingPrice?: number;
    currency: string;
    description: string;
  };
  features: string[];
  tags: string[];
  screenshots?: string[];
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  alternativeTo?: string[];
  targetAudience?: string[];
  companyInfo: {
    name: string;
    foundedYear?: number;
    headquarters: string;
    size?: string;
    website?: string;
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

class AdminProductService {
  private collectionName = 'products';

  // Criar novo produto
  async createProduct(data: ProductFormData): Promise<string> {
    try {
      const productData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        averageRating: 0,
        reviewCount: 0,
        views: 0,
        slug: this.generateSlug(data.name)
      };

      const docRef = await addDoc(collection(db, this.collectionName), productData);
      
      // Atualizar contador de produtos na categoria
      await this.updateCategoryProductCount(data.categoryId, 1);
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  // Atualizar produto
  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
    try {
      const productRef = doc(db, this.collectionName, id);
      
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };

      // Se mudou a categoria, atualizar contadores
      if (data.categoryId) {
        const currentProduct = await this.getProductById(id);
        if (currentProduct && currentProduct.categoryId !== data.categoryId) {
          await this.updateCategoryProductCount(currentProduct.categoryId, -1);
          await this.updateCategoryProductCount(data.categoryId, 1);
        }
      }

      await updateDoc(productRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  // Deletar produto
  async deleteProduct(id: string): Promise<void> {
    try {
      const product = await this.getProductById(id);
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const productRef = doc(db, this.collectionName, id);
      await deleteDoc(productRef);
      
      // Atualizar contador de produtos na categoria
      await this.updateCategoryProductCount(product.categoryId, -1);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }

  // Obter produto por ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, this.collectionName, id);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        return {
          id: productSnap.id,
          ...productSnap.data()
        } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  }

  // Listar todos os produtos para admin
  async getAllProductsForAdmin(): Promise<Product[]> {
    try {
      const productsQuery = query(
        collection(db, this.collectionName),
        orderBy('name')
      );
      const snapshot = await getDocs(productsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  }

  // Listar produtos por categoria
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const productsQuery = query(
        collection(db, this.collectionName),
        where('categoryId', '==', categoryId),
        orderBy('name')
      );
      const snapshot = await getDocs(productsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
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

  // Ativar/desativar produto
  async toggleProductStatus(id: string, isActive: boolean): Promise<void> {
    try {
      const productRef = doc(db, this.collectionName, id);
      await updateDoc(productRef, {
        isActive,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
      throw error;
    }
  }

  // Destacar/remover destaque do produto
  async toggleProductFeatured(id: string, isFeatured: boolean): Promise<void> {
    try {
      const productRef = doc(db, this.collectionName, id);
      await updateDoc(productRef, {
        isFeatured,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao alterar destaque do produto:', error);
      throw error;
    }
  }

  // Atualizar contador de produtos na categoria
  private async updateCategoryProductCount(categoryId: string, change: number): Promise<void> {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      const categorySnap = await getDoc(categoryRef);
      
      if (categorySnap.exists()) {
        const currentCount = categorySnap.data().productCount || 0;
        const newCount = Math.max(0, currentCount + change);
        
        await updateDoc(categoryRef, {
          productCount: newCount,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar contador de produtos:', error);
      // Não falha a operação principal se não conseguir atualizar o contador
    }
  }

  // Buscar produtos com filtros
  async searchProducts(searchTerm: string, categoryId?: string): Promise<Product[]> {
    try {
      let productsQuery = query(collection(db, this.collectionName));
      
      if (categoryId) {
        productsQuery = query(
          collection(db, this.collectionName),
          where('categoryId', '==', categoryId)
        );
      }
      
      const snapshot = await getDocs(productsQuery);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      // Filtro por termo de busca (implementação simples client-side)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return products.filter(product => 
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.tags?.some(tag => tag.toLowerCase().includes(term))
        );
      }

      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  // Obter estatísticas dos produtos
  async getProductStats(): Promise<{
    total: number;
    active: number;
    featured: number;
    byCategory: { [key: string]: number };
  }> {
    try {
      const products = await this.getAllProductsForAdmin();
      
      const stats = {
        total: products.length,
        active: products.filter(p => p.isActive).length,
        featured: products.filter(p => p.isFeatured).length,
        byCategory: {} as { [key: string]: number }
      };

      // Contar por categoria
      products.forEach(product => {
        const category = product.category || 'Sem categoria';
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}

export const adminProductService = new AdminProductService();
