import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    id: "desenvolvimento",
    title: "Desenvolvimento",
    description: "IDEs, ferramentas de código e plataformas de desenvolvimento",
    icon: "💻",
    count: 25,
    color: "bg-primary/10 text-primary"
  },
  {
    id: "design",
    title: "Design & UX",
    description: "Ferramentas de design, prototipagem e experiência do usuário",
    icon: "🎨",
    count: 18,
    color: "bg-accent/30 text-primary"
  },
  {
    id: "marketing",
    title: "Marketing Digital",
    description: "Automação, email marketing e gestão de campanhas",
    icon: "📈",
    count: 32,
    color: "bg-primary-glow/20 text-primary"
  },
  {
    id: "produtividade",
    title: "Produtividade",
    description: "Gestão de projetos, comunicação e colaboração",
    icon: "⚡",
    count: 28,
    color: "bg-accent/20 text-primary"
  },
  {
    id: "fintech",
    title: "Fintech",
    description: "Pagamentos, gestão financeira e banking digital",
    icon: "💳",
    count: 21,
    color: "bg-primary/15 text-primary"
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Plataformas de venda online e gestão de loja virtual",
    icon: "🛒",
    count: 15,
    color: "bg-accent/25 text-primary"
  }
];

const Categories = () => {
  return (
    <section id="categorias" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore por Categoria
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre as melhores alternativas brasileiras organizadas por área de atuação
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-card transition-all duration-300 cursor-pointer border-border/50 bg-gradient-card"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-2xl`}>
                    {category.icon}
                  </div>
                  <Badge variant="category">
                    {category.count} produtos
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;