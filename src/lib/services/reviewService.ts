import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import db from '../firebase';
import { Review, CreateReviewData, ReviewStats, ReviewFilters } from '@/types/review';

class ReviewService {
  private collection = collection(db, 'reviews');

  // Criar nova avaliação
  async createReview(userId: string, userName: string, reviewData: CreateReviewData): Promise<Review> {
    try {
      const newReview = {
        ...reviewData,
        userId,
        userName,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        verified: false, // Será atualizado baseado no status do usuário
        helpful: 0,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(this.collection, newReview);
      
      return {
        id: docRef.id,
        ...newReview,
        createdAt: new Date(),
      } as Review;
    } catch (error) {
      console.error('Erro ao criar review:', error);
      throw new Error('Erro ao criar avaliação');
    }
  }

  // Buscar reviews de um produto
  async getProductReviews(productId: string, filters?: ReviewFilters): Promise<Review[]> {
    try {
      console.log('🔍 Buscando reviews para produto:', productId);
      
      // Primeira tentativa: busca simples sem ordenação
      let reviewQuery = query(
        this.collection,
        where('productId', '==', productId)
      );

      // Aplicar filtros
      if (filters?.rating) {
        reviewQuery = query(reviewQuery, where('rating', '==', filters.rating));
      }

      if (filters?.verified !== undefined) {
        reviewQuery = query(reviewQuery, where('verified', '==', filters.verified));
      }

      console.log('📝 Executando consulta básica...');
      const snapshot = await getDocs(reviewQuery);
      console.log(`✅ Encontradas ${snapshot.size} reviews`);
      
      let reviews = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Dados do documento:', { id: doc.id, data });
        
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
        } as Review;
      });

      // Aplicar ordenação em memória (mais seguro que orderBy no Firestore)
      if (filters?.sortBy) {
        console.log('🔄 Aplicando ordenação:', filters.sortBy);
        switch (filters.sortBy) {
          case 'oldest':
            reviews = reviews.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            break;
          case 'helpful':
            reviews = reviews.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
            break;
          case 'rating-high':
            reviews = reviews.sort((a, b) => b.rating - a.rating);
            break;
          case 'rating-low':
            reviews = reviews.sort((a, b) => a.rating - b.rating);
            break;
          default: // newest
            reviews = reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
      } else {
        // Ordenação padrão: mais recentes primeiro
        reviews = reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      console.log(`✅ Retornando ${reviews.length} reviews ordenadas`);
      return reviews;
      
    } catch (error) {
      console.error('❌ Erro ao buscar reviews:', error);
      console.error('📊 Stack trace:', error instanceof Error ? error.stack : 'N/A');
      throw new Error('Erro ao carregar avaliações: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  }

  // Buscar estatísticas de reviews de um produto
  async getProductReviewStats(productId: string): Promise<ReviewStats> {
    try {
      const reviews = await this.getProductReviews(productId);
      
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      };

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error('Erro ao carregar estatísticas');
    }
  }

  // Curtir/descurtir review
  async toggleReviewLike(reviewId: string, userId: string, isLike: boolean): Promise<void> {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (!reviewDoc.exists()) {
        throw new Error('Review não encontrada');
      }

      const reviewData = reviewDoc.data() as Review;
      const hasLiked = reviewData.likedBy?.includes(userId);
      const hasDisliked = reviewData.dislikedBy?.includes(userId);

      const updateData: Record<string, unknown> = {};

      if (isLike) {
        if (hasLiked) {
          // Remove like
          updateData.likedBy = arrayRemove(userId);
          updateData.likes = increment(-1);
        } else {
          // Adiciona like
          updateData.likedBy = arrayUnion(userId);
          updateData.likes = increment(1);
          
          // Remove dislike se existir
          if (hasDisliked) {
            updateData.dislikedBy = arrayRemove(userId);
            updateData.dislikes = increment(-1);
          }
        }
      } else {
        if (hasDisliked) {
          // Remove dislike
          updateData.dislikedBy = arrayRemove(userId);
          updateData.dislikes = increment(-1);
        } else {
          // Adiciona dislike
          updateData.dislikedBy = arrayUnion(userId);
          updateData.dislikes = increment(1);
          
          // Remove like se existir
          if (hasLiked) {
            updateData.likedBy = arrayRemove(userId);
            updateData.likes = increment(-1);
          }
        }
      }

      await updateDoc(reviewRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar like/dislike:', error);
      throw new Error('Erro ao atualizar reação');
    }
  }

  // Marcar review como útil
  async markReviewHelpful(reviewId: string, userId: string): Promise<void> {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        helpful: increment(1),
      });
    } catch (error) {
      console.error('Erro ao marcar como útil:', error);
      throw new Error('Erro ao marcar como útil');
    }
  }

  // Atualizar review
  async updateReview(reviewId: string, userId: string, updateData: Partial<CreateReviewData>): Promise<void> {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (!reviewDoc.exists()) {
        throw new Error('Review não encontrada');
      }

      const reviewData = reviewDoc.data() as Review;
      
      if (reviewData.userId !== userId) {
        throw new Error('Não autorizado');
      }

      await updateDoc(reviewRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar review:', error);
      throw new Error('Erro ao atualizar avaliação');
    }
  }

  // Deletar review
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (!reviewDoc.exists()) {
        throw new Error('Review não encontrada');
      }

      const reviewData = reviewDoc.data() as Review;
      
      if (reviewData.userId !== userId) {
        throw new Error('Não autorizado');
      }

      await deleteDoc(reviewRef);
    } catch (error) {
      console.error('Erro ao deletar review:', error);
      throw new Error('Erro ao deletar avaliação');
    }
  }

  // Buscar reviews de um usuário
  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      console.log('🔍 Buscando reviews do usuário:', userId);
      
      // Busca simples sem orderBy para evitar necessidade de índice composto
      const userReviewsQuery = query(
        this.collection,
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(userReviewsQuery);
      console.log(`📝 Encontradas ${snapshot.size} reviews para o usuário`);
      
      const reviews = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Review do usuário:', { id: doc.id, productId: data.productId, title: data.title });
        
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
        } as Review;
      });

      // Ordenar em memória por data (mais recentes primeiro)
      const sortedReviews = reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log(`✅ Retornando ${sortedReviews.length} reviews ordenadas do usuário`);
      return sortedReviews;
      
    } catch (error) {
      console.error('❌ Erro ao buscar reviews do usuário:', error);
      console.error('📊 Stack trace:', error instanceof Error ? error.stack : 'N/A');
      throw new Error('Erro ao carregar suas avaliações: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  }
}

export const reviewService = new ReviewService();
