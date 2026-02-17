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
import ProductCard from "@/components/ProductCard";
import AdUnit from "@/components/AdUnit";

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
      item: { '@type': 'SoftwareApplication', name: a.name, applicationCategory: a.tags?.[0] || 'Software', description: a.description }
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Alternativas | AlternativasBR"
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
            <AdUnit slot="alternativas-top" className="mb-10" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <AdUnit slot="alternativas-bottom" className="mt-20" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Alternativas;
