import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Product, ToolSuggestion } from '@/types';
import { db } from '@/lib/firebase';

// Hook para buscar produtos em destaque
export const useFeaturedProducts = (limitCount: number = 6) => {
  return useQuery({
    queryKey: ['featuredProducts', limitCount],
    queryFn: async (): Promise<Product[]> => {
      try {
        // Tentar query simples primeiro
        const q = query(
          collection(db, 'products'),
          where('isFeatured', '==', true),
          limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        const featuredProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        // Se encontrou produtos em destaque, retorná-los
        if (featuredProducts.length > 0) {
          return featuredProducts.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          });
        }
        
        // Fallback: buscar todos os produtos e pegar os primeiros
        const allSnapshot = await getDocs(collection(db, 'products'));
        const allProducts = allSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        // Retornar os primeiros produtos como destaque temporário
        return allProducts.slice(0, limitCount);
        
      } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        
        // Fallback: buscar todos os produtos sem filtros
        const allSnapshot = await getDocs(collection(db, 'products'));
        const allProducts = allSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        return allProducts.slice(0, limitCount);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar produtos
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar produtos com filtro de texto
export const useProductSearch = (searchQuery: string) => {
  return useQuery({
    queryKey: ['productSearch', searchQuery],
    queryFn: async (): Promise<Product[]> => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const allProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      if (!searchQuery) return allProducts;
      
      const lowerQuery = searchQuery.toLowerCase();
      return allProducts.filter(product => {
        const searchableText = [
          product.name,
          product.description,
          ...(product.features || []),
          ...(product.tags || [])
        ].join(' ').toLowerCase();
        return searchableText.includes(lowerQuery);
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: searchQuery.length >= 2,
  });
};

// Hook para buscar produto por slug
export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug, 'v2'], // Added version to force cache refresh
    queryFn: async (): Promise<Product | null> => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const product = querySnapshot.docs.find(doc => {
        const data = doc.data() as Product;
        return data.slug === slug;
      });
      
      if (!product) return null;
      
      return {
        id: product.id,
        ...product.data()
      } as Product;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!slug,
  });
};

// Hook para buscar produtos relacionados (por tags similares)
export const useProductsByCategory = (tags: string[] = [], excludeId?: string) => {
  return useQuery({
    queryKey: ['relatedProducts', tags, excludeId],
    queryFn: async (): Promise<Product[]> => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const allProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      return allProducts.filter(product => {
        if (product.id === excludeId) return false;
        if (!tags.length) return false;
        
        // Verifica se há tags em comum
        const productTags = product.tags || [];
        return tags.some(tag => productTags.includes(tag));
      }).slice(0, 4); // Limita a 4 produtos relacionados
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: tags.length > 0,
  });
};

// Função para enviar uma sugestão de ferramenta
export const submitSuggestion = async (suggestion: Omit<ToolSuggestion, 'id' | 'createdAt' | 'status'>) => {
  try {
    const suggestionsRef = collection(db, 'suggestions');
    const newSuggestion = {
      ...suggestion,
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(suggestionsRef, newSuggestion);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erro ao enviar sugestão:', error);
    throw error;
  }
};
// Funções para o Dashboard de Sugestões

// Hook para buscar sugestões pendentes
export const useSuggestions = () => {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: async (): Promise<ToolSuggestion[]> => {
      try {
        const q = query(
          collection(db, 'suggestions'),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ToolSuggestion));
      } catch (error) {
        console.error('Erro na query complexa de sugestões, tentando fallback de memória:', error);
        
        // Fallback: buscar tudo e filtrar/ordenar em memória para evitar erro de index
        const allSnapshot = await getDocs(collection(db, 'suggestions'));
        const allSuggestions = allSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ToolSuggestion));
        
        return allSuggestions
          .filter(s => s.status === 'pending')
          .sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
          });
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Deletar ou rejeitar sugestão
export const deleteSuggestion = async (id: string) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'suggestions', id));
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar sugestão:', error);
    throw error;
  }
};

// Aprovar sugestão (esta função precisaria de lógica complexa para mapear ToolSuggestion -> Product)
// Por enquanto, apenas muda o status
export const updateSuggestionStatus = async (id: string, status: 'approved' | 'rejected') => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'suggestions', id), { status });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status da sugestão:', error);
    throw error;
  }
};

// Função para votar em um produto
export const voteProduct = async (productId: string) => {
  try {
    const { doc, updateDoc, increment, collection, addDoc, query, where, getDocs } = await import('firebase/firestore');
    
    // Identificador único do usuário (fingerprint simples via localStorage)
    let voterId = localStorage.getItem('voter_id');
    if (!voterId) {
      voterId = crypto.randomUUID();
      localStorage.setItem('voter_id', voterId);
    }

    // Verificar se já votou
    const voteRef = collection(db, 'votes');
    const q = query(voteRef, where('productId', '==', productId), where('voterId', '==', voterId));
    const voteSnapshot = await getDocs(q);

    if (!voteSnapshot.empty) {
      throw new Error('Você já curtiu este produto!');
    }

    // Incrementar upvotes no produto
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      upvotes: increment(1)
    });

    // Registrar o voto para evitar duplicidade
    await addDoc(voteRef, {
      productId,
      voterId,
      createdAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao votar no produto:', error);
    throw error;
  }
};

// Hook para verificar se o usuário já votou
export const useHasVoted = (productId: string) => {
  return useQuery({
    queryKey: ['hasVoted', productId],
    queryFn: async () => {
      const voterId = localStorage.getItem('voter_id');
      if (!voterId) return false;

      const q = query(
        collection(db, 'votes'),
        where('productId', '==', productId),
        where('voterId', '==', voterId)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    },
    enabled: !!productId,
  });
};
