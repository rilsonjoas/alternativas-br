import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/lib/services/categoryService';
import { productService } from '@/lib/services/productService';
import { Category, Product } from '@/types';

// ==================== CATEGORIES ====================

// Hook para buscar todas as categorias
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar categoria por slug
export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar categorias em destaque
export const useFeaturedCategories = () => {
  return useQuery({
    queryKey: ['categories', 'featured'],
    queryFn: () => categoryService.getFeatured(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ==================== PRODUCTS ====================

// Hook para buscar todos os produtos
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar produto por slug
export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar produtos por categoria
export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: () => productService.getByCategory(categorySlug),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar produtos em destaque
export const useFeaturedProducts = (limit: number = 4) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => productService.getFeatured(limit),
    staleTime: 10 * 60 * 1000,
  });
};

// Hook para buscar produtos unicórnio
export const useUnicornProducts = () => {
  return useQuery({
    queryKey: ['products', 'unicorns'],
    queryFn: () => productService.getUnicorns(),
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};

// Hook para buscar produtos relacionados
export const useRelatedProducts = (categorySlug: string, excludeId: string, limit: number = 3) => {
  return useQuery({
    queryKey: ['products', 'related', categorySlug, excludeId, limit],
    queryFn: () => productService.getRelated(categorySlug, excludeId, limit),
    enabled: !!categorySlug && !!excludeId,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook para busca de produtos
export const useProductSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ['products', 'search', searchTerm],
    queryFn: () => productService.search(searchTerm),
    enabled: searchTerm.length >= 2, // Só busca com 2+ caracteres
    staleTime: 2 * 60 * 1000, // 2 minutos (busca muda frequentemente)
  });
};

// ==================== MUTATIONS ====================

// Hook para criar categoria
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => 
      categoryService.create(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Hook para atualizar categoria
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) => 
      categoryService.update(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
    },
  });
};

// Hook para criar produto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
      productService.create(productData),
    onSuccess: (_, productData) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'category', productData.categorySlug] });
    },
  });
};

// Hook para atualizar produto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) => 
      productService.update(id, updates),
    onSuccess: (_, { id, updates }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      if (updates.categorySlug) {
        queryClient.invalidateQueries({ queryKey: ['products', 'category', updates.categorySlug] });
      }
    },
  });
};

// ==================== UTILITIES ====================

// Hook para dados da página de categoria (categoria + produtos)
export const useCategoryPage = (slug: string) => {
  const categoryQuery = useCategoryBySlug(slug);
  const productsQuery = useProductsByCategory(slug);
  
  return {
    category: categoryQuery.data,
    products: productsQuery.data || [],
    isLoading: categoryQuery.isLoading || productsQuery.isLoading,
    error: categoryQuery.error || productsQuery.error,
    refetch: () => {
      categoryQuery.refetch();
      productsQuery.refetch();
    }
  };
};
