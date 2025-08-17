import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchSystem from '@/components/SearchSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Star, Users, Calendar, Search } from 'lucide-react';
import { useProductSearch, useCategories } from '@/hooks/useFirebase';
import { Product, Category } from '@/types';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('categoria') || 'all';
  
  // Firebase queries
  const { data: products, isLoading: isProductsLoading } = useProductSearch(searchQuery);
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  
  // Filter categories based on search
  const filteredCategories = categories?.filter(category => 
    searchQuery && (
      category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];
  
  // Filter products by category if specified
  const filteredProducts = categoryFilter === 'all' 
    ? products || []
    : products?.filter(product => 
        product.categorySlug === categoryFilter || 
        product.category === categoryFilter
      ) || [];
  
  const handleSearchResultClick = (result: Product | Category, type: 'product' | 'category') => {
    if (type === 'product') {
      navigate(`/produto/${result.slug}`);
    } else {
      navigate(`/categorias/${result.slug}`);
    }
  };
  
  const totalResults = filteredCategories.length + filteredProducts.length;
  const isLoading = isProductsLoading || isCategoriesLoading;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalResults,
      itemListElement: [
        ...filteredCategories.map((category, index) => ({
          "@type": "Thing",
          position: index + 1,
          name: category.name || category.title,
          description: category.description
        })),
        ...filteredProducts.map((product, index) => ({
          "@type": "SoftwareApplication",
          position: filteredCategories.length + index + 1,
          name: product.name,
          description: product.description,
          applicationCategory: product.category
        }))
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`Busca: ${searchQuery} | Alternativas BR`}
        description={`Resultados da busca por "${searchQuery}". Encontre as melhores alternativas brasileiras.`}
        canonical={`/buscar?q=${encodeURIComponent(searchQuery)}`}
        jsonLd={jsonLd}
      />
      <Header />
      
      {/* Search Header */}
      <section className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Resultados da Busca
              </h1>
            </div>
            
            <SearchSystem
              onResultClick={handleSearchResultClick}
              placeholder={`Buscar por "${searchQuery}" ou outros termos...`}
              className="mb-4"
            />
            
            {searchQuery && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Buscando por:</span>
                <Badge variant="secondary">"{searchQuery}"</Badge>
                {categoryFilter !== 'all' && (
                  <>
                    <span>em</span>
                    <Badge variant="outline">{categoryFilter}</Badge>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-48 h-6" />
                  <Skeleton className="w-24 h-6" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="border-border/50">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-12 h-12 rounded-xl" />
                          <div className="flex-1">
                            <Skeleton className="w-32 h-5 mb-2" />
                            <Skeleton className="w-20 h-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="w-full h-12 mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="w-20 h-4" />
                          <Skeleton className="w-24 h-8" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold">
                    {totalResults > 0 ? (
                      <>
                        {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                        {searchQuery && ` para "${searchQuery}"`}
                      </>
                    ) : (
                      'Nenhum resultado encontrado'
                    )}
                  </h2>
                  
                  {totalResults > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {filteredCategories.length > 0 && (
                        <Badge variant="secondary">
                          {filteredCategories.length} categoria{filteredCategories.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {filteredProducts.length > 0 && (
                        <Badge variant="secondary">
                          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {totalResults > 0 ? (
                  <div className="space-y-8">
                    {/* Categories Results */}
                    {filteredCategories.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          📁 Categorias ({filteredCategories.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredCategories.map((category) => (
                            <Card 
                              key={category.id}
                              className="group hover:shadow-card transition-all duration-300 cursor-pointer border-border/50"
                              onClick={() => navigate(`/categorias/${category.slug}`)}
                            >
                              <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="text-2xl">{category.icon}</div>
                                    <div>
                                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                                        {category.name || category.title}
                                      </CardTitle>
                                    </div>
                                  </div>
                                  <Badge variant="category">
                                    {category.productCount || 0}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {category.description}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Products Results */}
                    {filteredProducts.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          🚀 Alternativas ({filteredProducts.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredProducts.map((product) => (
                            <Card 
                              key={product.id}
                              className="group hover:shadow-card transition-all duration-300 border-border/50"
                            >
                              <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                                      {product.logo}
                                    </div>
                                    <div>
                                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                        {product.name}
                                      </CardTitle>
                                      <Badge variant="secondary" className="mt-1">
                                        {product.category}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              
                              <CardContent className="space-y-4">
                                <p className="text-muted-foreground text-sm">
                                  {product.shortDescription || product.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{product.userCount}</span>
                                  </div>
                                  {product.foundedYear && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>{product.foundedYear}</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between pt-2">
                                  <div className="text-sm">
                                    <span className="text-muted-foreground">A partir de </span>
                                    <span className="font-semibold text-foreground">
                                      {product.pricing?.[0]?.price || "Consultar"}
                                    </span>
                                  </div>
                                  <Button size="sm" variant="outline" asChild>
                                    <Link 
                                      to={`/produto/${product.slug}`}
                                      className="flex items-center gap-2"
                                    >
                                      Ver detalhes
                                      <ExternalLink className="w-3 h-3" />
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                ) : (
                  /* No Results */
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-4">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Não encontramos alternativas ou categorias que correspondam à sua busca.
                      Tente termos diferentes ou explore nossas categorias.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="hero" asChild>
                        <a href="/categorias">Explorar Categorias</a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="/alternativas">Ver Todas as Alternativas</a>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
