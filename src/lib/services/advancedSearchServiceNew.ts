import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  Firestore
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdvancedSearchFilters, SearchSuggestion, SearchHistory } from '@/types/search';
import { Product } from '@/types';

export class AdvancedSearchService {
  private db: Firestore;
  private searchHistoryKey = 'alternativas-br-search-history';

  constructor() {
    this.db = db;
  }

  // Busca principal com filtros avançados
  async searchProducts(filters: AdvancedSearchFilters): Promise<Product[]> {
    try {
      let q = collection(this.db, 'products');
      const constraints = [];

      // Filtro por categoria
      if (filters.categories && filters.categories.length > 0) {
        // Para múltiplas categorias, fazemos queries separadas e combinamos
        const categoryResults = await Promise.all(
          filters.categories.map(category => {
            const categoryQuery = query(
              collection(this.db, 'products'),
              where('category', '==', category)
            );
            return getDocs(categoryQuery);
          })
        );

        const allProducts = new Map<string, Product>();
        categoryResults.forEach(snapshot => {
          snapshot.docs.forEach(doc => {
            allProducts.set(doc.id, { id: doc.id, ...doc.data() } as Product);
          });
        });

        let products = Array.from(allProducts.values());
        products = this.applyAdditionalFilters(products, filters);
        return this.sortProducts(products, filters.sortBy, filters.sortOrder);
      }

      // Filtro por rating mínimo
      if (filters.minRating && filters.minRating > 0) {
        constraints.push(where('rating', '>=', filters.minRating));
      }

      // Filtro por modelo de preço
      if (filters.pricing) {
        constraints.push(where('pricing', '==', filters.pricing));
      }

      // Aplicar constraints
      if (constraints.length > 0) {
        q = query(collection(this.db, 'products'), ...constraints);
      }

      const snapshot = await getDocs(q);
      let products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Aplicar filtros adicionais que não podem ser feitos no Firestore
      products = this.applyAdditionalFilters(products, filters);

      // Ordenar resultados
      return this.sortProducts(products, filters.sortBy, filters.sortOrder);
    } catch (error) {
      console.error('Erro na busca avançada:', error);
      return [];
    }
  }

