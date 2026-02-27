import { useQuery } from "@tanstack/react-query";
import { listTopLevelCategoriesClient, getCategoryMediaClient } from "@/lib/data/categories-client";
import { transformMedusaCategory } from "@/lib/util/transform-categories";
import { Category } from "@/types/template";

/**
 * Fetch only top-level categories (no parent) with their children hierarchy.
 * Uses parent_category_id=null and include_descendants_tree=true.
 */
export function useCategories() {
    return useQuery<Category[]>({
        queryKey: ["categories", "top-level"],
        queryFn: async () => {
            const medusaCategories = await listTopLevelCategoriesClient();
            
            // Fetch media for each top-level category
            const categoriesWithMedia = await Promise.all(
                medusaCategories.map(async (category) => {
                    const media = await getCategoryMediaClient(category.id);
                    return transformMedusaCategory(category, media);
                })
            );
            
            return categoriesWithMedia;
        },
        retry: 1,
        retryDelay: 2000,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}