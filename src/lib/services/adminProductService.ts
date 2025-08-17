import { unifiedProductService } from './unifiedProductService';
import { Product, ProductFormData } from '@/types';

/**
 * Serviço administrativo para gerenciar produtos
 * Usa o serviço unificado internamente
 */
class AdminProductService {

  // Criar novo produto
  async createProduct(data: ProductFormData): Promise<string> {
    try {
      return await unifiedProductService.createProduct(data);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  // Atualizar produto
  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
    try {
      return await unifiedProductService.updateProduct(id, data);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  // Deletar produto
  async deleteProduct(id: string): Promise<void> {
    try {
      return await unifiedProductService.deleteProduct(id);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }

  // Obter produto por ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      return await unifiedProductService.getProductById(id);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  }

  // Listar todos os produtos para admin (incluindo inativos)
  async getAllProductsForAdmin(): Promise<Product[]> {
    try {
      return await unifiedProductService.getAllProducts();
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  }

  // Listar produtos por categoria
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      // Para admin, buscamos por ID da categoria e incluimos inativos
      return await unifiedProductService.searchProducts('', {
        categoryId
      });
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      throw error;
    }
  }

  // Gerar slug a partir do nome
  generateSlug(name: string): string {
    return unifiedProductService.generateSlug(name);
  }

  // Ativar/desativar produto
  async toggleProductStatus(id: string, isActive: boolean): Promise<void> {
    try {
      return await unifiedProductService.toggleProductStatus(id, isActive);
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
      throw error;
    }
  }

  // Destacar/remover destaque do produto
  async toggleProductFeatured(id: string, isFeatured: boolean): Promise<void> {
    try {
      return await unifiedProductService.toggleProductFeatured(id, isFeatured);
    } catch (error) {
      console.error('Erro ao alterar destaque do produto:', error);
      throw error;
    }
  }


  // Buscar produtos com filtros
  async searchProducts(searchTerm: string, categoryId?: string): Promise<Product[]> {
    try {
      return await unifiedProductService.searchProducts(searchTerm, {
        categoryId,
        onlyBrazilian: false // Para admin, buscar todos
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
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
      return await unifiedProductService.getProductStats();
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}

export const adminProductService = new AdminProductService();
