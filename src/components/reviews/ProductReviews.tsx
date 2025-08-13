import React, { useState, useEffect, useCallback } from 'react';
import { Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ReviewStatsCard from './ReviewStatsCard';
import WriteReviewForm from './WriteReviewForm';
import ReviewCard from './ReviewCard';
import { Review, ReviewStats, ReviewFilters } from '@/types/review';
import { reviewService } from '@/lib/services/reviewService';
import { useAuth } from '@/hooks/useAuth';

interface ProductReviewsProps {
  productId: string;
  productName: string;
  className?: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName,
  className
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'newest'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showWriteReview, setShowWriteReview] = useState(false);

  const loadReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getProductReviews(productId, filters),
        reviewService.getProductReviewStats(productId)
      ]);
      
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setIsLoading(false);
    }
  }, [productId, filters]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleFiltersChange = (newFilters: Partial<ReviewFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleReviewSubmitted = () => {
    setShowWriteReview(false);
    loadReviews();
  };

  const hasUserReviewed = reviews.some(review => review.userId === user?.id);

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                ⭐ Avaliações de {productName}
              </span>
              {user && !hasUserReviewed && (
                <Button
                  onClick={() => setShowWriteReview(!showWriteReview)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  ✍️ Avaliar Produto
                </Button>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Formulário de nova avaliação */}
        {showWriteReview && (
          <WriteReviewForm
            productId={productId}
            productName={productName}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Estatísticas */}
          <div className="lg:col-span-1">
            <ReviewStatsCard stats={stats} />
          </div>

          {/* Lista de avaliações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filtros */}
            {stats.totalReviews > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Ordenação */}
                    <div className="flex items-center space-x-2">
                      <SortAsc className="w-4 h-4 text-muted-foreground" />
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) => handleFiltersChange({ sortBy: value as ReviewFilters['sortBy'] })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Mais recentes</SelectItem>
                          <SelectItem value="oldest">Mais antigas</SelectItem>
                          <SelectItem value="helpful">Mais úteis</SelectItem>
                          <SelectItem value="rating-high">Maior nota</SelectItem>
                          <SelectItem value="rating-low">Menor nota</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    {/* Filtro por estrelas */}
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <div className="flex space-x-1">
                        <Button
                          variant={filters.rating === undefined ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFiltersChange({ rating: undefined })}
                        >
                          Todas
                        </Button>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <Button
                            key={rating}
                            variant={filters.rating === rating ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFiltersChange({ 
                              rating: filters.rating === rating ? undefined : rating 
                            })}
                          >
                            {rating}⭐
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    {/* Filtro verificado */}
                    <Button
                      variant={filters.verified ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFiltersChange({ 
                        verified: filters.verified ? undefined : true 
                      })}
                    >
                      🏆 Verificados
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de reviews */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div className="space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded" />
                              <div className="w-20 h-3 bg-gray-200 rounded" />
                            </div>
                          </div>
                          <div className="w-3/4 h-4 bg-gray-200 rounded" />
                          <div className="space-y-2">
                            <div className="w-full h-3 bg-gray-200 rounded" />
                            <div className="w-2/3 h-3 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="text-6xl">🌟</div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {filters.rating || filters.verified ? 'Nenhuma avaliação encontrada' : 'Ainda não há avaliações'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {filters.rating || filters.verified 
                            ? 'Tente ajustar os filtros para ver mais avaliações.'
                            : 'Seja o primeiro a avaliar este produto brasileiro! 🇧🇷'
                          }
                        </p>
                        {!filters.rating && !filters.verified && user && !hasUserReviewed && (
                          <Button
                            onClick={() => setShowWriteReview(true)}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          >
                            ✍️ Escrever primeira avaliação
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onReviewUpdated={loadReviews}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
