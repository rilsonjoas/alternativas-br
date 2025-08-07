import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const alternatives = [
  {
    id: "movidesk",
    name: "Movidesk",
    description: "Plataforma brasileira de help desk e atendimento ao cliente que rivaliza com Zendesk e Freshdesk.",
    category: "Atendimento",
    pricing: "Freemium",
    replaces: ["Zendesk", "Freshdesk"],
    logo: "🎯",
    features: ["Chat em tempo real", "Automações", "Relatórios avançados"],
    established: "2011",
    users: "10.000+"
  },
  {
    id: "rd-station",
    name: "RD Station",
    description: "Plataforma completa de marketing digital e automação, alternativa nacional ao HubSpot.",
    category: "Marketing",
    pricing: "R$ 69/mês",
    replaces: ["HubSpot", "Mailchimp"],
    logo: "🚀",
    features: ["Email marketing", "Lead scoring", "CRM integrado"],
    established: "2011",
    users: "50.000+"
  },
  {
    id: "pipefy",
    name: "Pipefy",
    description: "Ferramenta brasileira de gestão de processos e workflow, competindo com Asana e Monday.com.",
    category: "Produtividade",
    pricing: "Freemium",
    replaces: ["Asana", "Monday.com"],
    logo: "⚙️",
    features: ["Automação de processos", "Templates", "Relatórios"],
    established: "2015",
    users: "100.000+"
  },
  {
    id: "resultados-digitais",
    name: "Resultados Digitais",
    description: "Plataforma de marketing digital que oferece alternativa completa ao Pardot e Marketo.",
    category: "Marketing",
    pricing: "R$ 199/mês",
    replaces: ["Pardot", "Marketo"],
    logo: "📊",
    features: ["Marketing automation", "Lead nurturing", "Analytics"],
    established: "2011",
    users: "25.000+"
  }
];

const FeaturedAlternatives = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="tech" className="mb-4">
            ⭐ Destaques
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Alternativas em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça algumas das melhores soluções brasileiras que estão transformando o mercado
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {alternatives.map((alt) => (
            <Card 
              key={alt.id} 
              className="group hover:shadow-elegant transition-all duration-300 border-border/50 bg-gradient-card"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center text-2xl">
                      {alt.logo}
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {alt.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="category">{alt.category}</Badge>
                        <Badge variant="price">{alt.pricing}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {alt.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Substitui:</p>
                    <div className="flex flex-wrap gap-1">
                      {alt.replaces.map((tool) => (
                        <Badge key={tool} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Principais recursos:</p>
                    <div className="flex flex-wrap gap-1">
                      {alt.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>Desde {alt.established}</span>
                  <span>{alt.users} usuários</span>
                </div>
                
                <Button variant="default" className="w-full">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="accent" size="lg">
            Ver Todas as Alternativas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAlternatives;