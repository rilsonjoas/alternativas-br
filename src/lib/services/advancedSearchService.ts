import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdvancedSearchFilters, SearchSuggestion, SearchHistory } from '@/types/search';
import { Product } from '@/types';

export class AdvancedSearchService {
  private searchHistoryKey = 'alternativas-br-search-history';
  private maxHistoryItems = 10;

  async searchProducts(filters: AdvancedSearchFilters): Promise<Product[]> {
    try {
      const constraints = [];

      if (filters.categories && filters.categories.length > 0) {
        constraints.push(where('category', 'in', filters.categories));
      }

      if (filters.minRating) {
        constraints.push(where('rating', '>=', filters.minRating));
      }

      if (filters.pricing) {
        constraints.push(where('pricing', '==', filters.pricing));
      }

      const sortField = this.getSortField(filters.sortBy || 'relevance');
      if (sortField) {
        const sortOrder = filters.sortOrder || 'desc';
        constraints.push(orderBy(sortField, sortOrder));
      }

      constraints.push(limit(50));

      const q = query(collection(db, 'products'), ...constraints);
      const querySnapshot = await getDocs(q);
      
      let products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      if (filters.query) {
        products = this.filterByText(products, filters.query);
      }

      if (filters.tags && filters.tags.length > 0) {
        products = this.filterByTags(products, filters.tags);
      }

      return products;
    } catch (error) {
      console.error('Erro na busca avançada:', error);
      throw new Error('Erro ao realizar busca');
    }
  }

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

  async getRecommendations(
    searchQuery?: string, 
    options?: {
      category?: string;
      excludeProductId?: string;
      maxResults?: number;
      userId?: string;
    }
  ): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products');
      let q = query(
        productsRef, 
        orderBy('rating', 'desc'), 
        limit(options?.maxResults || 10)
      );

      if (options?.category) {
        q = query(
          productsRef, 
          where('category', '==', options.category),
          orderBy('rating', 'desc'), 
          limit(options?.maxResults || 10)
        );
      }

      if (options?.excludeProductId) {
        q = query(
          productsRef, 
          where('id', '!=', options.excludeProductId), 
          orderBy('rating', 'desc'), 
          limit(options?.maxResults || 10)
        );
      }

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

  async getTrendingProducts(maxResults: number = 10): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
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

  saveSearchHistory(searchQuery: string, filters: AdvancedSearchFilters, resultCount: number): void {
    try {
      const history = this.getSearchHistory();
      const newEntry: SearchHistory = {
        id: Date.now().toString(),
        query: searchQuery,
        filters,
        timestamp: new Date(),
        resultCount
      };

      const updatedHistory = [newEntry, ...history.filter(h => h.query !== searchQuery)]
        .slice(0, this.maxHistoryItems);

      localStorage.setItem(this.searchHistoryKey, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  }

  getSearchHistory(): SearchHistory[] {
    try {
      const stored = localStorage.getItem(this.searchHistoryKey);
      if (!stored) return [];

      const history = JSON.parse(stored);
      return history.map((item: SearchHistory) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    }
  }

  clearSearchHistory(): void {
    try {
      localStorage.removeItem(this.searchHistoryKey);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }

  private getSortField(sortBy: string): string | null {
    const sortMap: Record<string, string> = {
      'rating': 'rating',
      'name': 'name',
      'popularity': 'rating',
      'newest': 'createdAt',
      'reviews': 'reviewCount'
    };
    return sortMap[sortBy] || null;
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

  private filterByTags(products: Product[], tags: string[]): Product[] {
    return products.filter(product =>
      tags.some(tag => product.tags?.includes(tag))
    );
  }

  private async searchProductSuggestions(searchQuery: string): Promise<SearchSuggestion[]> {
    try {
      const q = query(
        collection(db, 'products'),
        orderBy('name'),
        limit(5)
      );

      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => doc.data() as Product);

      return products
        .filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(product => ({
          id: product.id,
          title: product.name,
          subtitle: product.description,
          type: 'product' as const,
          popularity: product.rating || 0,
          productId: product.id
        }));
    } catch (error) {
      console.error('Erro ao buscar sugestões de produtos:', error);
      return [];
    }
  }

  private async searchCategorySuggestions(searchQuery: string): Promise<SearchSuggestion[]> {
    try {
      const q = query(
        collection(db, 'categories'),
        limit(3)
      );

      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map(doc => doc.data());

      return categories
        .filter(category => 
          category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(category => ({
          id: category.id,
          title: category.name || category.title,
          subtitle: category.description,
          type: 'category' as const,
          popularity: category.productCount || 0,
          categoryId: category.id
        }));
    } catch (error) {
      console.error('Erro ao buscar sugestões de categorias:', error);
      return [];
    }
  }

  private getTagSuggestions(searchQuery: string): SearchSuggestion[] {
    const commonTags = [
      'API', 'Cloud', 'SaaS', 'Open Source', 'Mobile', 'Web',
      'Integração', 'Automação', 'Dashboard', 'Relatórios',
      'CRM', 'ERP', 'E-commerce', 'Marketing', 'Analytics'
    ];

    return commonTags
      .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(tag => ({
        id: `tag-${tag}`,
        title: tag,
        subtitle: `Buscar por produtos com tag "${tag}"`,
        type: 'tag' as const,
        popularity: 50,
        tag
      }));
  }

  private getFeatureSuggestions(searchQuery: string): SearchSuggestion[] {
    const commonFeatures = [
      'Integração WhatsApp', 'API Rest', 'Dashboard Analytics', 
      'Relatórios Personalizados', 'Mobile App', 'Cloud Storage',
      'Automação Marketing', 'Gestão Vendas', 'Controle Estoque'
    ];

    return commonFeatures
      .filter(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(feature => ({
        id: `feature-${feature}`,
        title: feature,
        subtitle: `Produtos com recurso "${feature}"`,
        type: 'feature' as const,
        popularity: 30,
        feature
      }));
  }
}

export const advancedSearchService = new AdvancedSearchService();
