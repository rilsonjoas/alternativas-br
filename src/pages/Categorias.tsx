import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { categories, getProductsByCategory } from "@/data";

const Categorias = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Categorias | Alternativas BR",
    description: "Explore todas as categorias de ferramentas e serviços brasileiros disponíveis no Alternativas BR.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((category, index) => ({
        "@type": "Thing",
        position: index + 1,
        name: category.title,
        description: category.description,
        url: `/categorias/${category.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Categorias | Alternativas BR"
        description="Explore todas as categorias de ferramentas e serviços brasileiros. Desenvolvimento, Marketing, Design, Produtividade, Fintech e E-commerce."
        canonical="/categorias"
        jsonLd={jsonLd}
      />
      <Header />
      
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore por Categorias
            </h1>
            <p className="text-muted-foreground text-lg">
              Descubra ferramentas e serviços brasileiros organizados por categoria. 
              Cada categoria reúne as melhores alternativas nacionais para suas necessidades.
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryProducts = getProductsByCategory(category.slug);
                
                return (
                  <Card 
                    key={category.id} 
                    className="group hover:shadow-card transition-all duration-300 border-border/50 bg-gradient-card"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-xl ${category.color} flex items-center justify-center text-3xl`}>
                            {category.icon}
                          </div>
                          <div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {category.title}
                            </CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary">
                                {categoryProducts.length} produtos
                              </Badge>
                              {category.featured && (
                                <Badge variant="category">Destaque</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {category.description}
                      </p>
                      
                      {categoryProducts.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">
                            Principais ferramentas:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {categoryProducts.slice(0, 3).map((product) => (
                              <Badge key={product.id} variant="outline" className="text-xs">
                                {product.name}
                              </Badge>
                            ))}
                            {categoryProducts.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{categoryProducts.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          asChild
                        >
                          <a 
                            href={`/categorias/${category.slug}`}
                            className="flex items-center justify-center gap-2"
                          >
                            Explorar categoria
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Não encontrou sua categoria?
              </h2>
              <p className="text-muted-foreground mb-6">
                Estamos sempre expandindo nosso catálogo. Sugira uma nova categoria ou ferramenta brasileira 
                que você gostaria de ver listada aqui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <a href="/adicionar">Sugerir Ferramenta</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/contato">Sugerir Categoria</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categorias;
