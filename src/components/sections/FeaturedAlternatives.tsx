import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFeaturedProducts } from "@/hooks/useFirebase";
import { products } from "@/data"; // Fallback para dados locais

const FeaturedAlternatives = () => {
  // Tentar usar dados do Firebase, com fallback para dados locais
  const { data: firebaseProducts, isLoading, error } = useFeaturedProducts(4);
  
  // Se Firebase falhar, usar dados locais
  const featuredProducts = firebaseProducts?.length ? firebaseProducts : products.slice(0, 4);

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              className="group hover:shadow-elegant transition-all duration-300 border-border/50 bg-gradient-card"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center text-2xl">
                      {product.logo}
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="category">{product.category}</Badge>
                        <Badge variant="price">{product.pricing[0]?.price || "Consultar"}</Badge>
                        {product.isUnicorn && (
                          <Badge variant="tech">🦄</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {product.shortDescription}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Principais recursos:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>Desde {product.foundedYear}</span>
                  <span>{product.userCount} usuários</span>
                </div>
                
                <Button variant="default" className="w-full" asChild>
                  <a href={`/produto/${product.slug}`}>
                    Ver Detalhes
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="accent" size="lg" asChild>
            <a href="/alternativas">
              Ver Todas as Alternativas
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAlternatives;