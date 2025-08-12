import { useParams, Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Star, Users, Calendar } from "lucide-react";
import { useCategoryPage } from "@/hooks/useFirebase";
import { getCategoryWithProducts } from "@/data";
import { Category } from "@/types";

// Type for categories that can have either title or name
type CategoryDisplay = Category | (Omit<Category, 'title'> & { name: string; title?: string });

// Helper function to get category title
const getCategoryTitle = (category: CategoryDisplay): string => {
  if ('title' in category && category.title) return category.title;
  if ('name' in category && category.name) return category.name;
  return 'Categoria';
};

const CategoryTemplate = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Always call hooks at the top level
  const { category: firebaseCategory, products: firebaseProducts, isLoading, error } = useCategoryPage(slug || '');
  
  if (!slug) {
    return <Navigate to="/categorias" replace />;
  }
  
  // Fallback to local data if Firebase fails
  const localCategoryData = getCategoryWithProducts(slug);
  
  // Use Firebase data if available, otherwise use local data
  const categoryData = firebaseCategory && firebaseProducts 
    ? { ...firebaseCategory, products: firebaseProducts }
    : localCategoryData;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-16 h-16 rounded-xl" />
              <div>
                <Skeleton className="w-64 h-8 mb-2" />
                <Skeleton className="w-96 h-4" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-24 h-6" />
            </div>
          </div>
        </header>

        <main>
          <section className="py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="border-border/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-12 h-12 rounded-xl" />
                          <div>
                            <Skeleton className="w-32 h-5 mb-2" />
                            <Skeleton className="w-20 h-4" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="w-full h-12" />
                      <div className="flex gap-4">
                        <Skeleton className="w-16 h-4" />
                        <Skeleton className="w-16 h-4" />
                        <Skeleton className="w-16 h-4" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-24 h-8" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }
  
  if (!categoryData) {
    return <Navigate to="/categorias" replace />;
  }

  const { products, ...category } = categoryData;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.metaTitle || `${getCategoryTitle(category)} | Alternativas BR`,
    description: category.metaDescription || category.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "SoftwareApplication",
        position: index + 1,
        name: product.name,
        description: product.description,
        applicationCategory: product.category,
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: product.pricing?.[0]?.price?.includes("Gratuito") ? "0" : product.pricing?.[0]?.price,
          priceCurrency: "BRL"
        }
      }))
    }
  };

  const categoryTitle = getCategoryTitle(category);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={category.metaTitle || `${categoryTitle} | Alternativas BR`}
        description={category.metaDescription || `Descubra as melhores alternativas brasileiras em ${categoryTitle.toLowerCase()}.`}
        canonical={`/categorias/${category.slug}`}
        jsonLd={jsonLd}
      />
      <Header />
      
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-xl ${category.color} flex items-center justify-center text-3xl`}>
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{categoryTitle}</h1>
              <p className="text-muted-foreground mt-2">
                {category.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="category">{products.length} produtos encontrados</Badge>
            <Badge variant="outline">Atualizado recentemente</Badge>
            {category.featured && (
              <Badge variant="secondary">Categoria em destaque</Badge>
            )}
          </div>
        </div>
      </header>

      <main>
        {products.length > 0 ? (
          <section className="py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-card transition-all duration-300 border-border/50 bg-gradient-card">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                            {product.logo}
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {product.name}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        {product.isUnicorn && (
                          <Badge variant="category">🦄</Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        {product.shortDescription}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{product.userCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{product.foundedYear}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">A partir de </span>
                          <span className="font-semibold text-foreground">
                            {product.pricing[0]?.price || "Consultar"}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a 
                            href={`/produto/${product.slug}`}
                            className="flex items-center gap-2"
                          >
                            Ver detalhes
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-20 text-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Em breve!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Estamos preparando uma seleção incrível de alternativas brasileiras em {categoryTitle.toLowerCase()}.
                </p>
                <Button variant="hero" asChild>
                  <a href="/adicionar">Sugerir Produto</a>
                </Button>
              </div>
            </div>
          </section>
        )}

        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Não encontrou o que procurava?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ajude-nos a tornar este catálogo ainda mais completo. Sugira uma ferramenta brasileira de {categoryTitle.toLowerCase()}.
            </p>
            <Button variant="hero" asChild>
              <a href="/adicionar">Sugerir Produto</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryTemplate;
