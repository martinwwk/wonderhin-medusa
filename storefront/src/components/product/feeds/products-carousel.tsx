import React, {useMemo} from "react";
import SectionHeader from '@/components/common/section-header';
import Carousel from '@/components/shared/carousel/carousel';
import {SwiperSlide} from '@/components/shared/carousel/slider';
import ProductCardLoader from '@/components/shared/loaders/product-card-loader';
import cn from 'classnames';
import ProductCard from '@/components/product/productListing/productCards/product-card';
import ProductCardVertical from "@/components/product/productListing/productCards/product-card-vertical";
import {BreakpointsType, Product} from "@/types/template";
import useCarouselConfig from "@/hooks/use-carousel-config";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import {AnimatePresence, motion} from "motion/react";
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";
import {LIMITS} from "@/lib/util/limits";
import Alert from "@/components/shared/alert";

interface ProductsCarouselProps {
    sectionHeading?: string;
    className?: string;
    products?: Product[];
    loading?: boolean;
    limit?: number;
    uniqueKey?: string;
    carouselBreakpoint?: BreakpointsType;
    rowCarousel?: number;
    variant?: 'caleste' | 'underwear' | 'tiny' | 'default' | 'cardList' | 'searchResults';
    showBtnAllProducts?: boolean;
    error?: Error | null;
}


const ProductsCarousel: React.FC<ProductsCarouselProps> = ({
                                                               sectionHeading = '',
                                                               className = '',
                                                               products = [],
                                                               loading = false,
                                                               error,
                                                               limit = LIMITS.BEST_SELLER_PRODUCTS_LIMITS,
                                                               uniqueKey = 'products-carousel',
                                                               carouselBreakpoint,
                                                               variant = 'default',
                                                               rowCarousel = 1,
                                                               showBtnAllProducts = false,
                                                           }) => {

    const {spaceBetween, breakpoints} = useCarouselConfig(variant, uniqueKey);
    const {isInView, slideVariants, ref} = useSwiperAnimation();

    // useMemo in SectionHeader
    const memoizedSectionHeader = useMemo(() => {
        if (!sectionHeading) return null;

        switch (variant) {
            case 'underwear':
                return (
                    <SectionHeader
                        sectionHeading={sectionHeading}
                        headingPosition="center-xl"
                    />
                );
            case 'tiny':
                return (
                    <SectionHeader
                        sectionHeading={sectionHeading}
                        showBtnViewAll={showBtnAllProducts}
                    />
                );
            default:
                return (
                    <SectionHeader
                        sectionHeading={sectionHeading}
                        sectionSubHeading="Unmatched design superior performance and customer satisfaction in one."
                        headingPosition="center-xl"
                    />
                );
        }
    }, [variant, sectionHeading, showBtnAllProducts]);


    // Memo of the entire product list
    const memoizedProductCards = useMemo(() => {
        if (!products || loading) return null;

        return products.map((product: Product, idx: number) => {
            const card =
                variant === 'cardList' ? (
                    <ProductCardVertical
                        key={`${uniqueKey}-card-${product.id}`}
                        product={product}
                        variant={variant}
                    />
                ) : (
                    <ProductCard
                        key={`${uniqueKey}-card-${product.id}`}
                        product={product}
                        variant={variant}
                    />
                );

            return (
                <SwiperSlide key={`${uniqueKey}-slide-${idx}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`product-${product.id}`}
                            variants={slideVariants}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            custom={idx}
                        >
                            {card}
                        </motion.div>
                    </AnimatePresence>
                </SwiperSlide>
            );
        });
    }, [products, variant, uniqueKey, isInView, slideVariants, loading]);

    return (
        <div className={cn('heightFull relative ', className)} ref={ref}>
            {/* Render memoized header */}
            {memoizedSectionHeader}

            {error && <Alert message={error.message} />}
            <div
                className={cn('relative ', {
                    'border border-black/10 rounded bg-white overflow-hidden md:p-3 lg:p-5': variant === 'cardList',
                })}
            >
                <Carousel
                    spaceBetween={spaceBetween}
                    grid={{rows: rowCarousel, fill: 'row'}}
                    breakpoints={carouselBreakpoint || breakpoints}
                    prevActivateId={`prev${uniqueKey}`}
                    nextActivateId={`next${uniqueKey}`}
                >
                    {loading ? (
                        Array.from({length: limit!}).map((_, idx) => (
                            <SwiperSlide key={`${uniqueKey}-${idx}`}>
                                <AnimatePresence>
                                    <motion.div
                                        key={`loader-${idx}`}
                                        variants={slideVariants}
                                        initial="hidden"
                                        animate={isInView ? 'visible' : 'hidden'}
                                        custom={idx} // Pass index for staggered animation
                                        className="w-80"
                                    >
                                        <ProductCardLoader uniqueKey={`${uniqueKey}-${idx}`}/>
                                    </motion.div>
                                </AnimatePresence>
                            </SwiperSlide>
                        ))
                    ) : (
                        memoizedProductCards
                    )}
                </Carousel>

                {showBtnAllProducts && variant != 'tiny' && (
                    <div className={"w-full flex justify-center text-center mt-7 lg:mt-9"}>
                        <Link variant={"button-black"} href={ROUTES.CATEGORIES}>
                            Show all
                            Products
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductsCarousel;
