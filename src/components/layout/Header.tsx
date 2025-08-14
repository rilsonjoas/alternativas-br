import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchSystem from "@/components/SearchSystem";
import { Product, Category } from "@/types";
import { LogOut, Shield } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  
  const handleSearchResultClick = (result: Product | Category, type: 'product' | 'category') => {
    if (type === 'product') {
      navigate(`/produto/${result.slug}`);
    } else {
      navigate(`/categorias/${result.slug}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            <Link to="/sobre" className="text-foreground hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link to="/contato" className="text-foreground hover:text-primary transition-colors">
              Contato
            </Link>
            
            {/* Admin Auth Section - Hidden from public */}
            {!loading && user && user.role === 'admin' && (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/adicionar">Adicionar Produto</Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback>{getUserInitials(user.displayName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || "Admin"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Administração
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button and search */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/buscar">🔍</Link>
            </Button>
            
            {/* Admin mobile avatar - only for admins */}
            {!loading && user && user.role === 'admin' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                <AvatarFallback>{getUserInitials(user.displayName)}</AvatarFallback>
              </Avatar>
            )}
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