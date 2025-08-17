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
import { db } from '../firebase';
import { Product, ProductFormData } from '@/types';

/**
 * Serviço unificado para gerenciar produtos nacionais e estrangeiros
 * Elimina a separação entre 'products' e 'foreign_products'
 */
class UnifiedProductService {
  private collection = collection(db, 'products');

  // Criar produto (nacional ou estrangeiro baseado na localização)
  async createProduct(data: ProductFormData): Promise<string> {
    try {
      const productData: Omit<Product, 'id'> = {
        ...data,
        slug: this.generateSlug(data.name),
        views: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(this.collection, productData);
      
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
      const productRef = doc(this.collection, id);
      
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

      const productRef = doc(this.collection, id);
      await deleteDoc(productRef);
      
      // Atualizar contador de produtos na categoria
      await this.updateCategoryProductCount(product.categoryId, -1);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }

  // Buscar produto por ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const productRef = doc(this.collection, id);
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

  // Buscar produto por slug
  async getProductBySlug(slug: string): Promise<Product | null> {
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
      console.error('Erro ao buscar produto por slug:', error);
      return null;
    }
  }

  // Buscar todos os produtos
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(this.collection, orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao carregar produtos');
    }
  }

  // Buscar produtos brasileiros
  async getBrazilianProducts(): Promise<Product[]> {
    try {
      // Buscar todos e filtrar client-side para evitar problemas de índices compostos
      const allProducts = await this.getAllProducts();
      
      return allProducts.filter(product => 
        product.location?.countryCode === 'BR' && 
        product.isActive !== false // Default true se undefined
      );
    } catch (error) {
      console.error('Erro ao buscar produtos brasileiros:', error);
      return [];
    }
  }

  // Buscar produtos estrangeiros
  async getForeignProducts(): Promise<Product[]> {
    try {
      // Buscar todos e filtrar client-side para evitar problemas de índices compostos
      const allProducts = await this.getAllProducts();
      
      return allProducts.filter(product => 
        product.location?.countryCode !== 'BR' && 
        product.isActive !== false // Default true se undefined
      );
    } catch (error) {
      console.error('Erro ao buscar produtos estrangeiros:', error);
      return [];
    }
  }

  // Buscar produtos por categoria
  async getProductsByCategory(categorySlug: string, onlyBrazilian: boolean = false): Promise<Product[]> {
    try {
      // Buscar todos e filtrar client-side para evitar problemas de índices compostos
      const allProducts = await this.getAllProducts();
      
      return allProducts.filter(product => {
        const matchesCategory = product.categorySlug === categorySlug;
        const isActive = product.isActive !== false; // Default true se undefined
        const isBrazilian = product.location?.countryCode === 'BR';
        
        return matchesCategory && isActive && (onlyBrazilian ? isBrazilian : true);
      }).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return [];
    }
  }

  // Buscar produtos em destaque
  async getFeaturedProducts(limitCount: number = 4, onlyBrazilian: boolean = false): Promise<Product[]> {
    try {
      // Buscar todos e filtrar client-side para evitar problemas de índices compostos
      const allProducts = await this.getAllProducts();
      
      console.log('🔍 getFeaturedProducts Debug:', {
        totalProducts: allProducts.length,
        limitCount,
        onlyBrazilian
      });
      
      const featuredProducts = allProducts.filter(product => {
        const isFeatured = product.isFeatured === true;
        const isActive = product.isActive !== false; // Default true se undefined
        const isBrazilian = product.location?.countryCode === 'BR';
        
        console.log(`Produto ${product.name}:`, {
          isFeatured,
          isActive,
          isBrazilian,
          passes: isFeatured && isActive && (onlyBrazilian ? isBrazilian : true)
        });
        
        return isFeatured && isActive && (onlyBrazilian ? isBrazilian : true);
      });
      
      console.log('🎯 Produtos em destaque encontrados:', featuredProducts.length);
      
      return featuredProducts.slice(0, limitCount);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return [];
    }
  }

