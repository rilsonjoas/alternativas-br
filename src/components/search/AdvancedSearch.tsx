import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Clock, Star, Tag, Grid3X3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import StarRating from '@/components/ui/star-rating';
import { AdvancedSearchFilters, SearchSuggestion, SearchHistory } from '@/types/search';
import { advancedSearchService } from '@/lib/services/advancedSearchService';

interface AdvancedSearchProps {
  onSearch: (filters: AdvancedSearchFilters) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  initialFilters?: AdvancedSearchFilters;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onSuggestionSelect,
  initialFilters = {},
  className
}) => {
  const [filters, setFilters] = useState<AdvancedSearchFilters>(initialFilters);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar histórico no mount
  useEffect(() => {
    setSearchHistory(advancedSearchService.getSearchHistory());
  }, []);

  // Debounced suggestions
  const loadSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const result = await advancedSearchService.getSearchSuggestions(query);
      setSuggestions(result);
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.query) {
        loadSuggestions(filters.query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.query, loadSuggestions]);

  const handleSearch = () => {
    setIsLoading(true);
    setShowSuggestions(false);
    
    // Salvar no histórico se houver query
    if (filters.query) {
      advancedSearchService.saveSearchHistory(filters.query, filters, 0);
      setSearchHistory(advancedSearchService.getSearchHistory());
    }

    onSearch(filters);
    setIsLoading(false);
  };

  const handleInputChange = (value: string) => {
    setFilters(prev => ({ ...prev, query: value }));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setFilters(prev => ({ ...prev, query: suggestion.title }));
    setShowSuggestions(false);
    onSuggestionSelect(suggestion);
  };

  const handleHistoryClick = (historyItem: SearchHistory) => {
    setFilters(historyItem.filters);
    setShowSuggestions(false);
    onSearch(historyItem.filters);
  };

  const clearFilters = () => {
    setFilters({ query: filters.query });
  };

  const activeFiltersCount = Object.keys(filters).filter(key => 
    key !== 'query' && key !== 'sortBy' && key !== 'sortOrder' && filters[key as keyof AdvancedSearchFilters]
  ).length;

  const categories = [
    { id: 'crm', name: 'CRM' },
    { id: 'erp', name: 'ERP' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'design', name: 'Design' }
  ];

  const commonTags = [
    'API', 'Cloud', 'SaaS', 'Open Source', 'Mobile', 'Web',
    'Integração', 'Automação', 'Dashboard', 'Relatórios'
  ];

  return (
    <div className={className}>
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-green-600" />
              Busca Avançada Brasileira 🇧🇷
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={activeFiltersCount > 0 ? 'bg-green-100 border-green-300' : ''}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Campo de busca principal */}
          <div className="relative">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={filters.query || ''}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Busque por produtos, categorias, recursos..."
                  className="pl-10 pr-4"
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {/* Sugestões e histórico */}
            {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
              <Card className="absolute top-full left-0 right-0 z-50 mt-1 border shadow-lg">
                <CardContent className="p-2 max-h-80 overflow-y-auto">
                  {suggestions.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                        Sugestões
                      </div>
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center space-x-3 p-2 rounded hover:bg-muted text-left"
                        >
                          <div className="text-lg">
                            {suggestion.type === 'product' && '📦'}
                            {suggestion.type === 'category' && '📁'}
                            {suggestion.type === 'tag' && '🏷️'}
                            {suggestion.type === 'feature' && '⚡'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {suggestion.title}
                            </div>
                            {suggestion.subtitle && (
                              <div className="text-xs text-muted-foreground truncate">
                                {suggestion.subtitle}
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchHistory.length > 0 && (
                    <>
                      {suggestions.length > 0 && <Separator className="my-2" />}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between px-2 py-1">
                          <div className="text-xs font-medium text-muted-foreground">
                            Histórico
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              advancedSearchService.clearSearchHistory();
                              setSearchHistory([]);
                            }}
                            className="text-xs h-auto p-1"
                          >
                            Limpar
                          </Button>
                        </div>
                        {searchHistory.slice(0, 5).map((historyItem) => (
                          <button
                            key={historyItem.id}
                            onClick={() => handleHistoryClick(historyItem)}
                            className="w-full flex items-center space-x-3 p-2 rounded hover:bg-muted text-left"
                          >
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {historyItem.query}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {historyItem.resultCount} resultado(s)
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Filtros avançados */}
          {showFilters && (
            <Card className="border-green-200">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filtros Avançados</h4>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Limpar filtros
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Categorias */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Grid3X3 className="w-4 h-4 mr-1" />
                      Categorias
                    </label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={filters.categories?.includes(category.id) || false}
                            onCheckedChange={(checked) => {
                              setFilters(prev => ({
                                ...prev,
                                categories: checked
                                  ? [...(prev.categories || []), category.id]
                                  : prev.categories?.filter(c => c !== category.id) || []
                              }));
                            }}
                          />
                          <label htmlFor={category.id} className="text-sm">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Avaliação Mínima
                    </label>
                    <div className="space-y-2">
                      <StarRating
                        rating={filters.minRating || 0}
                        interactive
                        onRatingChange={(rating) => 
                          setFilters(prev => ({ ...prev, minRating: rating }))
                        }
                        size="sm"
                      />
                      <div className="text-xs text-muted-foreground">
                        {filters.minRating ? `${filters.minRating}+ estrelas` : 'Qualquer avaliação'}
                      </div>
                    </div>
                  </div>

                  {/* Preços */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">💰 Modelo de Preço</label>
                    <Select
                      value={filters.pricing || ''}
                      onValueChange={(value) => 
                        setFilters(prev => ({ ...prev, pricing: value as 'free' | 'freemium' | 'paid' | 'enterprise' }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os preços" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os preços</SelectItem>
                        <SelectItem value="free">Gratuito</SelectItem>
                        <SelectItem value="freemium">Freemium</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={filters.tags?.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            tags: prev.tags?.includes(tag)
                              ? prev.tags.filter(t => t !== tag)
                              : [...(prev.tags || []), tag]
                          }));
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Ordenação */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">🔄 Ordenar por</label>
                    <Select
                      value={filters.sortBy || 'relevance'}
                      onValueChange={(value) => 
                        setFilters(prev => ({ ...prev, sortBy: value as 'relevance' | 'rating' | 'name' | 'popularity' | 'newest' }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevância</SelectItem>
                        <SelectItem value="rating">Avaliação</SelectItem>
                        <SelectItem value="name">Nome</SelectItem>
                        <SelectItem value="popularity">Popularidade</SelectItem>
                        <SelectItem value="newest">Mais recentes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">⬆️ Ordem</label>
                    <Select
                      value={filters.sortOrder || 'desc'}
                      onValueChange={(value) => 
                        setFilters(prev => ({ ...prev, sortOrder: value as 'asc' | 'desc' }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Decrescente</SelectItem>
                        <SelectItem value="asc">Crescente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filtros ativos */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.categories?.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <Badge key={categoryId} variant="secondary" className="bg-green-100 text-green-800">
                    📁 {category.name}
                    <button
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        categories: prev.categories?.filter(c => c !== categoryId)
                      }))}
                      className="ml-1 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}

              {filters.minRating && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  ⭐ {filters.minRating}+ estrelas
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, minRating: undefined }))}
                    className="ml-1 hover:text-yellow-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.pricing && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  💰 {filters.pricing}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, pricing: undefined }))}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-800">
                  🏷️ {tag}
                  <button
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      tags: prev.tags?.filter(t => t !== tag)
                    }))}
                    className="ml-1 hover:text-purple-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearch;
