import { useBestSellerProductsQuery } from '@/lib/data/template-products';
import { usePopularProductsQuery } from '@/lib/data/template-products';
import { QueryOptionsType } from '@/types/template';

/**
 * Hook to fetch best seller products from Medusa
 * @param options - Query options including limit and enabled flags
 * @returns React Query result with data, isLoading, error
 */
export const useBestSellerProducts = (options?: QueryOptionsType) => {
  return useBestSellerProductsQuery(options || {});
};

/**
 * Hook to fetch popular/trending products from Medusa
 * @param options - Query options including limit and enabled flags
 * @returns React Query result with data, isLoading, error
 */
export const usePopularProducts = (options?: QueryOptionsType) => {
  return usePopularProductsQuery(options);
};