  // Buscar produtos unicórnio
  async getUnicornProducts(): Promise<Product[]> {
    try {
      // Buscar todos e filtrar client-side para evitar problemas de índices compostos
      const allProducts = await this.getAllProducts();
      
      return allProducts.filter(product => 
        product.isUnicorn === true && 
        product.isActive !== false // Default true se undefined
      ).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Erro ao buscar unicórnios:', error);
      return [];
    }
  }

  // Buscar produtos relacionados
  async getRelatedProducts(categorySlug: string, excludeId: string, limitCount: number = 3): Promise<Product[]> {
    try {
      // Buscar todos e filtrar client-side para evitar problemas de índices compostos
      const allProducts = await this.getAllProducts();
      
      const relatedProducts = allProducts.filter(product => 
        product.categorySlug === categorySlug &&
        product.isActive !== false && // Default true se undefined
        product.id !== excludeId
      );
      
      return relatedProducts.slice(0, limitCount);
    } catch (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      return [];
    }
  }

  // Buscar por texto
  async searchProducts(searchTerm: string, filters?: {
    onlyBrazilian?: boolean;
    categoryId?: string;
  }): Promise<Product[]> {
    try {
      // Buscar todos e filtrar client-side para evitar problemas de índices compostos
      let products = await this.getAllProducts();
      
      // Filtrar apenas produtos ativos
      products = products.filter(product => product.isActive !== false);
      
      // Filtrar por categoria se especificado
      if (filters?.categoryId) {
        products = products.filter(product => 
          product.categoryId === filters.categoryId
        );
      }
      
      // Filtrar por país se especificado
      if (filters?.onlyBrazilian) {
        products = products.filter(product => 
          product.location?.countryCode === 'BR'
        );
      }
      
      // Filtro por termo de busca (implementação client-side)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.tags?.some(tag => tag.toLowerCase().includes(term)) ||
          product.features?.some(feature => feature.toLowerCase().includes(term))
        );
      }

      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
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
      const productRef = doc(this.collection, id);
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
      const productRef = doc(this.collection, id);
      await updateDoc(productRef, {
        isFeatured,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao alterar destaque do produto:', error);
      throw error;
    }
  }

  // Incrementar visualizações
  async incrementViews(id: string): Promise<void> {
    try {
      const productRef = doc(this.collection, id);
      const product = await this.getProductById(id);
      
      if (product) {
        await updateDoc(productRef, {
          views: (product.views || 0) + 1,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error);
      // Não falha se não conseguir incrementar views
    }
  }

  // Obter estatísticas dos produtos
  async getProductStats(): Promise<{
    total: number;
    brazilian: number;
    foreign: number;
    active: number;
    featured: number;
    byCategory: { [key: string]: number };
  }> {
    try {
      const products = await this.getAllProducts();
      
      // Debug: log dos produtos para verificar estrutura
      console.log('🔍 Debug - Total de produtos encontrados:', products.length);
      products.forEach((product, index) => {
        if (index < 5) { // Log apenas os primeiros 5 para não spam
          console.log(`Produto ${index + 1}:`, {
            name: product.name,
            location: product.location,
            countryCode: product.location?.countryCode,
            isActive: product.isActive,
            isFeatured: product.isFeatured
          });
        }
      });
      
      const brazilianProducts = products.filter(p => p.location?.countryCode === 'BR');
      const foreignProducts = products.filter(p => p.location?.countryCode !== 'BR');
      
      console.log('🇧🇷 Produtos brasileiros encontrados:', brazilianProducts.length);
      console.log('🌍 Produtos estrangeiros encontrados:', foreignProducts.length);
      
      const stats = {
        total: products.length,
        brazilian: brazilianProducts.length,
        foreign: foreignProducts.length,
        active: products.filter(p => p.isActive !== false).length, // Default true
        featured: products.filter(p => p.isFeatured === true).length,
        byCategory: {} as { [key: string]: number }
      };

      // Contar por categoria
      products.forEach(product => {
        const category = product.category || 'Sem categoria';
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      });
      
      console.log('📊 Estatísticas finais:', stats);

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
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
}

export const unifiedProductService = new UnifiedProductService();