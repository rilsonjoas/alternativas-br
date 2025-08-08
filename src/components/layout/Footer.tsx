import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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
                <h3 className="text-xl font-bold">Alternativas BR</h3>
                <p className="text-sm text-background/70">Tecnologia Brasileira</p>
              </div>
            </div>
            <p className="text-background/80 mb-4 max-w-md">
              Promovendo o ecossistema de tecnologia brasileiro através da descoberta 
              de alternativas nacionais às ferramentas internacionais.
            </p>
            <Badge variant="outline" className="border-background/30 text-background">
              🇧🇷 Feito no Brasil
            </Badge>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/categorias" className="hover:text-background transition-colors">Categorias</Link></li>
              <li><Link to="/alternativas" className="hover:text-background transition-colors">Alternativas</Link></li>
              <li><Link to="/ranking" className="hover:text-background transition-colors">Ranking</Link></li>
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Comunidade</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/sobre" className="hover:text-background transition-colors">Sobre</Link></li>
              <li><a href="#contato" className="hover:text-background transition-colors">Contato</a></li>
              <li><Link to="/adicionar" className="hover:text-background transition-colors">Adicionar Produto</Link></li>
              <li><a href="#newsletter" className="hover:text-background transition-colors">Newsletter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-background/60">
            © 2024 Alternativas BR. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#privacidade" className="text-sm text-background/60 hover:text-background transition-colors">
              Privacidade
            </a>
            <a href="#termos" className="text-sm text-background/60 hover:text-background transition-colors">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;