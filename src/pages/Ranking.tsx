import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useFirebase";
import { Product } from "@/types";

const Ranking = () => {
  const { data: products, isLoading, error } = useProducts();

  // Dados mock para demonstração enquanto Firebase não está configurado
  const mockProducts: Product[] = [
    {
      id: "rd-station",
      slug: "rd-station",
      name: "RD Station",
      category: "Marketing",
      categorySlug: "marketing",
      description: "Plataforma completa de automação de marketing e vendas",
      shortDescription: "Automação de marketing e vendas completa",
      logo: "/logos/rd-station.png",
      website: "https://rdstation.com.br",
      rating: 4.6,
      reviewCount: 1240,
      userCount: "100k+",
      foundedYear: "2011",
      location: "Florianópolis, SC",
      features: ["Automação", "Email Marketing", "Landing Pages"],
      pricing: [],
      isFeatured: true,
      tags: ["marketing", "automação", "vendas"],
    },
    {
      id: "vtex",
      slug: "vtex",
      name: "VTEX",
      category: "E-commerce",
      categorySlug: "ecommerce",
      description: "Plataforma global de comércio digital",
      shortDescription: "Plataforma completa de e-commerce",
      logo: "/logos/vtex.png",
      website: "https://vtex.com",
      rating: 4.5,
      reviewCount: 980,
      userCount: "50k+",
      foundedYear: "2000",
      location: "Rio de Janeiro, RJ",
      features: ["E-commerce", "Marketplace", "Omnichannel"],
      pricing: [],
      isFeatured: true,
      tags: ["ecommerce", "marketplace", "vendas"],
    },
    {
      id: "pipefy",
      slug: "pipefy",
      name: "Pipefy",
      category: "Produtividade",
      categorySlug: "produtividade",
      description: "Plataforma de automação de processos",
      shortDescription: "Automação e gestão de processos empresariais",
      logo: "/logos/pipefy.png",
      website: "https://pipefy.com",
      rating: 4.4,
      reviewCount: 840,
      userCount: "200k+",
      foundedYear: "2015",
      location: "São Paulo, SP",
      features: ["Automação", "Workflows", "Kanban"],
      pricing: [],
      isFeatured: true,
      tags: ["produtividade", "automação", "processos"],
    }
  ];

  // Usar dados do Firebase ou dados mock como fallback
  const availableProducts = products && products.length > 0 ? products : mockProducts;

  // Calcular o ranking baseado em rating e número de reviews
  const rankedProducts = availableProducts.slice()
    .sort((a, b) => {
      // Primeiro critério: rating
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      // Segundo critério: número de reviews
      return b.reviewCount - a.reviewCount;
    })
    .slice(0, 10); // Top 10

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: rankedProducts.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { 
        "@type": "SoftwareApplication", 
        name: product.name, 
        applicationCategory: product.category,
        url: `/produto/${product.slug}`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount
        }
      },
    })),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg text-muted-foreground">Carregando ranking...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Ranking | Alternativas BR"
        description="Top softwares brasileiros mais bem avaliados pela comunidade. Descubra os melhores produtos por categoria e rating."
        canonical="/ranking"
        jsonLd={jsonLd}
      />
      <Header />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="text-primary" /> Ranking de softwares brasileiros
          </h1>
          <p className="text-muted-foreground mt-2">
            Classificação baseada em avaliações e popularidade da comunidade.
          </p>
        </div>
      </header>

      <main>
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-6">
            {rankedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Nenhum produto encontrado</h2>
                <p className="text-muted-foreground">O ranking será atualizado conforme novos produtos forem adicionados.</p>
              </div>
            ) : (
              rankedProducts.map((product, idx) => (
                <article key={product.id} className="contents">
                  <Link to={`/produto/${product.slug}`} className="block">
                    <Card className="border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl flex items-center gap-3 group">
                            <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold">
                              {idx + 1}
                            </span>
                            <span className="group-hover:text-primary transition-colors">
                              {product.name}
                            </span>
                          </CardTitle>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.shortDescription}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-foreground">
                            <Star className="text-primary w-4 h-4" />
                            <span className="font-medium">{product.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground text-sm">/ 5.0</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <TrendingUp className="text-primary w-4 h-4" />
                            {product.reviewCount > 0 
                              ? `${product.reviewCount} avaliações`
                              : 'Sem avaliações'
                            }
                          </div>
                        </div>
                        <Progress value={(product.rating / 5) * 100} className="h-2" />
                        
                        {/* Tags do produto */}
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {product.tags.slice(0, 3).map((tag, tagIdx) => (
                              <Badge key={tagIdx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {product.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Nota sobre dados mock */}
        {(!products || products.length === 0) && (
          <section className="pb-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  <strong>Nota:</strong> Dados de demonstração sendo exibidos. 
                  Configure o Firebase para ver dados reais.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Ranking;
