import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Flag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BR</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">AlternativasBR</h3>
                <p className="text-sm text-background/70">Tecnologia Brasileira</p>
              </div>
            </div>
            <p className="text-background/80 mb-4 max-w-md">
              Promovendo o ecossistema de tecnologia brasileiro através da descoberta 
              de alternativas nacionais às ferramentas internacionais.
            </p>
            <Badge variant="outline" className="border-background/30 text-background bg-background/5 gap-2">
              <Flag className="w-3 h-3" /> Feito no Brasil
            </Badge>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/alternativas" className="hover:text-background transition-colors">Alternativas</Link></li>
              <li><Link to="/sobre" className="hover:text-background transition-colors">Sobre o Projeto</Link></li>
              <li><Link to="/adicionar" className="hover:text-background transition-colors">Contribuir</Link></li>
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Comunidade</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/sobre" className="hover:text-background transition-colors">Sobre</Link></li>
              <li><Link to="/contato" className="hover:text-background transition-colors">Contato</Link></li>
              <li><Link to="/parceiros" className="hover:text-background transition-colors font-medium text-primary-foreground/90">Para Empresas (Selos)</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} AlternativasBR. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacidade" className="text-sm text-background/60 hover:text-background transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="text-sm text-background/60 hover:text-background transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;