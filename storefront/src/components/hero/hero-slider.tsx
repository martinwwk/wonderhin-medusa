'use client';

import HeroSliderCard from '@/components/hero/hero-slider-card';
import Carousel from '@/components/shared/carousel/carousel';
import {SwiperSlide} from '@/components/shared/carousel/slider';
import React, {useCallback, useMemo, useState} from "react";
import {HeroItem} from "@/types/template";
import {Swiper} from "swiper";

interface Props {
    heroBanner: HeroItem[];
    className?: string;
    variant?: 'hero' | 'hero-2' | 'hero-3' | 'hero-4' | 'hero-5';
    contentClassName?: string;
    showHeroContent?: boolean;
    heroMode?:'light' | 'dark';
    uniqueKey?: string;
    roundedClass?: string;
}

const HeroSlider: React.FC<Props> = ({
          heroBanner = [],
          variant='hero',
          className = 'mb-15 lg:mb-22',
          contentClassName = '',
          showHeroContent = true,
          uniqueKey='hero-slider',
          heroMode='light',
          roundedClass='rounded-xl'
      }) => {

    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const dotsCarousel= useMemo(() => {
        switch (heroMode) {
            case 'light':
                return "dotsCircleWhite";

            default:
                return "dotsCircleBlack";
        }
    }, [heroMode]);

    const  memoizedHeroBanner = useMemo(() => {
        return heroBanner?.map((banner: HeroItem,index:number) => (
            <SwiperSlide key={`hero-slider${index}`}>
                <HeroSliderCard
                    banner={banner}
                    variant={variant}
                    className={contentClassName}
                    heroContentCard={showHeroContent}
                    index={index}
                    currentSlide={currentSlide}
                    heroMode={heroMode}
                    rounded={roundedClass}
                />
            </SwiperSlide>
        ))
    },[contentClassName, currentSlide, heroBanner, heroMode, roundedClass, showHeroContent, variant])

    const onSlideChange = useCallback((swiper: Swiper) => {
        setCurrentSlide(swiper.activeIndex);
    }, []);

    // Memoize pagination config
    const paginationConfig = useMemo(
        () => ({
            clickable: true,
        }),
        []
    );
    return (
        <div className={`${className}`}>
            <Carousel
                pagination={paginationConfig}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={true}
                prevActivateId={`prev${uniqueKey}`}
                nextActivateId={`next${uniqueKey}`}
                className={dotsCarousel}
                onSlideChange={onSlideChange}
            >
                {memoizedHeroBanner}
            </Carousel>
        </div>
    );
};

export default HeroSlider;
