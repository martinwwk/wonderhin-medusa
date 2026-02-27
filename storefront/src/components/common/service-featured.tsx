'use client';

import FeaturedCard from '@/components/cards/featured-card';
import Carousel from '@/components/shared/carousel/carousel';
import {SwiperSlide} from '@/components/shared/carousel/slider';
import cn from "classnames";
import React, {useMemo} from 'react';
import {ServiceData} from "@/components/common/service-data";
import SectionHeader from "@/components/common/section-header";

interface Props {
    data: ServiceData[];
    className?: string;
    variant?: string;
    uniqueKey?: string;
    useHeading?: boolean;
    headingPosition?: 'left' | 'center-xl';
}


const ServiceFeature: React.FC<Props> = ({
                                             data,
                                             variant = 'default',
                                             uniqueKey = 'services',
                                             className = 'mb-15 lg:mb-22',
                                             useHeading = false,
                                             headingPosition = 'center-xl',
                                         }) => {
    
    const breakpoints = useMemo(() => {
        switch (variant) {
            case "home3":
                return {
                    1280: {slidesPerView: 4, spaceBetween: 30},
                    1024: {slidesPerView: 3, spaceBetween: 30},
                    640: {slidesPerView: 2, spaceBetween: 20},
                    360: {slidesPerView: 1, spaceBetween: 10},
                    0: {slidesPerView: 1},
                };
            
            default:
                return {
                    1280: {slidesPerView: 3, spaceBetween: 30},
                    1024: {slidesPerView: 3, spaceBetween: 30},
                    640: {slidesPerView: 3, spaceBetween: 20},
                    360: {slidesPerView: 2, spaceBetween: 10},
                    0: {slidesPerView: 1},
                };
        }
    }, [variant]);
    
    const carouselSlides = useMemo(() => {
        return data?.map((item) => (
            <SwiperSlide key={`featured-key-${item.id}`}>
                <FeaturedCard item={item} variant={variant}/>
            </SwiperSlide>
        ))
    }, [data, variant])
    return (
        <div className={cn(
            'group', {
                'py-10 lg:py-13 border-b border-border-base': variant === 'home3',
            },
            className
        )}
        >
            {useHeading && (
                <SectionHeader
                    sectionHeading={"Cinematic Sound at Home"}
                    sectionSubHeading="Unmatched design—superior performance and customer satisfaction in one."
                    headingPosition={headingPosition}
                />
            )}
            
            <Carousel
                breakpoints={breakpoints}
                prevActivateId={`prev${uniqueKey}`}
                nextActivateId={`next${uniqueKey}`}
            >
                {carouselSlides}
            </Carousel>
        </div>
    );
};

export default ServiceFeature;
