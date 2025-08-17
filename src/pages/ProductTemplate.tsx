import { useParams, Navigate, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ExternalLink, 
  Star, 
  Users, 
  Calendar, 
  MapPin, 
  Shield, 
  Globe, 
  CreditCard,
  CheckCircle,
  Zap,
  Heart
} from "lucide-react";
import { useProductBySlug, useProductsByCategory } from "@/hooks/useFirebase";

const ProductTemplate = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Always call hooks at the top level
  const { data: firebaseProduct, isLoading, error } = useProductBySlug(slug || '');
  
  // We need to get the category slug for related products, but we need a fallback
  const tempProduct = firebaseProduct;
  const categorySlug = tempProduct?.categorySlug || tempProduct?.category || '';
  
  const { data: firebaseRelatedProducts } = useProductsByCategory(categorySlug);
  
  if (!slug) {
    return <Navigate to="/alternativas" replace />;
  }
  
  const product = firebaseProduct;
  // Garante que arrays não venham como undefined ou string
  const pricingArray = Array.isArray(product?.pricing) ? product.pricing : [];
  const tagsArray = Array.isArray(product?.tags) ? product.tags : [];
  const featuresArray = Array.isArray(product?.features) ? product.features : [];
  const relatedProducts = firebaseRelatedProducts || [];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div>
                  <Skeleton className="w-48 h-8 mb-2" />
                  <Skeleton className="w-32 h-5" />
                </div>
              </div>
              
              <Skeleton className="w-full h-24" />
              
              <div className="flex gap-2">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-20 h-6" />
              </div>
              
              <Skeleton className="w-full h-64" />
            </div>
            
            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="w-32 h-6" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="w-full h-8" />
                  <Skeleton className="w-full h-8" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </CardContent>
              </Card>
            </div>
          </div>
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
    creator: {
      "@type": "Organization",
      name: "Empresa Brasileira",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BR",
        addressLocality: product.location
      }
    },
    offers: pricingArray.map(plan => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.description,
      price: plan.price.includes("Gratuito") ? "0" : plan.price,
      priceCurrency: "BRL"
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      // Removido: ratingValue
      bestRating: "5",
      worstRating: "1"
    },
    dateCreated: product.foundedYear
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={product.metaTitle || `${product.name} | Alternativas BR`}
        description={product.metaDescription || product.description}
        canonical={`/produto/${product.slug}`}
        jsonLd={jsonLd}
      />
      <Header />
      
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
          
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Fundada em {product.companyInfo?.foundedYear || product.foundedYear || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location?.city ? product.location.city + ', ' : ''}{product.location?.country || '-'}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {tagsArray.map((tag) => (
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
                  <div className="text-muted-foreground text-sm">
                    {product.pricing?.description || product.pricing?.startingPrice || '-'}
                  </div>
                  {pricingArray.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {pricingArray.map((plan, index) => (
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
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex gap-3">
                <Button className="flex-1" asChild>
                  <a href={product.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Visitar Site
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={product.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Tabs defaultValue="sobre" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="recursos">Recursos</TabsTrigger>
            <TabsTrigger value="alternativas">Similares</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sobre" className="space-y-6">
            <Card className="border-border/50 bg-gradient-card">
              <CardHeader>
                <CardTitle>Sobre o {product.name}</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                
                <Separator className="my-6" />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Informações da Empresa
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Empresa:</span>
                        <span>{product.companyInfo?.name || product.name || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fundação:</span>
                        <span>{product.companyInfo?.foundedYear || product.foundedYear || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sede:</span>
                        <span>{product.companyInfo?.headquarters || `${product.location?.city ? product.location.city + ', ' : ''}${product.location?.country || '-'}`}</span>
                      </div>
                    
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Site:</span>
                        <span>{product.companyInfo?.website ? (<a href={product.companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">{product.companyInfo.website}</a>) : '-'}</span>
                      </div>
                    
              
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Características
                    </h3>
                    <div className="space-y-2">
                      {product.isUnicorn && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Empresa Unicórnio 🦄</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>100% Brasileira</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Suporte em Português</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Adequada à legislação brasileira</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recursos" className="space-y-6">
            <Card className="border-border/50 bg-gradient-card">
              <CardHeader>
                <CardTitle>Principais Recursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {featuresArray.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avaliacoes" className="space-y-6">
            {relatedProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="border-border/50 bg-gradient-card hover:shadow-card transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                          {relatedProduct.logo}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{relatedProduct.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {relatedProduct.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        {relatedProduct.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {/* Removido: relatedProduct.averageRating */}
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/produto/${relatedProduct.slug}`}>
                            Ver detalhes
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border/50 bg-gradient-card">
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma alternativa similar encontrada</h3>
                  <p className="text-muted-foreground">
                    Explore outras categorias para descobrir mais ferramentas brasileiras.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProductTemplate;
