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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <article key={product.id} className="contents">
                  <Card className="group hover:shadow-card transition-all duration-300 border-border/50 bg-card hover:bg-card/80 cursor-pointer">
                    <Link
                      to={`/produto/${product.slug}`}
                      className="block h-full"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div
                            className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 overflow-hidden"
                            aria-hidden
                          >
                            {product.logo ? (
                              product.logo.startsWith("http") ? (
                                <img
                                  src={product.logo}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: product.logo,
                                  }}
                                  className="w-full h-full flex items-center justify-center"
                                />
                              )
                            ) : (
                              <img
                                src="/placeholder.svg"
                                alt="Logo placeholder"
                                className="w-8 h-8 text-muted-foreground" 
                              />
                            )}
                          </div>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                          {product.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.tags?.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Modelo:</span>{" "}
                            {product.pricing?.[0]?.price || "Consultar"}
                          </p>
                          <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-sm font-medium mr-1">
                              Ver detalhes
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </article>
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
