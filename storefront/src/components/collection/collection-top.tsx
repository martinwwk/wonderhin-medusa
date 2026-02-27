'use client';

import TopCard from "@/components/collection/collectionCard/top-card";
import Carousel from '@/components/shared/carousel/carousel';
import {SwiperSlide} from '@/components/shared/carousel/slider';
import SectionHeader from "@/components/common/section-header";
import React, {useMemo} from "react";
import CategoryCardLoader from "@/components/shared/loaders/category-card-loader";
import {AnimatePresence, motion } from "motion/react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";

import {useCategories} from "@/hooks/use-categories";
import Alert from "@/components/shared/alert";

interface Props {
    className?: string;
    headingPosition?: 'left' | 'center-xl';
    uniqueKey?: string;
    variant?: 'caleste' | 'tiny' | 'default';
}

const breakpoints = {
    '1280': {
        slidesPerView: 6,
    },
    '1024': {
        slidesPerView: 4,
    },
    '640': {
        slidesPerView: 3,
    },
    '360': {
        slidesPerView: 2,
    },
    '0': {
        slidesPerView: 1,
    },
};

const CollectionTop: React.FC<Props> = ({
                                             className = 'mb-15 lg:mb-22',
                                             uniqueKey = 'collection-top',
                                             headingPosition = 'center-xl',
                                            variant = 'default',
                                         }) => {
    const CATEGORIES_LIMITS = 6;

    // Call both hooks unconditionally
    const categoriesQuery = useCategories();

    // Select the appropriate data based on variant
    const selectedQuery = useMemo(() => {
        switch (variant) {
            default: return categoriesQuery;
        }
    }, [categoriesQuery, variant]);
    const { data: categories, isLoading, isError, error } = selectedQuery;

    // Memoize sectionHeading based on variant
    const sectionHeading = useMemo(() => {
        switch (variant) {
            default:
                return "Top Collections";
        }

    }, [variant]);
    const { isInView, slideVariants, ref } = useSwiperAnimation();

    const skeletonSlides = useMemo(() => {
        return Array.from({ length: CATEGORIES_LIMITS }).map((_, idx) => (
            <SwiperSlide key={`category--key-${idx}`}>
                <AnimatePresence>
                    <motion.div
                        key={`loader-${idx}`}
                        variants={slideVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        exit="exit"
                        custom={idx}
                        className="w-52"
                    >
                        <CategoryCardLoader uniqueKey={`category-card-${idx}`} />
                    </motion.div>
                </AnimatePresence>
            </SwiperSlide>
        ));
    }, [slideVariants, isInView]);

    const categorySlides = useMemo(() => {
        return categories?.slice(0, CATEGORIES_LIMITS).map((category, idx) => (
            <SwiperSlide key={`category--key-${category.id}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`category-${category.id}`}
                        variants={slideVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        exit="exit"
                        custom={idx}
                    >
                        <TopCard key={category.id} category={category} />
                    </motion.div>
                </AnimatePresence>
            </SwiperSlide>
        ));
    }, [categories, slideVariants, isInView]);

    return (
        <div className={className} ref={ref}> {/* Attach ref to the container */}
            {sectionHeading && (
                <SectionHeader
                    sectionHeading={sectionHeading}
                    sectionSubHeading="Express your style with our standout collection—fashion meets sophistication."
                    headingPosition={headingPosition}
                />
            )}
            {isError && <Alert message={(error as Error)?.message || 'Something went wrong'} />}
            <Carousel
                breakpoints={breakpoints}
                prevActivateId={`prev${uniqueKey}`}
                nextActivateId={`next${uniqueKey}`}
            >
                {isLoading ? skeletonSlides : categorySlides}
            </Carousel>
        
        </div>
    );
};

export default CollectionTop;
