'use client';

import BannerCard from '@/components/banner/banner-card';
import {HeroItemImage} from "@/types/template";
import React, {useMemo} from "react";
import useWindowSize from "@/utils/use-window-size";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import Carousel from "@/components/shared/carousel/carousel";
import {SwiperSlide} from "@/components/shared/carousel/slider";
import cn from "classnames";
import {AnimatePresence, motion} from "motion/react";
import HighlightTextCard from "@/components/banner/highlight-text-card";

export interface BannerType {
    id: number;
    heading?: string;
    subheading: string;
    description?: string;
    btnText?: string;
    slug: string;
    videoUrl?: string;
    image?: HeroItemImage,
}

interface BannerProps {
    data: BannerType[];
    className?: string;
    CardClassName?: string;
    girdClassName?: string;
    morden?:boolean;
    rounded?: string;
    uniqueKey?: string;
    countdown?:boolean;
    variant?: 'default' |'home2Grid2' |  'home3Hero' | 'home3Grid' | 'home4Highlight';
}


const BannerGrid: React.FC<BannerProps> = ({
                                               data,
                                               girdClassName = 'grid-cols-3',
                                               CardClassName,
                                               className = 'mb-15 lg:mb-22',
                                               uniqueKey='hero-grid',
                                               variant = 'default',
                                               morden,
                                               rounded,
                                               countdown
                                           }) => {
    const {width} = useWindowSize();
    const { isInView, slideVariants, ref } = useSwiperAnimation();
    
    const breakpoints = useMemo(() => {
        switch (variant) {
            case "home4Highlight":
                return {
                    1024: {slidesPerView: 1},
                    640: {slidesPerView: 1},
                    360: {slidesPerView: 1},
                    0: {slidesPerView: 1},
                };
            
            default:
                return {
                    1024: {slidesPerView: 2},
                    640: {slidesPerView: 2},
                    360: {slidesPerView: 1},
                    0: {slidesPerView: 1},
                };
        }
    }, [variant]);

    // Memo of the entire Banner
    const memoizedBannerCard = useMemo(() => {
        return data?.map((item: BannerType, idx: number) => {
            const content = variant === 'home4Highlight' ? (
                <HighlightTextCard
                    banner={item}
                    variant={variant}
                    className={CardClassName}
                    countdown={countdown}
                />
            ) : (
                <BannerCard
                    banner={item}
                    variant={variant}
                    morden={morden}
                    rounded={rounded}
                />
            );

            return (
                <AnimatePresence mode="wait" key={item.id}>
                    <motion.div
                        key={`collection-${idx}`}
                        variants={slideVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        exit="exit"
                        custom={idx}
                    >
                        {content}
                    </motion.div>
                </AnimatePresence>
            );
        });
    }, [data, variant, morden, rounded, CardClassName, countdown, isInView, slideVariants]);

    return (
        <div className={className} ref={ref}> {/* Attach ref to the container */}
            {width! < 1024 ? (
                <Carousel
                    breakpoints={breakpoints}
                    prevActivateId={`prev${uniqueKey}`}
                    nextActivateId={`next${uniqueKey}`}
                >
                    {data?.map((item: BannerType) => (
                        <SwiperSlide
                            key={`collection-key-${item.id}`}
                        >
                            <BannerCard
                                key={item.id}
                                banner={item}
                                variant={variant}
                            />
                        </SwiperSlide>
                    ))}
                </Carousel>
            ) : (
                <div className={cn(`grid  ${girdClassName}`,{
                        "gap-7.5" : variant === "default" || variant ==='home2Grid2',
                        "gap-5"   :   variant ==='home3Grid' || variant ==='home4Highlight',
                        "gap-2.5" : variant === "home3Hero"
                    }
                )}>
                    {memoizedBannerCard}
                </div>
            )}

        </div>
    );
};

export default BannerGrid;
