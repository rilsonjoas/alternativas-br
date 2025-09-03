import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/hooks/useFirebase";

const FeaturedAlternatives = () => {
  // Tentar usar dados do Firebase, com fallback para dados locais
  const { data: firebaseProducts, isLoading, error } = useFeaturedProducts(4);
  
  // Debug: log dos dados recebidos
  console.log('🔍 FeaturedAlternatives Debug:', {
    firebaseProducts,
    isLoading,
    error,
    productsLength: firebaseProducts?.length
  });
  
  // Se Firebase falhar, usar dados locais
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col justify-between h-full shadow-md border border-gray-100 bg-white rounded-2xl transition hover:shadow-xl hover:border-primary/40 cursor-pointer"
                onClick={() => window.location.href = `/produto/${product.slug}`}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalhes de ${product.name}`}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 shadow-sm">
                    {product.logo ? (
                      <img src={product.logo} alt={product.name} className="w-12 h-12 object-contain rounded-full" />
                    ) : (
                      <span className="text-3xl font-bold text-gray-400">{product.name[0]}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {product.tags?.map((tag) => (
                        <Badge key={tag} className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 text-xs font-semibold rounded-full shadow-sm">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pb-5">
                  <p className="text-sm text-gray-700 mb-1 min-h-[40px]">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-1">
                    {product.features?.map((feature) => (
                      <Badge key={feature} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold rounded-full shadow-sm">{feature}</Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 w-full bg-primary/5 text-primary border-primary hover:bg-primary/20 hover:text-primary-dark transition rounded-xl font-bold text-sm py-2 shadow"
                    asChild
                  >
                    <a href={product.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                      Visitar site
                    </a>
                  </Button>
                </CardContent>
              </Card>
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