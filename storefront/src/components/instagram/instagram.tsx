'use client';

import InstagramCard from '@/components/instagram/instagram-card';
import SectionHeader from '@/components/common/section-header';
import useWindowSize from '@/utils/use-window-size';
import Carousel from '@/components/shared/carousel/carousel';
import {SwiperSlide} from '@/components/shared/carousel/slider';
import {PropsInstagram} from "@/components/instagram/data";
import React, {useMemo} from "react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import {AnimatePresence, motion} from "motion/react";
import cn from "classnames";

interface Props {
    data?: PropsInstagram[];
    className?: string;
    variant?: string;
    headingPosition?: 'left' | 'center-xl';
    uniqueKey?: string;
    limit?: number;
    roundedClass?: string;
}

const breakpoints = {
    '1024': {
        slidesPerView: 4,
    },
    '768': {
        slidesPerView: 3,
    },
    '540': {
        slidesPerView: 2,
    },
    '0': {
        slidesPerView: 2,
    },
};

const InstagramGrid: React.FC<Props> = ({
                                            data,
                                            className = 'mb-15 lg:mb-20',
                                            headingPosition = 'center-xl',
                                            uniqueKey = 'instagram',
                                            variant='default',
                                            limit = 6,
                                            roundedClass = 'rounded-xl',
                                        }) => {
    const {width} = useWindowSize();
    const {isInView, slideVariants, ref} = useSwiperAnimation();

    const carouselSlides = useMemo(() => {
        return data?.slice(0, limit)?.map((item, index: number) => (
            <SwiperSlide key={`collection-key-${index}`}>
                <InstagramCard
                    key={item.id}
                    collection={item}
                    variant={variant}
                    rounded={roundedClass}
                />
            </SwiperSlide>
        ));
    }, [data, limit, variant, roundedClass]);

    const gridSlides = useMemo(() => {
        return data?.slice(0, limit)?.map((item) => (
            <AnimatePresence mode="wait" key={`animate-${item.id}`}>
                <motion.div
                    key={`collection-${item.id}`}
                    variants={slideVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    exit="exit"
                    className="relative h-full"
                    custom={item.id}
                >
                    <InstagramCard
                        key={item.id}
                        collection={item}
                        variant={variant}
                        rounded={roundedClass}
                    />
                </motion.div>
            </AnimatePresence>
        ));
    }, [data, limit, slideVariants, isInView, variant, roundedClass]);

    return (
        <div className={className} ref={ref}>
            <SectionHeader
                sectionHeading="Shop by Gram"
                sectionSubHeading="Inspire and let yourself be inspired, from one unique fashion to another."
                headingPosition={headingPosition}
            />
            {width! < 1280 ? (
                <Carousel
                    breakpoints={breakpoints}
                    prevActivateId={`prev${uniqueKey}`}
                    nextActivateId={`next${uniqueKey}`}
                >
                    {carouselSlides}
                </Carousel>
            ) : (
                <div className={cn("gap-2 xl:grid xl:grid-cols-6 xl:gap-2.5", {
                    '2xl:grid-cols-7': limit === 7
                })}>
                    {gridSlides}
                </div>
            )}

        </div>
    );
};

export default InstagramGrid;
