import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
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
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/categorias" className="text-foreground hover:text-primary transition-colors">
              Categorias
            </Link>
            <Link to="/alternativas" className="text-foreground hover:text-primary transition-colors">
              Alternativas
            </Link>
            <a href="#sobre" className="text-foreground hover:text-primary transition-colors">
              Sobre
            </a>
            <Button variant="outline" size="sm">
              Adicionar Produto
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;