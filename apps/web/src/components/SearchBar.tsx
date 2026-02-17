import { useState, useEffect } from "react";
import { Search, X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { productService } from "@/lib/services/productService";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  className?: string;
  showButton?: boolean;
  onResultClick?: (product: Product) => void;
  variant?: "default" | "hero";
}

const SearchBar = ({ 
  size = "md", 
  placeholder = "Buscar produtos, alternativas, categorias...",
  className,
  showButton = true,
  onResultClick,
  variant = "default"
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const sizeClasses = {
    sm: "h-9 text-sm",
    md: "h-11 text-base",
    lg: "h-12 sm:h-14 text-base sm:text-lg"
  };

  const buttonSizeClasses = {
    sm: "h-7 px-3 text-xs",
    md: "h-9 px-4 text-sm", 
    lg: "h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base"
  };

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchTerm.trim() && searchTerm.length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await productService.search(searchTerm, false); // false para incluir produtos estrangeiros também
          setResults(searchResults.slice(0, 5)); // Limitar a 5 resultados
          setShowResults(true);
        } catch (error) {
          console.error("Erro na busca:", error);
          setResults([]);
        }
        setIsLoading(false);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleResultClick = (product: Product) => {
    if (onResultClick) {
      onResultClick(product);
    } else {
      navigate(`/produto/${product.slug}`);
    }
    setShowResults(false);
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setShowResults(false);
  };

  const containerClasses = variant === "hero" 
    ? "relative w-full max-w-2xl"
    : "relative w-full";

  const inputClasses = variant === "hero"
    ? cn(
        "pl-16 pr-20 border-2 border-border/30 bg-background/90 backdrop-blur-sm",
        "focus:border-primary focus:ring-2 focus:ring-primary/10",
        "shadow-xl rounded-2xl transition-all duration-300",
        "hover:shadow-2xl hover:border-border/50",
        "placeholder:text-muted-foreground/70",
        sizeClasses[size],
        className
      )
    : cn(
        "pl-10 pr-12 border border-border/60 bg-background/95",
        "focus:border-primary focus:ring-1 focus:ring-primary/10",
        "rounded-lg transition-all duration-200",
        "hover:border-border/80 hover:bg-background",
        "placeholder:text-muted-foreground/80",
        sizeClasses[size],
        className
      );

  return (
    <div className={containerClasses}>
      <div className="relative">
        <Search className={cn(
          "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground/70 z-10",
          variant === "hero" ? "left-5 h-6 w-6" : "left-3 h-4 w-4"
        )} />
        
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className={inputClasses}
          onFocus={() => searchTerm && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-6 w-6 p-0",
              "hover:bg-muted/50 hover:text-foreground transition-colors",
              variant === "hero" 
                ? "right-16" 
                : showButton 
                  ? "right-10" 
                  : "right-2"
            )}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        {showButton && (
          <Button
            onClick={handleSearch}
            size={size === "md" ? "default" : size}
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 transition-all duration-200",
              variant === "hero" ? "right-2" : "right-1",
              buttonSizeClasses[size],
              variant === "hero" && [
                "bg-gradient-to-r from-primary to-primary/90",
                "hover:from-primary/90 hover:to-primary/80",
                "text-primary-foreground font-medium",
                "shadow-lg hover:shadow-xl",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              ]
            )}
            disabled={!searchTerm.trim()}
          >
            {variant === "hero" ? "Buscar" : <Search className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Resultados da busca */}
      {showResults && results.length > 0 && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm",
          "border border-border/50 shadow-2xl z-50 max-h-80 overflow-y-auto",
          variant === "hero" ? "rounded-2xl" : "rounded-lg"
        )}>
          <div className="p-3">
            <div className="text-xs text-muted-foreground mb-3 px-2 font-medium">
              {isLoading ? "Buscando..." : `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`}
            </div>
            
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleResultClick(product)}
                className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm"
              >
                <img
                  src={product.logo}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-logo.png";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate text-foreground">{product.name}</h4>
                  <p className="text-xs text-muted-foreground truncate leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-muted/60 px-2 py-1 rounded-md font-medium">
                      {product.tags?.[0] || 'Software'}
                    </span>
                    {product.location?.country === "Brasil" && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                        <Flag className="w-3 h-3" /> Nacional
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {searchTerm && (
              <div
                onClick={handleSearch}
                className="flex items-center gap-3 p-3 hover:bg-primary/5 rounded-lg cursor-pointer transition-all duration-200 border-t border-border/30 mt-2 pt-3"
              >
                <Search className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground font-medium">
                  Ver todos os resultados para <span className="text-primary">"{searchTerm}"</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {showResults && results.length === 0 && searchTerm && !isLoading && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm",
          "border border-border/50 shadow-2xl z-50 p-6",
          variant === "hero" ? "rounded-2xl" : "rounded-lg"
        )}>
          <div className="text-center text-muted-foreground">
            <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 opacity-60" />
            </div>
            <p className="text-sm font-medium mb-1">Nenhum resultado encontrado para "{searchTerm}"</p>
            <p className="text-xs">Tente termos diferentes ou mais específicos</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;