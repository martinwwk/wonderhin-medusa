import {useQuery} from "@tanstack/react-query";
import {Product} from "@/types/template";
import {retrieveProductClient} from "@/lib/data/products-client";
import {transformMedusaProduct} from "@/lib/util/transform-products";

export const useProductQuery = (slug: string, regionId?: string) => {
    return useQuery<Product, Error>({
        queryKey: ['product', slug, regionId],
        queryFn: async () => {
            if (!regionId) {
                throw new Error('Region ID is required');
            }
            const product = await retrieveProductClient({ handle: slug, regionId });
            if (!product) {
                throw new Error('Product not found');
            }
            return transformMedusaProduct(product);
        },
        enabled: !!regionId && !!slug,
        retry: 1,
    });
};