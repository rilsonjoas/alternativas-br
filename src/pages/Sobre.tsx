import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Users, Rocket, Heart, Star } from "lucide-react";
import BadgeOrgulhoNacional from "@/components/BadgeOrgulhoNacional";

const Sobre = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Sobre - AlternativasBR",
    mainEntity: {
      "@type": "Organization",
      name: "AlternativasBR",
      description:
        "Plataforma que apresenta alternativas brasileiras a softwares internacionais.",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sobre | AlternativasBR"
        description="Conheça a missão do AlternativasBR e como conectamos você a softwares brasileiros de qualidade."
        canonical="/sobre"
        jsonLd={jsonLd}
      />
      <Header />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Sobre o AlternativasBR</h1>
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
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Info className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Nossa missão</h2>
              </div>
              <p className="text-muted-foreground">
                Ajudar pessoas e empresas a encontrarem softwares brasileiros incríveis, fortalecendo o ecossistema local e
                reduzindo dependências externas.
              </p>
            </article>

            <article className="p-6 rounded-xl border border-border/50 bg-card shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="text-primary w-5 h-5" />
                </div>
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
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Rocket className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Por que Brasil?</h2>
              </div>
              <p className="text-muted-foreground">
                Valorizar soluções que entendem nossa realidade, geram empregos aqui e competem em nível global.
              </p>
            </article>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Fortaleça o Software Nacional</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Se você é uma empresa brasileira listada aqui, use nosso selo <strong>"Orgulho Nacional"</strong> em seu site. 
                  Isso ajuda a educar o mercado sobre a qualidade da tecnologia brasileira e gera visibilidade para todo o ecossistema.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">✓</div>
                    <span className="text-muted-foreground font-medium text-lg">Gere autoridade e confiança local</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">✓</div>
                    <span className="text-muted-foreground font-medium text-lg">Melhore seu SEO com backlinks valiosos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">✓</div>
                    <span className="text-muted-foreground font-medium text-lg">100% gratuito e fácil de instalar</span>
                  </div>
                </div>
              </div>
              <div>
                <BadgeOrgulhoNacional />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 md:p-12 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-primary/5 shadow-elegant relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="text-primary w-8 h-8 fill-primary/20" />
                    <h2 className="text-3xl font-bold text-foreground">Como você pode ajudar</h2>
                  </div>
                  <p className="text-xl text-muted-foreground mb-8">
                    Indique um produto, compartilhe com seus amigos desenvolvedores e ajude a manter o catálogo nacional sempre atualizado.
                  </p>
                  <Button asChild variant="accent" size="lg" className="rounded-xl h-14 px-8 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                    <a href="/adicionar" aria-label="Adicionar um produto brasileiro">
                      <Rocket className="w-5 h-5 mr-2" />
                      Sugerir um produto
                    </a>
                  </Button>
                </div>
                <div className="hidden lg:block w-1/3 opacity-20">
                  <Rocket className="w-64 h-64 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
            {["Curadoria técnica humana", "Foco total em qualidade", "Atualizado pela comunidade"].map((item) => (
              <div key={item} className="p-6 rounded-xl border border-border/50 bg-card/50 flex items-center gap-4">
                <Star className="text-primary w-6 h-6 fill-primary/20" />
                <p className="text-base font-medium text-muted-foreground">{item}</p>
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
