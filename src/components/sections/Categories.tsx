import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories, getProductsByCategory } from "@/data";

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
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category.slug);
            
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-card transition-all duration-300 cursor-pointer border-border/50 bg-gradient-card"
                onClick={() => window.location.href = `/categorias/${category.slug}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-2xl`}>
                      {category.icon}
                    </div>
                    <Badge variant="category">
                      {categoryProducts.length} produtos
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;