"use client";
import ProductsCarousel from '@/components/product/feeds/products-carousel';
import { LIMITS } from '@/lib/util/limits';
import { FC, useMemo } from "react";
import { useBestSellerProducts } from '@/hooks/use-products';

interface Props {
    className?: string;
    variant?: 'caleste' | 'underwear' | 'tiny' | 'default' | 'cardList' | 'searchResults';
    rowCarousel?: number;
    uniqueKey?: string;
    showBtnAllProducts?: boolean;
}


const BestSellerFeed: FC<Props> = ({
    className = 'mb-15 lg:mb-22',
    variant = 'default',
    rowCarousel = 1,
    uniqueKey = "best-sellers",
    showBtnAllProducts = false
}) => {
    const limit = LIMITS.BEST_SELLER_PRODUCTS_LIMITS;

    // Fetch best seller products from Medusa
    // Note: Configure your Medusa products with metadata.isBestSeller = true
    // or use collection_id / tag_id in the hook implementation
    const { data: Products = [], isLoading, error } = useBestSellerProducts({
        limit,
        enabled: true
    });

    // Memoize sectionHeading based on variant
    const sectionHeading = useMemo(() => {
        return 'Best Selling';
    }, []);


    return (
        <ProductsCarousel
            sectionHeading={sectionHeading}
            products={Products}
            loading={isLoading}
            error={error}
            limit={LIMITS.BEST_SELLER_PRODUCTS_LIMITS}
            uniqueKey={uniqueKey}
            rowCarousel={rowCarousel}
            variant={variant}
            className={className}
            showBtnAllProducts={showBtnAllProducts}
        />
    );
}
export default BestSellerFeed;
