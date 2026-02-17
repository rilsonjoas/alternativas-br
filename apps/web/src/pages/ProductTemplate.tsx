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
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Shield, 
  Globe, 
  CreditCard,
  CheckCircle,
  Zap,
  Heart,
  MessageCircle,
  Twitter,
  Linkedin,
  Share2,
  Milestone as Unicorn,
  ThumbsUp
} from "lucide-react";
import { useProductBySlug, useProductsByCategory, voteProduct, useHasVoted } from "@/hooks/useFirebase";
import { useQueryClient } from "@tanstack/react-query";
import AdUnit from "@/components/AdUnit";
import { cn } from "@/lib/utils";
import { logEvent } from "@/lib/analytics";
import ProductCard from "@/components/ProductCard";
import AffiliateBanner from "@/components/AffiliateBanner";
import StickyShareBar from "@/components/StickyShareBar";

const ProductTemplate = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  // Always call hooks at the top level
  const { data: firebaseProduct, isLoading, error } = useProductBySlug(slug || '');
  const queryClient = useQueryClient();
  const productId = firebaseProduct?.id || "";
  const { data: hasVoted } = useHasVoted(productId);
  const [logoError, setLogoError] = useState(false);

  const handleVote = async () => {
    if (!productId) return;
    try {
      await voteProduct(productId);
      logEvent('earn_virtual_currency', 'vote', product?.name || productId, 1);
      toast({ title: "Curtida registrada!", description: "Obrigado por apoiar a tecnologia nacional. ❤️" });
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      queryClient.invalidateQueries({ queryKey: ["hasVoted", productId] });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Tente novamente mais tarde.";
      toast({ 
        title: "Erro ao votar", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
  };

  // We need to get the tags for related products, but we need a fallback
  const product = firebaseProduct;
  const productTags = product?.tags || [];
  
  const { data: firebaseRelatedProducts } = useProductsByCategory(productTags);
  
  if (!slug) {
    return <Navigate to="/alternativas" replace />;
  }
  
  // Garante que arrays não venham como undefined ou string
  const pricingArray = Array.isArray(product?.pricing?.plans) ? product.pricing.plans : [];
  const tagsArray = Array.isArray(product?.tags) ? product.tags : [];
  const featuresArray = Array.isArray(product?.features) ? product.features : [];
  const relatedProducts = (firebaseRelatedProducts || []).filter(p => p.id !== product?.id);
  
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
    applicationCategory: tagsArray[0] || "Software",
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
    // aggregateRating removido temporariamente para evitar erro de schema (falta ratingValue)
    dateCreated: product.foundedYear
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={product.metaTitle || `${product.name} | AlternativasBR`}
        description={product.metaDescription || product.description}
        canonical={`/produto/${product.slug}`}
        jsonLd={jsonLd}
      />
      <Header />
      
      <header className="border-b border-border/50 bg-gradient-to-br from-background/95 to-primary/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Coluna Principal: Logo, Título, Descrição, Tags */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex flex-col items-center md:items-start gap-6">
                {/* Logo no topo */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white border border-gray-100 shadow-xl flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
                  {product.logo && !logoError ? (
                    <img 
                      src={product.logo} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-3 md:p-4" 
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-4xl md:text-5xl font-bold text-primary/30">
                      {product.name[0]}
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left space-y-4">
                  <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">{product.name}</h1>
                    {product.isUnicorn && (
                      <Badge variant="tech" className="text-xs px-3 py-0.5 gap-2 shadow-sm uppercase tracking-wider">
                        <Unicorn className="w-3.5 h-3.5" /> Unicórnio
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-full border border-gray-100 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold">Desde {product.companyInfo?.foundedYear || product.foundedYear || '-'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-full border border-gray-100 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold">{product.location?.city || '-'}{product.location?.country ? `, ${product.location.country}` : ''}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {tagsArray.map((tag) => (
                  <Badge key={tag} variant="outline" className="px-3 py-1 text-xs font-medium rounded-full bg-gray-50/50 border-gray-200/50 text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Coluna Sidebar: Preço e Ações */}
            <div className="space-y-6">
              {/* Banner de Afiliado para Nuvemshop/RD Station ou Opções de Preço */}
              {product.slug === "nuvemshop" || product.slug === "rd-station" ? (
                <AffiliateBanner 
                  productName={product.name}
                  affiliateUrl={
                    product.slug === "nuvemshop" 
                      ? "https://www.nuvemshop.com.br/partners/alternativasbr"
                      : "https://app.rdstation.com.br/signup?trial_origin=rds-afiliado&affiliate_id=6974fba4e22af"
                  }
                  variant="compact"
                />
              ) : (
                <Card className="border-gray-100 bg-white shadow-xl rounded-2xl overflow-hidden border-none shadow-elegant">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent border-b border-gray-50 pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-bold">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Opções de Preço
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {product.pricing?.description || 'Consulte os planos abaixo'}
                    </div>
                    {pricingArray.length > 0 && (
                      <div className="space-y-3">
                        {pricingArray.map((plan) => (
                          <div key={plan.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                            <div className="flex-1">
                              <div className="font-bold text-sm text-gray-900">{plan.name}</div>
                              <div className="text-[10px] text-gray-500">{plan.description}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-extrabold text-sm text-primary">{plan.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col gap-3">
                <Button className="w-full h-12 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all group" asChild>
                  <a 
                    href={product.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => logEvent('select_content', 'visit_site', product.name)}
                  >
                    <Globe className="w-4 h-4 mr-2 group-hover:animate-spin-slow" />
                    Visitar Site Oficial
                  </a>
                </Button>
                
                <div className="grid grid-cols-5 gap-2">
                  <Button 
                    variant={hasVoted ? "default" : "outline"}
                    className={cn(
                      "col-span-2 h-11 rounded-xl flex items-center gap-2 transition-all border-gray-200",
                      hasVoted ? "bg-red-500 text-white border-red-500" : "hover:bg-red-50 hover:border-red-200"
                    )}
                    onClick={handleVote}
                    disabled={hasVoted}
                  >
                    <Heart className={cn("w-4 h-4", hasVoted ? "fill-white" : "text-red-500")} />
                    <span className="font-bold text-xs">{product.upvotes || 0}</span>
                  </Button>

                  <div className="col-span-3 flex gap-1.5">
                    <Button 
                      variant="outline" size="icon" className="h-11 w-full rounded-xl border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                      onClick={() => window.open(`https://api.whatsapp.com/send?text=Confira o ${product.name} no AlternativasBR: ${window.location.href}`, '_blank')}
                      aria-label="Compartilhar no WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" size="icon" className="h-11 w-full rounded-xl border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')}
                      aria-label="Compartilhar no Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" size="icon" className="h-11 w-full rounded-xl border-gray-200 hover:bg-gray-100"
                      onClick={() => {
                        logEvent('share', 'share_url', product.name);
                        if (navigator.share) {
                          navigator.share({ title: product.name, url: window.location.href });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          toast({ title: "Link copiado!" });
                        }
                      }}
                      aria-label="Compartilhar link"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
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
                <p className="text-foreground/90 leading-relaxed text-lg mb-8 font-medium">
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
                      <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-muted/30 hover:bg-muted/40 transition-all border border-border/5">
                        <span className="text-muted-foreground font-semibold text-base uppercase tracking-tight">Empresa:</span>
                        <span className="font-bold text-foreground text-lg">{product.name || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-muted/30 hover:bg-muted/40 transition-all border border-border/5">
                        <span className="text-muted-foreground font-semibold text-base uppercase tracking-tight">Fundação:</span>
                        <span className="font-bold text-foreground text-lg">{product.companyInfo?.foundedYear || product.foundedYear || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-muted/30 hover:bg-muted/40 transition-all border border-border/5">
                        <span className="text-muted-foreground font-semibold text-base uppercase tracking-tight">Sede:</span>
                        <span className="font-bold text-foreground text-lg">{product.companyInfo?.headquarters || `${product.location?.city ? product.location.city + ', ' : ''}${product.location?.country || '-'}`}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-muted/30 hover:bg-muted/40 transition-all border border-border/5">
                        <span className="text-muted-foreground font-semibold text-base uppercase tracking-tight">Site:</span>
                        <span className="font-bold text-lg">
                          {product.website ? (
                            <a href={product.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors">
                              {product.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
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
                          <span className="font-medium text-purple-800">Empresa Unicórnio <Unicorn className="inline w-4 h-4" /></span>
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
                  {featuresArray.map((feature) => (
                    <div key={feature} className="flex items-start gap-5 p-6 rounded-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/80 border border-green-200/60 hover:shadow-md transition-all duration-300">
                      <CheckCircle className="w-7 h-7 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-lg font-semibold text-gray-800 leading-relaxed">{feature}</span>
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
                  {product.alternativeTo.map((alternative) => (
                    <Badge 
                      key={alternative} 
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

        {/* Banner Publicitário */}
        <AdUnit slot="product-middle" className="my-12" />

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
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <StickyShareBar 
        productName={product.name}
        onVote={handleVote}
        onShare={() => {
          logEvent('share', 'share_url_sticky', product.name);
          if (navigator.share) {
            navigator.share({ title: product.name, url: window.location.href });
          } else {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Link copiado!" });
          }
        }}
        hasVoted={!!hasVoted}
      />
      <div className="h-20 md:hidden" /> {/* Spacer for sticky bar */}
      <Footer />
    </div>
  );
};

export default ProductTemplate;
