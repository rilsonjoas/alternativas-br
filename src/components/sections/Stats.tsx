import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    number: "200+",
    label: "Produtos Brasileiros",
    description: "Alternativas nacionais catalogadas"
  },
  {
    number: "15",
    label: "Categorias",
    description: "Áreas de tecnologia cobertas"
  },
  {
    number: "500K+",
    label: "Usuários Ativos",
    description: "Pessoas usando soluções BR"
  },
  {
    number: "95%",
    label: "Satisfação",
    description: "Taxa de recomendação"
  }
];

const Stats = () => {
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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