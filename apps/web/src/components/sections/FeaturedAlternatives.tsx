import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/hooks/useFirebase";
import ProductCard from "@/components/ProductCard";

const FeaturedAlternatives = () => {
  const { data: firebaseProducts, isLoading, error } = useFeaturedProducts(4);
  const featuredProducts = firebaseProducts || [];

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="tech" className="mb-4">
              ⭐ Destaques
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Alternativas em Destaque
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Conheça algumas das melhores soluções brasileiras que estão transformando o mercado
            </p>
            <div className="text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-4 py-2 rounded-lg">
              🔍 Nenhum produto em destaque encontrado. {error && `Erro: ${error.message}`}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="tech" className="mb-4">
            ⭐ Destaques
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Alternativas em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Conheça algumas das melhores soluções brasileiras que estão transformando o mercado
          </p>
          {error && (
            <div className="mt-4 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-4 py-2 rounded-lg">
              ⚠️ Exibindo dados locais (Firebase indisponível)
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="accent" size="lg" asChild>
            <Link to="/alternativas">
              Ver Todas as Alternativas
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAlternatives;