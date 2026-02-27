'use client';
import Carousel from '@/components/shared/carousel/carousel';
import {SwiperSlide} from '@/components/shared/carousel/slider';
import ProductCardLoader from "@/components/shared/loaders/product-card-loader";
import React, {useMemo} from "react";
import cn from "classnames";
import {LIMITS} from "@/lib/util/limits";
import SectionHeader from "@/components/common/section-header";
import BlogCard from "@/components/blog/blog-card";
import {AnimatePresence, motion} from "motion/react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import {useBlogsQuery} from "@/hooks/use-blog-query";
import Alert from "@/components/shared/alert";

interface Props {
    className?: string;
    variant?: string;
    uniqueKey?: string;
}

const LatestblogCarousel: React.FC<Props> = ({
                                                 className,
                                                 variant = 'default',
                                                 uniqueKey = 'latestblog',
                                             }) => {
    const {data: dataBlog, isLoading, error} = useBlogsQuery();
    const limit = LIMITS.LATEST_BLOG_LIMITS;

    const breakpoints = useMemo(() => {
        switch (variant) {
            case "furniture2":
                return {
                    1536: {slidesPerView: 4},
                    1280: {slidesPerView: 4},
                    1024: {slidesPerView: 3},
                    640: {slidesPerView: 2},
                    360: {slidesPerView: 1},
                    0: {slidesPerView: 1},
                };

            default:
                return {
                    1536: {slidesPerView: 3, spaceBetween: 30},
                    1280: {slidesPerView: 3, spaceBetween: 30},
                    1024: {slidesPerView: 2, spaceBetween: 30},
                    640: {slidesPerView: 2, spaceBetween: 20},
                    360: {slidesPerView: 1},
                    0: {slidesPerView: 1},
                };
        }
    }, [variant]);


    const {isInView, slideVariants, ref} = useSwiperAnimation();

    return (
        <div className={cn('heightFull relative mb-8 lg:mb-12', className)} ref={ref}>
            <SectionHeader
                sectionHeading={"The Blog"}
                sectionSubHeading="Provide you with useful knowledge about fashion trend."
                headingPosition={"center-xl"}
            />

            {error && <Alert message={error.message} />}

            <div
                className={cn('relative ', {
                    'border border-black/10 rounded bg-white overflow-hidden p-3 lg:p-5': variant == 'home4',
                })}
            >
                <Carousel
                    breakpoints={breakpoints}
                    prevActivateId={`prev${uniqueKey}`}
                    nextActivateId={`next${uniqueKey}`}
                >
                    {isLoading ? (
                        Array.from({length: limit}).map((_, idx) => (
                            <SwiperSlide key={`latestblog-${idx}`}>
                                <div className="p-2 w-85 h-full rounded bg-white">
                                    <ProductCardLoader uniqueKey={`latestblog-${idx}`}/>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <>
                            {dataBlog?.slice(0, limit)?.map((item) => (
                                <SwiperSlide key={`${uniqueKey}-key-${item.id}`}>
                                    <AnimatePresence mode="wait" key={`animate-${item.id}`}>
                                        <motion.div
                                            key={`${uniqueKey}-${item.id}`}
                                            variants={slideVariants}
                                            initial="hidden"
                                            animate={isInView ? 'visible' : 'hidden'}
                                            exit="exit"
                                            custom={item.id} // Pass index for staggered animation
                                        >
                                            <BlogCard
                                                key={item.id}
                                                blog={item}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </SwiperSlide>
                            ))}
                        </>
                    )}
                </Carousel>
            </div>

        </div>
    );
};

export default LatestblogCarousel;
