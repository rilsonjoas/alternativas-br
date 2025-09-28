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
import { Separator } from "@/components/ui/separator";
import { 
  ExternalLink, 
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
      
      <header className="border-b border-border/50 bg-gradient-to-br from-background/95 to-primary/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-3xl bg-white border border-gray-200 shadow-lg flex items-center justify-center overflow-hidden">
                  {product.logo ? (
                    product.logo.startsWith('http') ? (
                      <img 
                        src={product.logo} 
                        alt={product.name} 
                        className="w-20 h-20 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback-logo') as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                    ) : (
                      <span className="text-4xl">{product.logo}</span>
                    )
                  ) : (
                    <div className="fallback-logo w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-gray-400">
                      {product.name[0]}
                    </div>
                  )}
                  {product.logo?.startsWith('http') && (
                    <div className="fallback-logo w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-gray-400" style={{ display: 'none' }}>
                      {product.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{product.name}</h1>
                    {product.isUnicorn && (
                      <Badge variant="tech" className="text-lg px-3 py-1">🦄 Unicórnio</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xl leading-relaxed">
                    {product.shortDescription || product.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-gray-200 shadow-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Fundada em {product.companyInfo?.foundedYear || product.foundedYear || '-'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-gray-200 shadow-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{product.location?.city ? product.location.city + ', ' : ''}{product.location?.country || '-'}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {tagsArray.map((tag) => (
                  <Badge key={tag} variant="outline" className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-50 border-gray-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="border-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <CreditCard className="w-6 h-6 text-primary" />
                    Informações de Preço
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-gray-600 mb-4 text-base leading-relaxed">
                    {product.pricing?.description || product.pricing?.startingPrice || 'Informações de preço não disponíveis'}
                  </div>
                  {pricingArray.length > 0 && (
                    <div className="space-y-3">
                      {pricingArray.map((plan, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex-1">
                            <div className="font-bold text-lg text-gray-900">{plan.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{plan.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl text-primary">{plan.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex gap-4">
                <Button className="flex-1 h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all" asChild>
                  <a href={product.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-5 h-5 mr-2" />
                    Visitar Site Oficial
                  </a>
                </Button>
                <Button variant="outline" className="px-4 h-12 rounded-xl border-2 hover:bg-gray-50 transition-all" asChild>
                  <a href={product.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Seção: Sobre o Produto */}
        <section>
          <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-elegant rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Shield className="w-7 h-7 text-primary" />
                Sobre o {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg mb-8">
                  {product.description}
                </p>
                
                <Separator className="my-8 bg-border/50" />
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-foreground">
                      <Shield className="w-6 h-6 text-primary" />
                      Informações da Empresa
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
                        <span className="text-muted-foreground font-medium">Empresa:</span>
                        <span className="font-semibold text-foreground">{product.companyInfo?.name || product.name || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
                        <span className="text-muted-foreground font-medium">Fundação:</span>
                        <span className="font-semibold text-foreground">{product.companyInfo?.foundedYear || product.foundedYear || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
                        <span className="text-muted-foreground font-medium">Sede:</span>
                        <span className="font-semibold text-foreground">{product.companyInfo?.headquarters || `${product.location?.city ? product.location.city + ', ' : ''}${product.location?.country || '-'}`}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
                        <span className="text-muted-foreground font-medium">Site:</span>
                        <span className="font-semibold text-foreground">
                          {product.website ? (
                            <a href={product.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors">
                              {product.website}
                            </a>
                          ) : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-foreground">
                      <Zap className="w-6 h-6 text-primary" />
                      Características
                    </h3>
                    <div className="space-y-3">
                      {product.isUnicorn && (
                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200 hover:shadow-sm transition-all">
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-800">Empresa Unicórnio 🦄</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-sm transition-all">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">100% Brasileira</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-sm transition-all">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Suporte em Português</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200 hover:shadow-sm transition-all">
                        <CheckCircle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Adequada à legislação brasileira</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Seção: Principais Recursos */}
        {featuresArray.length > 0 && (
          <section>
            <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-elegant rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Zap className="w-7 h-7 text-primary" />
                  Principais Recursos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {featuresArray.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:shadow-sm transition-all">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-base font-medium text-gray-800 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Seção: Alternativa Brasileira */}
        {product.alternativeTo && product.alternativeTo.length > 0 && (
          <section>
            <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-elegant rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Globe className="w-7 h-7 text-primary" />
                  Alternativa Brasileira
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Este produto brasileiro oferece funcionalidades similares aos seguintes serviços internacionais:
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {product.alternativeTo.map((alternative, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-base py-3 px-5 bg-blue-50 text-blue-700 border-blue-200 rounded-full font-semibold hover:bg-blue-100 transition-colors"
                    >
                      {alternative}
                    </Badge>
                  ))}
                </div>
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-800 text-lg mb-3">Por que escolher uma alternativa brasileira?</h4>
                      <ul className="text-green-700 space-y-3">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Suporte em português brasileiro</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Adequação à legislação nacional</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Proximidade cultural e temporal</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>Fortalecimento do ecossistema brasileiro</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Seção: Produtos Similares */}
        {relatedProducts.length > 0 && (
          <section>
            <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-elegant rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Heart className="w-7 h-7 text-primary" />
                  Produtos Similares
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.slice(0, 6).map((relatedProduct) => (
                    <Card key={relatedProduct.id} className="border-border/50 bg-background hover:shadow-elegant transition-all duration-300 rounded-xl">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shadow-sm">
                            {relatedProduct.logo}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">{relatedProduct.name}</CardTitle>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {relatedProduct.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {relatedProduct.shortDescription}
                        </p>
                        <Button size="sm" variant="outline" className="w-full" asChild>
                          <Link to={`/produto/${relatedProduct.slug}`}>
                            Ver detalhes
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductTemplate;
