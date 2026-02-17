
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { getAuth } from "firebase/auth";


const Stats = () => {
  const [produtosCount, setProdutosCount] = useState<number | null>(null);
  const [companiesCount, setCompaniesCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const produtosSnap = await getCountFromServer(collection(db, "products"));
        setProdutosCount(produtosSnap.data().count);
        // Simular contagem de empresas (seria calculado dos produtos)
        setCompaniesCount(produtosSnap.data().count ? Math.floor(produtosSnap.data().count * 0.8) : null);
      } catch (err) {
        setProdutosCount(null);
        setCompaniesCount(null);
      }
    }
    fetchCounts();
  }, []);

  const stats = [
    {
      number: produtosCount !== null ? produtosCount : "-",
      label: "Produtos Brasileiros",
      description: "Alternativas nacionais catalogadas"
    },

    {
      number: companiesCount !== null ? companiesCount : "-",
      label: "Empresas Nacionais",
      description: "Startups e empresas brasileiras"
    }
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-border/50 bg-background/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;