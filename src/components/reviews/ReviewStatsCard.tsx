import React from 'react';
import { Star, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StarRating from '@/components/ui/star-rating';
import { ReviewStats } from '@/types/review';

interface ReviewStatsCardProps {
  stats: ReviewStats;
  className?: string;
}

const ReviewStatsCard: React.FC<ReviewStatsCardProps> = ({ stats, className }) => {
  const getPercentage = (count: number) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Resumo geral */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              <span className="text-3xl font-bold text-foreground">
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
            <StarRating rating={stats.averageRating} size="md" className="justify-center mb-2" />
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-1" />
              <span>{stats.totalReviews} avaliações</span>
            </div>
          </div>

          {/* Distribuição detalhada */}
          {stats.totalReviews > 0 && (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 min-w-[80px]">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  
                  <div className="flex-1">
                    <Progress 
                      value={getPercentage(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution])} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="min-w-[40px] text-right">
                    <span className="text-sm text-muted-foreground">
                      {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cores brasileiras no gradiente do fundo */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50 border border-green-200">
            <p className="text-sm text-muted-foreground">
              {stats.totalReviews === 0 
                ? "Seja o primeiro a avaliar este produto! 🇧🇷"
                : "Obrigado por fortalecer a tecnologia brasileira! 🇧🇷"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewStatsCard;
