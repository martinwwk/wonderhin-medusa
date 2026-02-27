import { QueryOptionsType, Product } from '@/types/template';
import http from '@/lib/data/http';
import { API_RESOURCES } from '@/lib/data/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchBestSellerProducts = async () => {
  try {
    const { data } = await http.get(API_RESOURCES.BEST_SELLER_PRODUCTS);
    return data as Product[];
  } catch (error) {
    console.error('Error fetch best seller products:', error);
    throw new Error('Unable to load product content at the moment. Please try again later.');
  }
};

export const useBestSellerProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.BEST_SELLER_PRODUCTS, options],
    queryFn: fetchBestSellerProducts,
    retry: 1,
  });
};

export const fetchPopularProducts = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  try {
    const [, options] = queryKey as readonly [string, QueryOptionsType?];
    const params = { limit: options?.limit };
    const { data } = await http.get(API_RESOURCES.POPULAR_PRODUCTS, { params });

    const limit = options?.limit;
    return limit ? (data as Product[]).slice(0, limit) : (data as Product[]);
  } catch (error) {
    console.error('Error fetch popular products:', error);
    throw new Error('Unable to load product content at the moment. Please try again later.');
  }
};

export const usePopularProductsQuery = (options?: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.POPULAR_PRODUCTS, options],
    queryFn: fetchPopularProducts,
    retry: 1,
  });
};

export const fetchRelatedProducts = async () => {
  try {
    const { data } = await http.get(API_RESOURCES.RELATED_PRODUCTS);
    return data;
  } catch (error) {
    console.error('Error fetch products:', error);
    throw new Error('Unable to load product content at the moment. Please try again later.');
  }
};

export const useRelatedProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.RELATED_PRODUCTS, options],
    queryFn: fetchRelatedProducts,
    retry: 1,
  });
};

export const fetchAllProducts = async () => {
  try {
    const { data } = await http.get(API_RESOURCES.PRODUCTS);
    return data as Product[];
  } catch (error) {
    console.error('Error fetch products:', error);
    throw new Error('Unable to load product content at the moment. Please try again later.');
  }
};

export const fetchProduct = async (_slug: string) => {
  try {
    const { data } = await http.get(`${API_RESOURCES.PRODUCT}`);
    return data;
  } catch (error) {
    console.error('Error fetch products:', error);
    throw new Error('Unable to load product content at the moment. Please try again later.');
  }
};

export const fetchSearched = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  try {
    const [, options] = queryKey as readonly [string, QueryOptionsType?];
    const params = {
      text: options?.text,
    };

    const { data } = await http.get(API_RESOURCES.PRODUCTS, { params });

    function searchProduct(product: Product) {
      const searchText = options?.text?.toLowerCase() ?? '';
      return product.name.toLowerCase().includes(searchText);
    }
    return data.filter(searchProduct);
  } catch (error) {
    console.error('Error fetch products:', error);
    throw new Error('Unable to load product content at the moment. Please try again later.');
  }
};

export const fetchSearchedProduct = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  try {
    const [, options] = queryKey as readonly [string, QueryOptionsType?];
    const { data } = await http.get(API_RESOURCES.PRODUCTS);

    if (!options?.id) {
      return data;
    }

    const ids = options.id.split(',');

    function searchProduct(product: Product) {
      return ids.includes(String(product.id));
    }

    return data.filter(searchProduct);
  } catch (error) {
    console.error('Error fetch products:', error);
    throw new Error('Unable to load product content at the moment. Please try again later.');
  }
};

export const useProductQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.PRODUCTS, options],
    queryFn: fetchSearchedProduct,
    retry: 1,
  });
};

import { QueryKey, QueryFunctionContext } from '@tanstack/react-query';
import { PaginatedProduct } from '@/types/template';

export const fetchMoreProducts = async ({
  queryKey,
  pageParam = 1,
}: QueryFunctionContext<QueryKey, number>): Promise<PaginatedProduct> => {
  try {
    const [, options] = queryKey as ['load-products', QueryOptionsType];
    const { limit = 10, sort_by } = options;

    const startIndex = (pageParam - 1) * limit;
    const endIndex = startIndex + limit;
    let { data } = await http.get(API_RESOURCES.PRODUCTS);

    if (sort_by === 'price') {
      data = [...data].sort((a: Product, b: Product) => (a.price || 0) - (b.price || 0));
    } else if (sort_by === 'name') {
      data = [...data].sort((a: Product, b: Product) => a.name.localeCompare(b.name));
    }

    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      paginatorInfo: {
        nextPage: endIndex < data.length ? pageParam + 1 : null,
        total: data.length,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

// Caleste variant fetchers
export const fetchBestSellerCaleste = async () => {
  const { data } = await http.get(API_RESOURCES.CALESTE_BEST_SELLER);
  return data as Product[];
};
export const useBestSellerCelesteQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.CALESTE_BEST_SELLER, options],
    queryFn: () => fetchBestSellerCaleste(),
  });
};

export const fetchPopularCaleste = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const [, options] = queryKey as readonly [string, QueryOptionsType?];
  const params = { limit: options?.limit };
  const { data } = await http.get(API_RESOURCES.CALESTE_POPULAR, { params });
  const limit = options?.limit;
  const limitedData = limit ? (data as Product[]).slice(0, limit) : data;
  return limitedData as Product[];
};
export const usePopularCelesteQuery = (options?: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.CALESTE_POPULAR, options],
    queryFn: fetchPopularCaleste,
  });
};

// Tiny variant fetchers
export const fetchBestSellerTiny = async () => {
  const { data } = await http.get(API_RESOURCES.TINY_BEST_SELLER);
  return data as Product[];
};
export const useBestSellerTinyQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.TINY_BEST_SELLER, options],
    queryFn: () => fetchBestSellerTiny(),
  });
};

export const fetchPopularTiny = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const [, options] = queryKey as readonly [string, QueryOptionsType?];
  const params = { limit: options?.limit };
  const { data } = await http.get(API_RESOURCES.TINY_POPULAR, { params });
  const limit = options?.limit;
  const limitedData = limit ? (data as Product[]).slice(0, limit) : data;
  return limitedData as Product[];
};
export const usePopularTinyQuery = (options?: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.TINY_POPULAR, options],
    queryFn: fetchPopularTiny,
  });
};

// Underwear variant fetchers
export const fetchBestSellerUnderwear = async () => {
  const { data } = await http.get(API_RESOURCES.UNDERWEAR_BEST_SELLER);
  return data as Product[];
};
export const useBestSellerUnderwearQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.UNDERWEAR_BEST_SELLER, options],
    queryFn: () => fetchBestSellerUnderwear(),
  });
};

export const fetchPopularUnderwear = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const [, options] = queryKey as readonly [string, QueryOptionsType?];
  const params = { limit: options?.limit };
  const { data } = await http.get(API_RESOURCES.UNDERWEAR_POPULAR, { params });
  const limit = options?.limit;
  const limitedData = limit ? (data as Product[]).slice(0, limit) : data;
  return limitedData as Product[];
};
export const usePopularUnderwearQuery = (options?: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_RESOURCES.UNDERWEAR_POPULAR, options],
    queryFn: fetchPopularUnderwear,
  });
};
