import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Category, Product } from "@/types";

// Mapeamento de ícones
import * as LucideIcons from "lucide-react";
const iconMap: Record<string, React.ElementType> = {
  MessageCircle: LucideIcons.MessageCircle,
  Code: LucideIcons.Code,
  Palette: LucideIcons.Palette,
  BookOpen: LucideIcons.BookOpen,
  TrendingUp: LucideIcons.TrendingUp,
  Zap: LucideIcons.Zap,
};


const Categorias = () => {  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catSnap = await getDocs(collection(db, "categories"));
        const prodSnap = await getDocs(collection(db, "products"));
        setCategories(catSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            slug: data.slug,
            title: data.title,
            description: data.description,
            icon: data.icon,
            color: data.color,
            featured: data.featured,
            ...data
          } as Category;
        }));
        setProducts(prodSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            shortDescription: data.shortDescription,
            category: data.category,
            categorySlug: data.categorySlug,
            logo: data.logo,
            pricing: data.pricing,
            tags: data.tags,
            features: data.features,
            location: data.location,
            userCount: data.userCount,
            foundedYear: data.foundedYear,
            isUnicorn: data.isUnicorn,
            ...data
          } as Product;
        }));
        setError(null);
      } catch (err) {
        setError("Erro ao carregar dados do Firebase.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProductsByCategory = (categorySlug: string) => {
    return products.filter(product => product.categorySlug === categorySlug);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Categorias | AlternativaBR",
    description: "Explore todas as categorias de ferramentas e serviços brasileiros disponíveis no AlternativaBR.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((category, index) => ({
        "@type": "Thing",
        position: index + 1,
        name: category.name,
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
            {loading ? (
              <div className="text-center py-10 text-muted-foreground">Carregando categorias...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
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
                            <div className={`w-16 h-16 rounded-xl ${category.color || ''} flex items-center justify-center text-3xl`}>
                              {(() => {
                                const IconComponent = iconMap[category.icon as string] || LucideIcons.Box;
                                return <IconComponent className="w-10 h-10" />;
                              })()}
                            </div>
                            <div>
                              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {category.name}
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
            )}
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
