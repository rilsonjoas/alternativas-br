import { unifiedProductService } from './unifiedProductService';
import { Product } from '@/types';

/**
 * Serviço de produtos para o frontend público
 * Usa o serviço unificado internamente
 */
class ProductService {
  create(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  update(id: string, updates: Partial<Product>): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  // Buscar todos os produtos ativos
  async getAll(): Promise<Product[]> {
    try {
      return await unifiedProductService.getAllProducts();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao carregar produtos');
    }
  }

  // Buscar produto por slug
  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const product = await unifiedProductService.getProductBySlug(slug);
      
      // Incrementar visualizações se produto encontrado
      if (product) {
        await unifiedProductService.incrementViews(product.id);
      }
      
      return product;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  }

  // Buscar produtos por categoria (padrão: apenas brasileiros)
  async getByCategory(categorySlug: string, onlyBrazilian: boolean = true): Promise<Product[]> {
    try {
      return await unifiedProductService.getProductsByCategory(categorySlug, onlyBrazilian);
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return [];
    }
  }

  // Buscar produtos em destaque (padrão: apenas brasileiros)
  async getFeatured(limitCount: number = 4, onlyBrazilian: boolean = true): Promise<Product[]> {
    try {
      return await unifiedProductService.getFeaturedProducts(limitCount, onlyBrazilian);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return [];
    }
  }

  // Buscar produtos unicórnio
  async getUnicorns(): Promise<Product[]> {
    try {
      return await unifiedProductService.getUnicornProducts();
    } catch (error) {
      console.error('Erro ao buscar unicórnios:', error);
      return [];
    }
  }

  // Buscar produtos relacionados
  async getRelated(categorySlug: string, excludeId: string, limitCount: number = 3): Promise<Product[]> {
    try {
      return await unifiedProductService.getRelatedProducts(categorySlug, excludeId, limitCount);
    } catch (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      return [];
    }
  }

  // Buscar por texto (padrão: apenas brasileiros)
  async search(searchTerm: string, onlyBrazilian: boolean = true): Promise<Product[]> {
    try {
      return await unifiedProductService.searchProducts(searchTerm, {
        onlyBrazilian
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  // Buscar produtos brasileiros
  async getBrazilian(): Promise<Product[]> {
    try {
      return await unifiedProductService.getBrazilianProducts();
    } catch (error) {
      console.error('Erro ao buscar produtos brasileiros:', error);
      return [];
    }
  }

  // Buscar produtos estrangeiros
  async getForeign(): Promise<Product[]> {
    try {
      return await unifiedProductService.getForeignProducts();
    } catch (error) {
      console.error('Erro ao buscar produtos estrangeiros:', error);
      return [];
    }
  }

  // Métodos administrativos - delegados para o unifiedProductService
  // (Estes métodos são principalmente para uso interno/admin)
  
  async getById(id: string): Promise<Product | null> {
    return await unifiedProductService.getProductById(id);
  }
}

export const productService = new ProductService();
