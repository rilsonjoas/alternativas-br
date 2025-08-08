import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Users, Rocket, Heart, Star } from "lucide-react";

const Sobre = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Sobre - Alternativas BR",
    mainEntity: {
      "@type": "Organization",
      name: "Alternativas BR",
      description:
        "Plataforma que apresenta alternativas brasileiras a softwares internacionais.",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sobre | Alternativas BR"
        description="Conheça a missão do Alternativas BR e como conectamos você a softwares brasileiros de qualidade."
        canonical="/sobre"
        jsonLd={jsonLd}
      />
      <Header />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Sobre o Alternativas BR</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Um guia curado com carinho para descobrir ferramentas nacionais que substituem soluções internacionais.
          </p>
        </div>
      </header>

      <main>
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3">
            <article className="p-6 rounded-xl border border-border/50 bg-card shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <Info className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Nossa missão</h2>
              </div>
              <p className="text-muted-foreground">
                Ajudar pessoas e empresas a encontrarem softwares brasileiros incríveis, fortalecendo o ecossistema local e
                reduzindo dependências externas.
              </p>
            </article>

            <article className="p-6 rounded-xl border border-border/50 bg-card shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <Users className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Comunidade</h2>
              </div>
              <p className="text-muted-foreground">
                O projeto é colaborativo: recebemos indicações, feedbacks e histórias reais de uso da comunidade.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">Aberto a contribuições</Badge>
                <Badge variant="outline">Transparente</Badge>
              </div>
            </article>

            <article className="p-6 rounded-xl border border-border/50 bg-card shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <Rocket className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Por que Brasil?</h2>
              </div>
              <p className="text-muted-foreground">
                Valorizar soluções que entendem nossa realidade, geram empregos aqui e competem em nível global.
              </p>
            </article>
          </div>
        </section>

        <section className="py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 rounded-xl border border-border/50 bg-gradient-card">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Como você pode ajudar</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Indique um produto, compartilhe com amigos e ajude a manter o catálogo sempre atualizado.
              </p>
              <Button asChild variant="accent">
                <a href="/adicionar" aria-label="Adicionar um produto brasileiro">
                  Sugerir um produto
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
            {["Curadoria humana", "Foco em qualidade", "Atualizado frequentemente"].map((item) => (
              <div key={item} className="p-6 rounded-xl border border-border/50 bg-card flex items-start gap-3">
                <Star className="text-primary mt-1" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;
