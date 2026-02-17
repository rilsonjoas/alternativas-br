import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types";
import { productService } from "@/lib/services/productService";
import { logEvent } from "@/lib/analytics";
import { ExternalLink, MapPin, Users, Calendar, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{id: string; name: string; slug: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        setFilteredProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await productService.search(query, false); // false para incluir produtos estrangeiros também
        setProducts(results);
        setFilteredProducts(results);
      } catch (error) {
        console.error("Erro na busca:", error);
        setProducts([]);
        setFilteredProducts([]);
      }
      setIsLoading(false);
    };

    searchProducts();
    
    if (query.trim()) {
      logEvent('view_search_results', 'search', query);
    }
  }, [query]);

  useEffect(() => {
    let filtered = [...products];

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.categorySlug === selectedCategory);
    }

    // Filtrar por localização
    if (selectedLocation !== "all") {
      if (selectedLocation === "brazil") {
        filtered = filtered.filter(product => product.location.countryCode === "BR");
      } else if (selectedLocation === "foreign") {
        filtered = filtered.filter(product => product.location.countryCode !== "BR");
      }
    }

    // Ordenar
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedLocation, sortBy]);

  const handleNewSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {query ? `Resultados para "${query}"` : "Buscar Produtos"}
              </h1>
              {products.length > 0 && (
                <p className="text-muted-foreground">
                  {filteredProducts.length} de {products.length} resultado{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl">
              <SearchBar 
                size="md"
                placeholder="Refinar busca..."
                className="w-full"
                showButton={true}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        {products.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Localização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as origens</SelectItem>
                <SelectItem value="brazil">🇧🇷 Brasileiras</SelectItem>
                <SelectItem value="foreign">🌍 Estrangeiras</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
                <SelectItem value="category">Categoria</SelectItem>
                <SelectItem value="newest">Mais recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Buscando produtos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={product.logo}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-logo.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        {product.location.countryCode === "BR" ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                            🇧🇷 Nacional
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            🌍 Internacional
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {product.shortDescription || product.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {product.location.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{product.location.city}</span>
                      </div>
                    )}
                    {product.userCount && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{product.userCount}</span>
                      </div>
                    )}
                    {product.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{product.createdAt.toDate().getFullYear()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm">
                      <Link to={`/produto/${product.slug}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={product.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Site
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Não conseguimos encontrar produtos para "{query}". Tente:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                <li>• Verificar a ortografia das palavras</li>
                <li>• Usar termos mais gerais</li>
                <li>• Tentar sinônimos ou palavras relacionadas</li>
                <li>• Buscar por categoria ou tipo de ferramenta</li>
              </ul>
              <Button asChild>
                <Link to="/alternativas">Ver Todas as Alternativas</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Digite algo para buscar
              </h3>
              <p className="text-muted-foreground mb-6">
                Use a barra de busca acima para encontrar produtos, categorias ou alternativas específicas.
              </p>
              <Button asChild>
                <Link to="/alternativas">Explorar Todas as Alternativas</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;