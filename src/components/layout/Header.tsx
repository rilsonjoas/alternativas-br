import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import SearchSystem from "@/components/SearchSystem";
import { Product, Category } from "@/types";

const Header = () => {
  const navigate = useNavigate();
  
  const handleSearchResultClick = (result: Product | Category, type: 'product' | 'category') => {
    if (type === 'product') {
      navigate(`/produto/${result.slug}`);
    } else {
      navigate(`/categorias/${result.slug}`);
    }
  };

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" aria-label="Ir para a página inicial" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">BR</span>
            </div>
            <div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Alternativas</span>
              <p className="text-xs text-muted-foreground -mt-1">Tecnologia Brasileira</p>
            </div>
          </Link>
          
          {/* Search System - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchSystem
              onResultClick={handleSearchResultClick}
              placeholder="Buscar alternativas..."
              showFilters={false}
            />
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/categorias" className="text-foreground hover:text-primary transition-colors">
              Categorias
            </Link>
            <Link to="/alternativas" className="text-foreground hover:text-primary transition-colors">
              Alternativas
            </Link>
            <Link to="/ranking" className="text-foreground hover:text-primary transition-colors">
              Ranking
            </Link>
            <Link to="/sobre" className="text-foreground hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link to="/contato" className="text-foreground hover:text-primary transition-colors">
              Contato
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link to="/adicionar">Adicionar Produto</Link>
            </Button>
          </nav>
          
          {/* Mobile menu button and search */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/buscar">🔍</Link>
            </Button>
          </div>
        </div>
        
        {/* Mobile Search - Full width on mobile */}
        <div className="md:hidden pb-4">
          <SearchSystem
            onResultClick={handleSearchResultClick}
            placeholder="Buscar alternativas..."
            showFilters={false}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;