import ProductsCarousel from '@/components/product/feeds/products-carousel';
import { useRelatedProductsQuery } from '@/lib/data/template-products';
import { LIMITS } from '@/lib/util/limits';

interface RelatedProductsProps {
  carouselBreakpoint?: {} ;
  className?: string;
  uniqueKey?: string;
}

const RelatedProductSlider: React.FC<RelatedProductsProps> = ({
  carouselBreakpoint,
  className,
  uniqueKey = 'related-product-popup',
}) => {
  const { data: Product=[], isLoading,error } = useRelatedProductsQuery({
    limit: LIMITS.RELATED_PRODUCTS_LIMITS,
  });
  return (
    <ProductsCarousel
      sectionHeading="Related Products"
      className={className}
      products={Product}
      loading={isLoading}
      error={error}
      limit={LIMITS.RELATED_PRODUCTS_LIMITS}
      uniqueKey={uniqueKey}
      carouselBreakpoint={carouselBreakpoint}
    />
  );
};

export default RelatedProductSlider;
