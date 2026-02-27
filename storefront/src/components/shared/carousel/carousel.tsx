"use client";
import React, { useMemo } from 'react';
import cn from 'classnames';
import { useRef, useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Autoplay, Grid, Navigation, Pagination } from '@/components/shared/carousel/slider';
import { Swiper as SwiperComponent } from '@/components/shared/carousel/slider'; // Rename component import
import { Swiper } from 'swiper'; // Import Swiper instance type
import { usePanel } from '@/hooks/use-panel';
import { BreakpointsType } from '@/types/template';

type CarouselPropsType = {
    className?: string;
    buttonGroupClassName?: string;
    prevActivateId?: string;
    nextActivateId?: string;
    prevButtonClassName?: string;
    nextButtonClassName?: string;
    buttonSize?: 'default' | 'small';
    centeredSlides?: boolean;
    loop?: boolean;
    slidesPerColumn?: number;
    breakpoints?: BreakpointsType;
    spaceBetween?: number;
    navigation?: boolean;
    pagination?: object | boolean;
    autoplay?: object | boolean;
    grid?: object;
    onSwiper?: (swiper: Swiper) => void; // Use Swiper type
    onSlideChange?: (swiper: Swiper) => void; // Use Swiper type
};

export default function Carousel({
                                     children,
                                     className = '',
                                     buttonGroupClassName = '',
                                     prevActivateId = '',
                                     nextActivateId = '',
                                     prevButtonClassName = 'start-3 xl:start-5',
                                     nextButtonClassName = 'end-3 xl:end-5',
                                     buttonSize = 'default',
                                     breakpoints,
                                     navigation = true,
                                     pagination = false,
                                     loop = false,
                                     spaceBetween = 10,
                                     grid,
                                     autoplay,
                                     onSlideChange,
                                     onSwiper,
                                     ...props
                                 }: React.PropsWithChildren<CarouselPropsType>) {
    const { selectedDirection } = usePanel();
    const dir = selectedDirection; // 'ltr' or 'rtl'
    const swiperRef = useRef<Swiper | null>(null); // Use Swiper type
    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const [swiperKey, setSwiperKey] = useState(Date.now());

    // Base classes for navigation buttons
    const baseButtonClasses = useMemo(
        () => ({
            prev: cn(
                'swiper-prev w-9 h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-base lg:text-lg xl:text-xl cursor-pointer flex items-center justify-center rounded-full bg-brand-light absolute transition duration-300 hover:text-brand-light focus:outline-none transform drop-shadow-navigation',
                { '3xl:text-2xl': buttonSize === 'default' },
                'hover:bg-brand-dark',
                prevButtonClassName
            ),
            next: cn(
                'swiper-next w-9 h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-base lg:text-lg xl:text-xl cursor-pointer flex items-center justify-center rounded-full bg-brand-light absolute transition duration-300 hover:text-brand-light focus:outline-none transform drop-shadow-navigation',
                { '3xl:text-2xl': buttonSize === 'default' },
                'hover:bg-brand-dark',
                nextButtonClassName
            ),
        }),
        [buttonSize, prevButtonClassName, nextButtonClassName]
    );

    // Clean up Swiper instance on unmount
    useEffect(() => {
        return () => {
            if (swiperRef.current) {
                swiperRef.current.destroy(true, true);
                swiperRef.current = null;
            }
        };
    }, []);

    // Force remount when direction changes
    useEffect(() => {
        setSwiperKey(Date.now());
    }, [dir]);

    // Setup and update navigation
    useEffect(() => {
        if (swiperRef.current && navigation) {
            if (swiperRef.current.navigation) {
                const prevEl = prevActivateId ? document.getElementById(prevActivateId) : prevRef.current;
                const nextEl = nextActivateId ? document.getElementById(nextActivateId) : nextRef.current;

                if (prevEl && nextEl) {
                    swiperRef.current.navigation.destroy();
                    swiperRef.current.navigation.init();
                    swiperRef.current.navigation.update();
                }
            }
        }
    }, [navigation, prevActivateId, nextActivateId]);

    return (
        <div
            className={`carouselWrapper relative ${className} ${
                pagination ? 'dotsCircle' : 'dotsCircleNone'
            }`}
            dir={dir}
        >
            <SwiperComponent
                key={swiperKey}
                dir={dir}
                className={`${dir === 'rtl' ? 'swiper-rtl' : ''}`}
                modules={[Navigation, Autoplay, Pagination, Grid]}
                autoplay={autoplay}
                breakpoints={breakpoints}
                spaceBetween={spaceBetween}
                pagination={
                    pagination
                        ? {
                            clickable: true,
                            bulletClass: `swiper-pagination-bullet`,
                            bulletActiveClass: `swiper-pagination-bullet-active bg-primary-500`,
                        }
                        : false
                }
                grid={grid}
                navigation={
                    navigation
                        ? {
                            prevEl: prevActivateId ? `#${prevActivateId}` : prevRef.current,
                            nextEl: nextActivateId ? `#${nextActivateId}` : nextRef.current,
                        }
                        : false
                }
                loop={loop}
                onSwiper={(swiperInstance) => {
                    swiperRef.current = swiperInstance;
                    onSwiper?.(swiperInstance);
                }}
                onSlideChange={onSlideChange}
                {...props}
            >
                {children}
            </SwiperComponent>

            {navigation && (
                <div
                    className={`swiper-button flex items-center box-content w-full absolute z-10 ${
                        buttonGroupClassName ? buttonGroupClassName : 'top-2/4'
                    }`}
                >
                    {prevActivateId ? (
                        <div className={baseButtonClasses.prev} id={prevActivateId}>
                            {dir === 'rtl' ? <IoIosArrowForward /> : <IoIosArrowBack />}
                        </div>
                    ) : (
                        <div ref={prevRef} className={baseButtonClasses.prev}>
                            {dir === 'rtl' ? <IoIosArrowForward /> : <IoIosArrowBack />}
                        </div>
                    )}

                    {nextActivateId ? (
                        <div className={baseButtonClasses.next} id={nextActivateId}>
                            {dir === 'rtl' ? <IoIosArrowBack /> : <IoIosArrowForward />}
                        </div>
                    ) : (
                        <div ref={nextRef} className={baseButtonClasses.next}>
                            {dir === 'rtl' ? <IoIosArrowBack /> : <IoIosArrowForward />}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}