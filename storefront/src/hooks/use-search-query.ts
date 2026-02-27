import { Product, QueryOptionsType } from "@/types/template";
import { useQuery } from "@tanstack/react-query";
import { API_RESOURCES } from "@/lib/data/api-endpoints";
// import { fetchSearched } from "@/lib/data/template-products";

export const useSearchQuery = (options: QueryOptionsType) => {
    return useQuery<Product[], Error>({
        queryKey: [API_RESOURCES.PRODUCTS, options],
        // queryFn: fetchSearched,
        queryFn: () => Promise.resolve([]), // Placeholder until fetchSearched is implemented
    });
};