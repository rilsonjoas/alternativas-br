import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface SearchSystemProps {
  onResultClick?: (result: Product, type: 'product') => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

const SearchSystem = ({ 
  onResultClick, 
  placeholder = "Buscar alternativas...",
  showFilters = true,
  className = ""
}: SearchSystemProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const productsSnap = await getDocs(collection(db, 'products'));
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    }
    fetchData();
  }, []);

  const searchResults = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return products.filter(product => {
      const searchableText = [
        product.name,
        product.description,
        product.shortDescription || '',
        ...(product.features || []),
        ...(product.tags || [])
      ].join(' ').toLowerCase();
      return searchableText.includes(lowerSearchTerm);
    });
  }, [searchTerm, products]);
  
  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
  };
  
  const handleResultClick = (result: Product, type: 'product') => {
    onResultClick?.(result, type);
    setIsOpen(false);
  };
  
  const hasResults = searchResults.length > 0;
  const showResults = isOpen && searchTerm.length >= 2;
  
  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
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
      
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-border/50 shadow-lg max-h-96 overflow-hidden">
          <CardContent className="p-0">
            {hasResults ? (
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    🚀 Alternativas ({searchResults.length})
                  </h4>
                  <div className="space-y-2">
                    {searchResults.slice(0, 5).map((product) => (
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
                          {product.tags && product.tags.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {product.tags[0]}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <div className="text-sm font-medium text-muted-foreground">
                  Nenhum resultado encontrado
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Tente termos diferentes
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