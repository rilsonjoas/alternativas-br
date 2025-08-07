import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">BR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Alternativas</h1>
              <p className="text-xs text-muted-foreground -mt-1">Tecnologia Brasileira</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#categorias" className="text-foreground hover:text-primary transition-colors">
              Categorias
            </a>
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