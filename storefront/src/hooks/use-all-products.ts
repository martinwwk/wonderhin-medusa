import {Product, QueryOptionsType} from "@/types/template";
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {listProductsClient} from "@/lib/data/products-client";
import {getCategoryByHandleClient} from "@/lib/data/categories-client";
import {HttpTypes} from "@medusajs/types";
import {transformMedusaProducts} from "@/lib/util/transform-products";

/** Map template sort_by values to Medusa order param */
function mapSortByToOrder(sort_by?: string): string | undefined {
    switch (sort_by) {
        case "new-arrival":     return "-created_at";
        case "oldest":          return "created_at";
        case "price-asc":       return "variants.calculated_price";
        case "price-desc":      return "-variants.calculated_price";
        case "a-z":             return "title";
        case "z-a":             return "-title";
        default:                return undefined;
    }
}

export const useProductsQuery = (options: QueryOptionsType & { categoryHandle?: string; categoryIds?: string[]; regionId?: string; q?: string }) => {
    return useQuery<Product[], Error>({
        queryKey: ['products', options],
        queryFn: async () => {
            if (!options.regionId) {
                throw new Error('Region ID is required');
            }

            const queryParams: HttpTypes.FindParams & HttpTypes.StoreProductListParams & { q?: string; order?: string } = {
                limit: options.limit || 12,
            };

            // Text search
            if (options.q) {
                queryParams.q = options.q;
            }

            // Sort order
            const order = mapSortByToOrder(options.sort_by);
            if (order) {
                (queryParams as any).order = order;
            }

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