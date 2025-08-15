import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCategories } from "@/hooks/useFirebase";
import { categories as fallbackCategories } from "@/data";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Category } from "@/types";

// Type for categories that can come from Firebase or local data
type CategoryDisplay = Category | (Category & { name?: string });

// ========================================================================
// 1. DEFINA UM TIPO PARA SEUS PRODUTOS
//    Este tipo deve refletir a estrutura de um documento na sua coleção "products".
// ========================================================================
interface Product {
  id: string;
  categoria?: string; // Corresponde ao slug da categoria
  categorySlug?: string; // Outro campo possível para o slug
  categoryId?: string; // Corresponde ao ID da categoria
  // ... adicione outras propriedades do produto se necessário
}

const Categories = () => {
  const { data: firebaseCategories, isLoading, error } = useCategories();

  // ========================================================================
  // 2. USE O TIPO `Product` PARA O ESTADO
  // ========================================================================
  const [produtos, setProdutos] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const produtosSnap = await getDocs(collection(db, "products"));
        // ========================================================================
        // 3. FAÇA A CONVERSÃO PARA O TIPO CORRETO (`as Product`)
        // ========================================================================
        setProdutos(
          produtosSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Product)
          )
        );
      } catch (err) {
        setProdutos([]);
      }
    }
    fetchProdutos();
  }, []);

  // Use Firebase data if available, otherwise fallback to local data
  const categories: CategoryDisplay[] = firebaseCategories?.length
    ? firebaseCategories
    : fallbackCategories;

  if (isLoading) {
    return (
      <section id="categorias" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore por Categoria
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontre as melhores alternativas brasileiras organizadas por área
              de atuação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <Skeleton className="w-20 h-6 rounded-full" />
                  </div>
                  <Skeleton className="w-3/4 h-6" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-2/3 h-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    function getProductsByCategory(slug: string) {
      // AGORA ESTÁ CORRETO: `produto` é do tipo `Product` e tem as propriedades necessárias.
      return produtos.filter(
        (produto) => produto.categoria === slug || produto.categorySlug === slug
      );
    }
    return (
      <section id="categorias" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore por Categoria
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontre as melhores alternativas brasileiras organizadas por área
              de atuação
            </p>
          </div>

          <Alert className="max-w-2xl mx-auto mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar categorias do Firebase. Exibindo dados locais
              como fallback.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackCategories.map((category) => {
              const categoryProducts = getProductsByCategory(category.slug);

              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-card transition-all duration-300 cursor-pointer border-border/50 bg-gradient-card"
                  onClick={() =>
                    (window.location.href = `/categorias/${category.slug}`)
                  }
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-2xl`}
                      >
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
  }

  return (
    <section id="categorias" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore por Categoria
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre as melhores alternativas brasileiras organizadas por área
            de atuação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            // AGORA ESTÁ CORRETO: `produto` é do tipo `Product` e tem as propriedades necessárias.
            const productCount = produtos.length
              ? produtos.filter((produto) => {
                  return (
                    produto.categoria === category.slug ||
                    produto.categoryId === category.id
                  );
                }).length
              : category.productCount !== undefined
              ? category.productCount
              : 0;

            return (
              <Card
                key={category.id}
                className="group hover:shadow-card transition-all duration-300 cursor-pointer border-border/50 bg-gradient-card"
                onClick={() =>
                  (window.location.href = `/categorias/${category.slug}`)
                }
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-2xl`}
                    >
                      {category.icon}
                    </div>
                    <Badge variant="category">{productCount} produtos</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {(category as CategoryDisplay & { name?: string }).name ||
                      category.title}
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
