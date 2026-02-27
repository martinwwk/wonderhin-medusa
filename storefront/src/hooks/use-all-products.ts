import {Product, QueryOptionsType} from "@/types/template";
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {listProductsClient} from "@/lib/data/products-client";
import {getCategoryByHandleClient} from "@/lib/data/categories-client";
import {HttpTypes} from "@medusajs/types";
import {transformMedusaProducts} from "@/lib/util/transform-products";

export const useProductsQuery = (options: QueryOptionsType & { categoryHandle?: string; categoryIds?: string[]; regionId?: string }) => {
    return useQuery<Product[], Error>({
        queryKey: ['products', options],
        queryFn: async () => {
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

            // Fetch products with Medusa API
            const products = await listProductsClient({
                queryParams,
                regionId: options.regionId,
            });

            return transformMedusaProducts(products);
        },
        retry: 1,
        placeholderData: keepPreviousData,
    });
};