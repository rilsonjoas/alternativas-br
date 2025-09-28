import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";
import heroImage from "@/assets/hero-image.jpg";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";


const Hero = () => {
  const [produtosCount, setProdutosCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const produtosSnap = await getCountFromServer(collection(db, "products"));
        setProdutosCount(produtosSnap.data().count);
      } catch (err) {
        setProdutosCount(null);
      }
    }
    fetchCounts();
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <Badge variant="tech" className="mb-6">
              🇧🇷 Tecnologia Nacional
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Descubra as melhores{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                alternativas brasileiras
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Uma plataforma curada para descobrir softwares e serviços
              nacionais que rivalizam com as melhores ferramentas
              internacionais. Fortaleça o ecossistema tech brasileiro.
            </p>

            {/* Search Bar - Destaque na página inicial */}
            <div className="mb-8 sm:mb-10 w-full max-w-2xl mx-auto lg:mx-0">
              <SearchBar 
                variant="hero"
                size="lg"
                placeholder="Busque por produtos, categorias, alternativas..."
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-3 text-center lg:text-left px-2 lg:px-0">
                💡 Experimente buscar por "banco", "e-commerce", "contabilidade"...
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg">
                <a href="/alternativas">Explorar Alternativas</a>
              </Button>
              <Button variant="outline" size="lg">
                <a href="/adicionar">Adicionar Produto</a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start">
              <Badge variant="category">
                {produtosCount !== null
                  ? `${produtosCount} produtos`
                  : "- produtos"}
              </Badge>
              <Badge variant="category">100% brasileiro</Badge>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={heroImage}
                alt="Tecnologia brasileira moderna"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-accent rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;