import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Product } from "@/types";
    

const Alternativas = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getDocs(collection(db, "products")).then(snap => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'SoftwareApplication', name: a.name, applicationCategory: a.category, description: a.description }
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Alternativas | AlternativaBR"
        description="Catálogo curado de produtos brasileiros por categoria."
        canonical="/alternativas"
        jsonLd={jsonLd}
      />
      <Header />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Alternativas brasileiras
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore ferramentas nacionais que substituem soluções
            internacionais.
          </p>
        </div>
      </header>

      <main>
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
              {products.map((product) => (
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
                        {product.tags?.map((tag: string) => (
                          <Badge key={tag} className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 text-xs font-semibold rounded-full shadow-sm">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pb-5">
                    <p className="text-sm text-gray-700 mb-1 min-h-[40px]">{product.description}</p>
                    
                    {/* Seção Alternativa a */}
                    {product.alternativeTo && product.alternativeTo.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-600 mb-1">Alternativa brasileira a:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.alternativeTo.slice(0, 2).map((alternative: string, index: number) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5"
                            >
                              {alternative}
                            </Badge>
                          ))}
                          {product.alternativeTo.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200 px-2 py-0.5">
                              +{product.alternativeTo.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-1">
                      {product.features?.map((feature: string) => (
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Alternativas;
