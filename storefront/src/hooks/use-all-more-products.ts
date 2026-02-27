import { PaginatedProduct, QueryOptionsType } from "@/types/template";
import { InfiniteData, QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { listProductsWithPaginationClient } from "@/lib/data/products-client";
import { HttpTypes } from "@medusajs/types";
import { getCategoryByHandleClient } from "@/lib/data/categories-client";
import { transformMedusaProducts } from "@/lib/util/transform-products";

export const useMoreProductsQuery = (options: QueryOptionsType & { categoryHandle?: string; categoryIds?: string[]; regionId?: string }) => {
    return useInfiniteQuery<PaginatedProduct, Error, InfiniteData<PaginatedProduct, number>, QueryKey, number>({
        queryKey: ['load-products', options],
        queryFn: async ({ pageParam }) => {
            if (!options.regionId) {
                throw new Error('Region ID is required');
            }

            const queryParams: HttpTypes.FindParams & HttpTypes.StoreProductListParams = {
                limit: options.limit || 12,
            };

            // If category IDs are provided directly, use them
            if (options.categoryIds && options.categoryIds.length > 0) {
                queryParams.category_id = options.categoryIds;
            }
            // Otherwise, if category handle is provided, fetch category and filter by it
            else if (options.categoryHandle) {
                const category = await getCategoryByHandleClient([options.categoryHandle]);
                if (category?.id) {
                    queryParams.category_id = [category.id];
                }
            }

            // Fetch products with pagination using client-side function
            const result = await listProductsWithPaginationClient({
                pageParam,
                queryParams,
                regionId: options.regionId,
            });

            return {
                data: transformMedusaProducts(result.products),
                paginatorInfo: {
                    total: result.count,
                    currentPage: pageParam,
                    nextPage: result.nextPage,
                },
            };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.paginatorInfo.nextPage,
        retry: 1,
    });
};
