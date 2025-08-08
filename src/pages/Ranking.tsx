import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, TrendingUp } from "lucide-react";

 type RankItem = {
  id: string;
  name: string;
  category: string;
  score: number; // 0-100
  votes: number;
};

const top: RankItem[] = [
  { id: "rd-station", name: "RD Station", category: "Marketing", score: 92, votes: 1240 },
  { id: "vtex", name: "VTEX", category: "E-commerce", score: 90, votes: 980 },
  { id: "pipefy", name: "Pipefy", category: "Produtividade", score: 88, votes: 840 },
  { id: "asaas", name: "Asaas", category: "Fintech", score: 86, votes: 760 },
  { id: "bling", name: "Bling", category: "ERP", score: 84, votes: 690 },
  { id: "conta-azul", name: "Conta Azul", category: "Finanças", score: 83, votes: 650 },
  { id: "take-blip", name: "Take Blip", category: "Atendimento", score: 82, votes: 610 },
  { id: "clicksign", name: "Clicksign", category: "Assinaturas", score: 81, votes: 580 },
];

const Ranking = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: top.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "SoftwareApplication", name: a.name, applicationCategory: a.category },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Ranking | Alternativas BR"
        description="Top softwares brasileiros mais amados pela comunidade. Descubra destaques por categoria."
        canonical="/ranking"
        jsonLd={jsonLd}
      />
      <Header />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="text-primary" /> Ranking de softwares brasileiros
          </h1>
          <p className="text-muted-foreground mt-2">Classificação baseada em popularidade e avaliação da comunidade.</p>
        </div>
      </header>

      <main>
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-6">
            {top.map((item, idx) => (
              <article key={item.id} className="contents">
                <Card className="border-border/50 bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold">
                          {idx + 1}
                        </span>
                        {item.name}
                      </CardTitle>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <Star className="text-primary" />
                        <span className="font-medium">{item.score}</span>
                        <span className="text-muted-foreground text-sm">/ 100</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <TrendingUp className="text-primary" />
                        {item.votes.toLocaleString()} votos
                      </div>
                    </div>
                    <Progress value={item.score} />
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Ranking;
