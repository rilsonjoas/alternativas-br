export interface AdvancedSearchFilters {
  query?: string;
  pricing?: 'free' | 'freemium' | 'paid' | 'enterprise';
  features?: string[];
  tags?: string[];
  sortBy?: 'relevance' | 'name' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchSuggestion {
  id: string;
  type: 'product' | 'tag' | 'feature';
  title: string;
  subtitle?: string;
  icon?: string;
  popularity?: number;
}

export interface SearchHistory {
  id: string;
  query: string;
  filters: AdvancedSearchFilters;
  timestamp: Date;
  resultCount: number;
}

export interface ProductComparison {
  products: string[]; // Product IDs
  features: ComparisonFeature[];
}

export interface ComparisonFeature {
  name: string;
  type: 'boolean' | 'text' | 'number';
  values: Record<string, string | number | boolean>; // productId -> value
}

export interface Recommendation {
  productId: string;
  score: number;
  reason: 'user_preference' | 'rating' | 'popular' | 'trending' | 'similar_tags';
  explanation: string;
}
