'use client';
import TestimonialCard from '@/components/testimonial/testimonialCard/testimonial-card';
import Carousel from '@/components/shared/carousel/carousel';
import {SwiperSlide} from '@/components/shared/carousel/slider';
import React, {useMemo} from "react";
import {AnimatePresence, motion} from "motion/react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import SectionHeader from "@/components/common/section-header";
import {PropsCustomer} from "@/components/testimonial/data";


interface Props {
    data: PropsCustomer[];
    className?: string;
    sectionHeading?: string;
    uniqueKey?: string;
    useImage?: boolean;
    variant?: string;
}

const Testimonial: React.FC<Props> = ({
                                         data,
                                          sectionHeading='Customer Say!',
                                          className = 'mb-15 lg:mb-22',
                                          uniqueKey = 'testimonial',
                                          useImage  = true,
                                          variant   = 'default',
                                      }) => {

    const { isInView, slideVariants, ref } = useSwiperAnimation();

    const breakpoints = useMemo(() => {
        const configs = {
            testimonial30: {
                1280: { slidesPerView: 3,spaceBetween: 30 },
                1024: { slidesPerView: 2,spaceBetween: 30 },
                640: { slidesPerView: 2,spaceBetween: 20 },
                360: { slidesPerView: 1,spaceBetween: 10 },
                0: { slidesPerView: 1 },
            },
            testimonial20: {
                1280: { slidesPerView: 3,spaceBetween: 20 },
                1024: { slidesPerView: 2,spaceBetween: 20 },
                640: { slidesPerView: 2,spaceBetween: 20 },
                360: { slidesPerView: 1,spaceBetween: 10 },
                0: { slidesPerView: 1 },
            },
            default: {
                1280: { slidesPerView: 2,spaceBetween: 30 },
                1024: { slidesPerView: 2,spaceBetween: 30 },
                640: { slidesPerView: 2,spaceBetween: 20 },
                360: { slidesPerView: 1,spaceBetween: 10 },
                0: { slidesPerView: 1 },
            },
        };

        if (uniqueKey === 'testimonial-20' ) {
            return configs.testimonial20;
        }

        if (uniqueKey === 'testimonial-30' ) {
            return configs.testimonial30;
        }

        return configs.default;

    }, [uniqueKey]);

    const testimonialSlides = useMemo(() => {
        return data?.map((item:PropsCustomer) => (

            <SwiperSlide key={`collection-key-${item.id}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`collection-${item.id}`}
                        variants={slideVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        exit="exit"
                        custom={item.id} // Pass index for staggered animation
                    >
                        <TestimonialCard key={item.id} collection={item} useImage={useImage} variant={variant}/>
                    </motion.div>
                </AnimatePresence>
            </SwiperSlide>

        ))
    },[data, isInView, slideVariants, useImage, variant])

    return (
        <div className={className} ref={ref}>
            {sectionHeading && (
                <SectionHeader
                    sectionHeading={sectionHeading}
                    sectionSubHeading="Customers love our products and we always strive to please them all."
                    headingPosition={"center-xl"}
                />
            )}

            <Carousel
                breakpoints={breakpoints}
                prevActivateId={`prev${uniqueKey}`}
                nextActivateId={`next${uniqueKey}`}
            >
                {testimonialSlides}
            </Carousel>
        </div>
    );
};

export default Testimonial;