  // Buscar sugestões para autocompletar
  async getSearchSuggestions(searchQuery: string): Promise<SearchSuggestion[]> {
    if (!searchQuery || searchQuery.length < 2) return [];

    try {
      const [products, categories] = await Promise.all([
        this.searchProductSuggestions(searchQuery),
        this.searchCategorySuggestions(searchQuery)
      ]);

      const suggestions: SearchSuggestion[] = [
        ...products,
        ...categories,
        ...this.getTagSuggestions(searchQuery),
        ...this.getFeatureSuggestions(searchQuery)
      ];

      return suggestions
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 8);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      return [];
    }
  }

  // Obter recomendações personalizadas
  async getRecommendations(
    searchQuery?: string, 
    options?: {
      category?: string;
      excludeProductId?: string;
      maxResults?: number;
    }
  ): Promise<Product[]> {
    try {
      let q = collection(this.db, 'products');
      const constraints = [];

      // Filtrar por categoria se especificada
      if (options?.category) {
        constraints.push(where('category', '==', options.category));
      }

      // Excluir produto específico
      if (options?.excludeProductId) {
        constraints.push(where('id', '!=', options.excludeProductId));
      }

      // Ordenar por rating
      constraints.push(orderBy('rating', 'desc'));
      constraints.push(limit(options?.maxResults || 10));

      q = query(collection(this.db, 'products'), ...constraints);

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      return [];
    }
  }

  // Obter produtos em trending
  async getTrendingProducts(maxResults: number = 10): Promise<Product[]> {
    try {
      const q = query(
        collection(this.db, 'products'),
        where('rating', '>=', 4),
        orderBy('rating', 'desc'),
        limit(maxResults)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Erro ao buscar produtos em trending:', error);
      return [];
    }
  }

  // Salvar busca no histórico
  saveSearchHistory(searchQuery: string, filters: AdvancedSearchFilters, resultCount: number): void {
    try {
      const history: SearchHistory = {
        id: Date.now().toString(),
        query: searchQuery,
        filters,
        resultCount,
        timestamp: new Date()
      };

      const existingHistory = this.getSearchHistory();
      const newHistory = [history, ...existingHistory.filter(h => h.query !== searchQuery)].slice(0, 10);
      
      localStorage.setItem(this.searchHistoryKey, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  }

  // Obter histórico de busca
  getSearchHistory(): SearchHistory[] {
    try {
      const stored = localStorage.getItem(this.searchHistoryKey);
      if (!stored) return [];

      const history = JSON.parse(stored);
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    }
  }

  // Limpar histórico de busca
  clearSearchHistory(): void {
    try {
      localStorage.removeItem(this.searchHistoryKey);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }

  // Métodos auxiliares privados
  private applyAdditionalFilters(products: Product[], filters: AdvancedSearchFilters): Product[] {
    let filtered = [...products];

    // Filtro por texto
    if (filters.query) {
      filtered = this.filterByText(filtered, filters.query);
    }

    // Filtro por tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product => 
        filters.tags!.some(tag => 
          product.tags?.includes(tag) || 
          product.name.toLowerCase().includes(tag.toLowerCase()) ||
          product.description.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }

    return filtered;
  }

  private filterByText(products: Product[], searchQuery: string): Product[] {
    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  private sortProducts(
    products: Product[], 
    sortBy: string = 'relevance', 
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Product[] {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default: // relevance
        // Manter ordem atual ou usar rating como fallback
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return sortOrder === 'asc' ? sorted.reverse() : sorted;
  }

  private async searchProductSuggestions(searchQuery: string): Promise<SearchSuggestion[]> {
    try {
      const q = query(
        collection(this.db, 'products'),
        orderBy('name'),
        limit(5)
      );
      
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      return products
        .filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(product => ({
          id: product.id,
          title: product.name,
          subtitle: product.category,
          type: 'product' as const,
          popularity: product.reviewCount || 0,
          productId: product.id
        }));
    } catch (error) {
      console.error('Erro ao buscar sugestões de produtos:', error);
      return [];
    }
  }

  private async searchCategorySuggestions(searchQuery: string): Promise<SearchSuggestion[]> {
    const categories = [
      { id: 'crm', name: 'CRM', count: 25 },
      { id: 'erp', name: 'ERP', count: 18 },
      { id: 'ecommerce', name: 'E-commerce', count: 32 },
      { id: 'marketing', name: 'Marketing', count: 28 },
      { id: 'analytics', name: 'Analytics', count: 15 },
      { id: 'design', name: 'Design', count: 22 }
    ];

    return categories
      .filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(cat => ({
        id: cat.id,
        title: cat.name,
        subtitle: `${cat.count} produtos`,
        type: 'category' as const,
        popularity: cat.count,
        categoryId: cat.id
      }));
  }

  private getTagSuggestions(searchQuery: string): SearchSuggestion[] {
    const commonTags = [
      'API', 'Cloud', 'SaaS', 'Open Source', 'Mobile', 'Web',
      'Integração', 'Automação', 'Dashboard', 'Relatórios'
    ];

    return commonTags
      .filter(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(tag => ({
        id: `tag-${tag}`,
        title: tag,
        subtitle: 'Tag',
        type: 'tag' as const,
        popularity: 10
      }));
  }

  private getFeatureSuggestions(searchQuery: string): SearchSuggestion[] {
    const features = [
      'Multi-tenant', 'API REST', 'Dashboard', 'Relatórios',
      'Integração', 'Mobile App', 'Cloud', 'On-premise'
    ];

    return features
      .filter(feature => 
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(feature => ({
        id: `feature-${feature}`,
        title: feature,
        subtitle: 'Recurso',
        type: 'feature' as const,
        popularity: 5
      }));
  }
}

export const advancedSearchService = new AdvancedSearchService();
