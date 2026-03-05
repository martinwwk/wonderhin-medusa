import { QueryOptionsType } from "@/types/template";
import { useProductsQuery } from "@/hooks/use-all-products";

/**
 * Search products from Medusa using the `q` text-search param.
 * Requires: options.text  (the search term)
 *           options.regionId  (Medusa region id — pass from useRegion().data?.id)
 */
export const useSearchQuery = (options: QueryOptionsType & { regionId?: string }) => {
    return useProductsQuery({
        q: options.text || "",
        limit: options.limit || 8,
        regionId: options.regionId,
    });
};