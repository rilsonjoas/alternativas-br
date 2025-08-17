import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Heart, 
  Star, 
  Users, 
  ChevronRight,
  Sparkles,
  Target,
  Clock
} from 'lucide-react';
import { Product } from '@/types';
import { advancedSearchService } from '@/lib/services/advancedSearchService';

interface RecommendationsProps {
  userId?: string;
  currentProduct?: Product;
  searchQuery?: string;
  category?: string;
  maxRecommendations?: number;
  showHeader?: boolean;
  className?: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  userId,
  currentProduct,
  searchQuery,
  category,
  maxRecommendations = 6,
  showHeader = true,
  className
}) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationType, setRecommendationType] = useState<'trending' | 'personalized' | 'similar' | 'category'>('trending');

  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      let recs: Product[] = [];

      if (currentProduct) {
        // Recomendações similares ao produto atual
        recs = await advancedSearchService.getRecommendations(undefined, {
          excludeProductId: currentProduct.id,
          category: currentProduct.category,
          maxResults: maxRecommendations
        });
        setRecommendationType('similar');
      } else if (searchQuery) {
        // Recomendações baseadas na busca
        recs = await advancedSearchService.getRecommendations(searchQuery, {
          maxResults: maxRecommendations
        });
        setRecommendationType('personalized');
      } else if (category) {
        // Recomendações por categoria
        recs = await advancedSearchService.getRecommendations(undefined, {
          category,
          maxResults: maxRecommendations
        });
        setRecommendationType('category');
      } else {
        // Recomendações populares/trending
        recs = await advancedSearchService.getTrendingProducts(maxRecommendations);
        setRecommendationType('trending');
      }

      setRecommendations(recs);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentProduct, searchQuery, category, maxRecommendations]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const getRecommendationTitle = () => {
    switch (recommendationType) {
      case 'similar':
        return `Alternativas similares a ${currentProduct?.name}`;
      case 'personalized':
        return 'Recomendado para você';
      case 'category':
        return `Populares em ${category}`;
      case 'trending':
      default:
        return 'Alternativas em alta 🔥';
    }
  };

  const getRecommendationIcon = () => {
    switch (recommendationType) {
      case 'similar':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'personalized':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'category':
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'trending':
      default:
        return <TrendingUp className="w-5 h-5 text-green-600" />;
    }
  };

  if (!recommendations.length && !isLoading) {
    return null;
  }

  return (
    <div className={className}>
      <Card className="border-2 border-dashed border-green-200 bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50">
        {showHeader && (
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                {getRecommendationIcon()}
                <span className="ml-2">{getRecommendationTitle()}</span>
                <span className="ml-2">🇧🇷</span>
              </span>
              <Badge variant="outline" className="bg-white">
                {recommendations.length} encontradas
              </Badge>
            </CardTitle>
          </CardHeader>
        )}

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: maxRecommendations }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 bg-white border-green-100">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-xl">
                        {product.logo || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-green-800 truncate group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h4>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      {index < 3 && (
                        <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          #{index + 1}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      
                      {recommendationType === 'trending' && (
                        <div className="flex items-center text-xs text-orange-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Em alta
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {product.tags?.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button size="sm" variant="outline" className="text-xs" asChild>
                        <Link to={`/produto/${product.slug}`}>
                          Ver mais
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>

                    {/* Razão da recomendação */}
                    <div className="mt-3 pt-3 border-t border-green-100">
                      <div className="flex items-center text-xs text-muted-foreground">
                        {recommendationType === 'similar' && (
                          <>
                            <Target className="w-3 h-3 mr-1" />
                            Similar ao produto atual
                          </>
                        )}
                        {recommendationType === 'personalized' && (
                          <>
                            <Sparkles className="w-3 h-3 mr-1" />
                            Baseado na sua busca
                          </>
                        )}
                        {recommendationType === 'category' && (
                          <>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular na categoria
                          </>
                        )}
                        {recommendationType === 'trending' && (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Tendência atual
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CTA para ver mais */}
          {recommendations.length >= maxRecommendations && (
            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                className="bg-white hover:bg-green-50 border-green-200"
              >
                Ver mais recomendações
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Insights das recomendações */}
          <div className="bg-white/80 rounded-lg p-4 border border-green-100">
            <h5 className="font-medium text-sm text-green-800 mb-2 flex items-center">
              💡 Por que estas recomendações?
            </h5>
            <div className="text-xs text-muted-foreground space-y-1">
              {recommendationType === 'similar' && (
                <p>• Produtos com recursos e categoria similar ao que você está vendo</p>
              )}
              {recommendationType === 'personalized' && (
                <p>• Baseado nos seus termos de busca e preferências</p>
              )}
              {recommendationType === 'category' && (
                <p>• Alternativas mais populares desta categoria</p>
              )}
              {recommendationType === 'trending' && (
                <>
                  <p>• Produtos com maior crescimento em avaliações</p>
                  <p>• Mais buscados pelos usuários brasileiros</p>
                </>
              )}
              <p>• Priorizamos alternativas desenvolvidas no Brasil 🇧🇷</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;
