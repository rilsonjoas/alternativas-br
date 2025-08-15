
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { getAuth } from "firebase/auth";


const Stats = () => {
  const [produtosCount, setProdutosCount] = useState<number | null>(null);
  const [categoriasCount, setCategoriasCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const produtosSnap = await getCountFromServer(collection(db, "products"));
        setProdutosCount(produtosSnap.data().count);
        const categoriasSnap = await getCountFromServer(collection(db, "categories"));
        setCategoriasCount(categoriasSnap.data().count);
        // Informação de usuários removida
      } catch (err) {
        setProdutosCount(null);
        setCategoriasCount(null);
        // Informação de usuários removida
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
      number: categoriasCount !== null ? categoriasCount : "-",
      label: "Categorias",
      description: "Áreas de tecnologia cobertas"
    }
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O Ecossistema em Números
          </h2>
          <p className="text-lg text-muted-foreground">
            Veja o crescimento da tecnologia brasileira
          </p>
        </div>
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