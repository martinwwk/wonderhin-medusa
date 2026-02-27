'use client';
import {FC, useMemo} from 'react';
import { LIMITS } from '@/lib/util/limits';
import ProductsCarousel from "@/components/product/feeds/products-carousel";
import {usePopularProducts} from '@/hooks/use-products';

interface ProductFeedProps {
    variant?: 'caleste'|'underwear' | 'tiny' | 'default' | 'cardList' | 'searchResults';
      className?: string;
      uniqueKey?: string;
    rowCarousel?: number;
    showBtnAllProducts?: boolean;
}

const TrendingProductFeed: FC<ProductFeedProps> = ({
                                                     variant = 'default',
                                                     className = 'mb-15 lg:mb-22',
                                                     uniqueKey="trending-outfits",
                                                       rowCarousel = 1,
                                                       showBtnAllProducts = false
                                                   }) => {
    const limit = variant === 'caleste' ? 4 : LIMITS.POPULAR_PRODUCTS_LIMITS;

    // Fetch popular products from Medusa
    // Note: Configure your Medusa products with metadata.isPopular = true or metadata.isTrending = true
    // or use collection_id / tag_id in the hook implementation
    const { data: products, isLoading, error } = usePopularProducts({ 
        limit,
        enabled: true
    });

    // Memoize sectionHeading based on variant
    const sectionHeading = useMemo(() => {
        if (uniqueKey === 'popular-picks') return ;
        if (variant === 'tiny') return 'Popular picks';
        if (variant === 'underwear') return 'Today\'s Popular Picks';
        return 'Trending Outfits';
    }, [variant,uniqueKey]);
    
    
    return (
          <ProductsCarousel
              sectionHeading={sectionHeading}
              className={className}
              products={products}
              loading={isLoading}
              error ={error}
              limit={LIMITS.POPULAR_PRODUCTS_LIMITS}
              uniqueKey={uniqueKey}
              rowCarousel={rowCarousel}
              variant={variant}
              showBtnAllProducts={showBtnAllProducts}
        />
  );
};
export default TrendingProductFeed;
