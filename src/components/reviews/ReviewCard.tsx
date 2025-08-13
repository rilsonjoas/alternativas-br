import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Award, Calendar, MoreVertical, Flag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StarRating from '@/components/ui/star-rating';
import { Review } from '@/types/review';
import { useAuth } from '@/hooks/useAuth';
import { reviewService } from '@/lib/services/reviewService';

interface ReviewCardProps {
  review: Review;
  onReviewUpdated: () => void;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onReviewUpdated, className }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLike = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      await reviewService.toggleReviewLike(review.id, user.id, true);
      onReviewUpdated();
    } catch (error) {
      console.error('Erro ao curtir review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      await reviewService.toggleReviewLike(review.id, user.id, false);
      onReviewUpdated();
    } catch (error) {
      console.error('Erro ao descurtir review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      await reviewService.markReviewHelpful(review.id, user.id);
      onReviewUpdated();
    } catch (error) {
      console.error('Erro ao marcar como útil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isUserReview = user?.id === review.userId;
  const hasLiked = user ? review.likedBy?.includes(user.id) : false;
  const hasDisliked = user ? review.dislikedBy?.includes(user.id) : false;

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header com usuário e rating */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.userAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
                  {getUserInitials(review.userName)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground">{review.userName}</h4>
                  {review.verified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Award className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm text-muted-foreground">•</span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(review.createdAt)}
                    {review.updatedAt && " (editado)"}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu de ações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isUserReview ? (
                  <>
                    <DropdownMenuItem>Editar avaliação</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Excluir avaliação</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Flag className="w-4 h-4 mr-2" />
                    Reportar avaliação
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Título */}
          <h3 className="text-lg font-semibold text-foreground">{review.title}</h3>

          {/* Conteúdo */}
          <p className="text-muted-foreground leading-relaxed">{review.content}</p>

          {/* Pontos positivos e negativos */}
          {(review.pros.length > 0 || review.cons.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4">
              {review.pros.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-green-700 flex items-center">
                    👍 Pontos Positivos
                  </h5>
                  <div className="space-y-1">
                    {review.pros.map((pro, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {review.cons.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-red-700 flex items-center">
                    👎 Pontos Negativos
                  </h5>
                  <div className="space-y-1">
                    {review.cons.map((con, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ações de interação */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLoading || !user}
                className={hasLiked ? 'text-green-600 bg-green-50' : ''}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {review.likes}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDislike}
                disabled={isLoading || !user}
                className={hasDisliked ? 'text-red-600 bg-red-50' : ''}
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                {review.dislikes}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelpful}
                disabled={isLoading || !user}
              >
                🎯 Útil ({review.helpful})
              </Button>
            </div>

            {/* Selo brasileiro */}
            <div className="text-xs text-muted-foreground">
              🇧🇷 Avaliação brasileira
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
