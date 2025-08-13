import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Grid, List, Search, Filter } from 'lucide-react';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { ProductComparison } from '@/components/ProductComparison';
import { Product } from '@/types';
import { products, categories } from '@/data';
import SEO from '@/components/SEO';

type ViewMode = 'grid' | 'list';

interface FilterOptions {
  search: string;
  categories: string[];
  tags: string[];
  countries: string[];
  pricing: string[];
  rating: { min: number; max: number };
  yearFounded: { min?: number; max?: number };
  features: string[];
  certifications: string[];
  sustainability: string[];
  sortBy: 'name' | 'rating' | 'reviews' | 'newest' | 'popular';
  sortOrder: 'asc' | 'desc';
}

function ExploreProducts() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    categories: [],
    tags: [],
    countries: [],
    sustainability: [],
    certifications: [],
    pricing: [],
    rating: { min: 0, max: 5 },
    yearFounded: {},
    features: [],
    sortBy: 'popular',
    sortOrder: 'desc'
  });

  // Processar categorias disponíveis dos produtos
  const availableCategories = categories.map(cat => ({
    id: cat.slug,
    name: cat.title,
    count: products.filter(p => p.categorySlug === cat.slug).length
  }));

  // Processar países disponíveis
  const availableCountries = [
    { code: 'BR', name: 'Brasil', flag: '🇧🇷', count: products.filter(p => p.location.includes('BR')).length }
  ];

  const filteredProducts = products.filter(product => {
    // Garantir que só produtos brasileiros apareçam
    if (!product.location || !product.location.includes('BR')) {
      return false;
    }
    
    const searchTerm = filters.search.toLowerCase();
    if (searchTerm) {
      const searchableText = [
        product.name,
        product.description,
        product.category,
        ...(product.features || []),
        ...(product.tags || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) return false;
    }
    
    // Filtro por categoria
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(product.categorySlug)) return false;
    }
    
    // Filtro por rating
    if (filters.rating.min > 0 || filters.rating.max < 5) {
      const productRating = product.averageRating || product.rating || 0;
      if (productRating < filters.rating.min || productRating > filters.rating.max) return false;
    }
    
    return true;
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProducts(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length < 3) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const ProductCard = ({ product, isSelected, onSelect }: { 
    product: Product; 
    isSelected: boolean; 
    onSelect: (product: Product) => void; 
  }) => (
    <Card className={`h-full transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={product.logo} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant="secondary" className="text-xs">{product.category}</Badge>
            </div>
          </div>
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(product)}
          >
            {isSelected ? 'Selecionado' : 'Comparar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{product.shortDescription}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>⭐ {product.rating}/5</span>
            <span>{product.reviewCount} reviews</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <SEO 
        title="Explorar Produtos - Alternativas BR"
        description="Descubra e compare alternativas brasileiras de software e serviços"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar com Filtros */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableCategories={availableCategories}
                  availableTags={[]}
                  availableCountries={availableCountries}
                />
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Explorar Produtos</h1>
                <p className="text-gray-600 mt-1">
                  Encontrados {filteredProducts.length} produtos
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Filtros
                </Button>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Busca */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Produtos Selecionados para Comparação */}
            {selectedProducts.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Produtos selecionados para comparação</h3>
                    <p className="text-sm text-gray-600">
                      {selectedProducts.length}/3 produtos selecionados
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
                    >
                      Limpar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowComparison(true)}
                      disabled={selectedProducts.length < 2}
                    >
                      Comparar ({selectedProducts.length})
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid de Produtos */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.some(p => p.id === product.id)}
                  onSelect={handleProductSelect}
                />
              ))}
            </div>

            {/* Sem resultados */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Comparação */}
        {showComparison && selectedProducts.length >= 2 && (
          <ProductComparison
            products={selectedProducts}
            onClose={() => setShowComparison(false)}
            onRemoveProduct={(productId) => {
              setSelectedProducts(prev => prev.filter(p => p.id !== productId));
            }}
          />
        )}
      </div>
    </>
  );
}

export default ExploreProducts;
