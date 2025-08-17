import { useParams, Navigate } from "react-router-dom";
import { useProductBySlug } from "@/hooks/useFirebase";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Star, Users, Calendar, MapPin, CreditCard } from "lucide-react";

// Tipagem explícita para planos de preço
interface PricingPlan {
  name: string;
  description: string;
  price: string;
}

const ProdutoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProductBySlug(slug || "");

  if (!slug) {
    return <Navigate to="/alternativas" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="w-full h-32 mb-4" />
          <Skeleton className="w-full h-64" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/alternativas" replace />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    applicationCategory: product.category,
    operatingSystem: "Web",
    offers: product.pricing?.map(plan => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.description,
      price: plan.price?.includes("Gratuito") ? "0" : plan.price,
      priceCurrency: "BRL"
    })),
    dateCreated: product.foundedYear
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={product.metaTitle || `${product.name} | Alternativas BR`}
        description={product.metaDescription || product.description}
        canonical={`/produtos/${product.slug}`}
        jsonLd={jsonLd}
      />
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl">
                {product.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>
                  {product.isUnicorn && (
                    <Badge variant="category">🦄 Unicórnio</Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg">
                  {product.shortDescription}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{product.userCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Fundada em {product.foundedYear}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{product.location}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Card className="border-border/50 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Preços
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.pricing?.map((plan: PricingPlan, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-semibold">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{plan.price}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex gap-3">
              <Button className="flex-1" asChild>
                <a href={product.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visitar Site
                </a>
              </Button>
            </div>
          </div>
        </div>
        <section className="mt-10">
          <Card className="border-border/50 bg-gradient-card">
            <CardHeader>
              <CardTitle>Sobre o {product.name}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProdutoPage;
