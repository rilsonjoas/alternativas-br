import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

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
        console.log('Nenhum produto em destaque encontrado, usando fallback...');
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
    queryKey: ['product', slug],
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
