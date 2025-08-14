import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { products, categories } from '@/data';
import { Product, Category } from '@/types';

interface SearchSystemProps {
  onResultClick?: (result: Product | Category, type: 'product' | 'category') => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

const SearchSystem = ({ 
  onResultClick, 
  placeholder = "Buscar alternativas ou categorias...",
  showFilters = true,
  className = ""
}: SearchSystemProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Use produtos locais em vez do Firebase
  const searchResults = useMemo(() => {
    if (searchTerm.length < 2) return [];
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return products.filter(product => {
      // Garantir que só produtos brasileiros apareçam
      if (!product.location || !product.location.includes('BR')) {
        return false;
      }
      
      const searchableText = [
        product.name,
        product.description,
        product.shortDescription || '',
        product.category,
        ...(product.features || []),
        ...(product.tags || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(lowerSearchTerm);
    });
  }, [searchTerm]);
  
  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (searchTerm.length < 2) return [];
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return categories.filter(category => 
      category.title?.toLowerCase().includes(lowerSearchTerm) ||
      category.description.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm]);
  
  // Filter products by category if selected
  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all' 
      ? searchResults
      : searchResults.filter(product => 
          product.categorySlug === selectedCategory || 
          product.category === selectedCategory
        );
  }, [searchResults, selectedCategory]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Open dropdown when typing
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);
  
  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setIsOpen(false);
  };
  
  const handleResultClick = (result: Product | Category, type: 'product' | 'category') => {
    onResultClick?.(result, type);
    setIsOpen(false);
    // Keep the search term for context
  };
  
  const hasResults = filteredCategories.length > 0 || filteredProducts.length > 0;
  const showResults = isOpen && searchTerm.length >= 2;
  
  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base border-border/50 focus:border-primary"
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 mt-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedCategory !== 'all' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="h-8"
            >
              Limpar filtro
            </Button>
          )}
        </div>
      )}
      
      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-border/50 shadow-lg max-h-96 overflow-hidden">
          <CardContent className="p-0">
            {hasResults ? (
              <div className="max-h-96 overflow-y-auto">
                {/* Categories Results */}
                {filteredCategories.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      📁 Categorias ({filteredCategories.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredCategories.slice(0, 3).map((category) => (
                        <div
                          key={category.slug}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleResultClick(category, 'category')}
                        >
                          <div className="text-2xl">{category.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {category.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {products.filter(p => p.categorySlug === category.slug).length} produtos
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Separator */}
                {filteredCategories.length > 0 && filteredProducts.length > 0 && (
                  <Separator />
                )}
                
                {/* Products Results */}
                {filteredProducts.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      🚀 Alternativas ({filteredProducts.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredProducts.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleResultClick(product, 'product')}
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm overflow-hidden">
                            {product.logo && product.logo.startsWith('http') ? (
                              <img src={product.logo} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              product.logo || '🚀'
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {product.shortDescription || product.description}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              ⭐ {product.averageRating}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {filteredProducts.length > 5 && (
                      <div className="mt-3 pt-2 border-t border-border/50">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={() => {
                            // Navigate to search results page
                            window.location.href = `/buscar?q=${encodeURIComponent(searchTerm)}`;
                          }}
                        >
                          Ver todos os {filteredProducts.length} resultados
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <div className="text-sm font-medium text-muted-foreground">
                  Nenhum resultado encontrado
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Tente termos diferentes ou navegue pelas categorias
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchSystem;
