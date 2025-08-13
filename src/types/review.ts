export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 estrelas
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  likes: number;
  dislikes: number;
  likedBy: string[]; // IDs dos usuários que curtiram
  dislikedBy: string[]; // IDs dos usuários que descurtiram
  verified: boolean; // Usuário verificado
  helpful: number; // Quantas pessoas marcaram como útil
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
}

export interface ReviewFilters {
  rating?: number;
  sortBy: 'newest' | 'oldest' | 'helpful' | 'rating-high' | 'rating-low';
  verified?: boolean;
}
