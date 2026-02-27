'use client';

import useWindowSize from '@/utils/use-window-size';
import Carousel from '@/components/shared/carousel/carousel';
import {SwiperSlide} from '@/components/shared/carousel/slider';
import React, {useMemo} from "react";
import {AnimatePresence, motion} from 'motion/react';
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import cn from "classnames";
import HighlightCard from "@/components/collection/collectionCard/highlight-card";
import SectionHeader from "@/components/common/section-header";

export interface MultiType {
    id:number;
    icon?:string;
    heading?: string;
    subheading : string;
    description?: string;
    btnText?: string;
    slug: string;
    image?: string;
    videoUrl?:string;
}

interface Props {
    className?: string;
    headingPosition?: 'left' | 'center-xl';
    collections: MultiType[];
    girdClassName?: string;
    uniqueKey?:string;
    variant?: 'default' | 'home5';
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
        slidesPerView: 1,
    },
};
const CollectionHighlights: React.FC<Props> = ({   collections,
                                             className = 'mb-15 lg:mb-22 ',
                                             headingPosition = 'center-xl',
                                             girdClassName = 'grid-cols-3',
                                             uniqueKey='collection-highlights',
                                             variant="default"
                                         }) => {
    const {width} = useWindowSize();
    const { isInView, slideVariants, ref } = useSwiperAnimation();

    const sectionHeaderVar = useMemo(() => {
        switch (variant) {
            case 'home5':
                return  <SectionHeader
                    sectionHeading="Top Collections"
                    headingPosition={headingPosition}
                    sectionSubHeading="Express your style with our standout collection—fashion meets sophistication."
                />

            default :
                return  <SectionHeader
                    sectionHeading="Category Highlights"
                    headingPosition={headingPosition}
                />
        }
    }, [headingPosition, variant]);

    return (
        <div className={className} ref={ref}> {/* Attach ref to the container */}
            {sectionHeaderVar}

            {width! < 1024 ? (
                <Carousel
                    breakpoints={breakpoints}
                    prevActivateId={`prev${uniqueKey}`}
                    nextActivateId={`next${uniqueKey}`}
                >
                    {collections?.map((item: MultiType) => (
                        <SwiperSlide
                            key={`collection-key-${item.id}`}
                        >
                            <HighlightCard
                                key={item.id}
                                collection={item}
                                variant={variant}
                            />
                        </SwiperSlide>
                    ))}
                </Carousel>
            ) : (
                <div className={cn(`grid  ${girdClassName}`,{
                    "gap-5" : variant === "default" ,
                    "gap-5 lg:gap-7.5" : variant === "home5" ,
                    }
                )}>
                    {collections?.map((item: MultiType,idx) => (
                        <AnimatePresence mode="wait" key={item.id}>
                            <motion.div
                                key={`collection-${idx}`}
                                variants={slideVariants}
                                initial="hidden"
                                animate={isInView ? 'visible' : 'hidden'}
                                exit="exit"
                                custom={idx} // Pass index for staggered animation
                            >
                                <HighlightCard
                                    collection={item}
                                    variant={variant}
                                />

                            </motion.div>
                        </AnimatePresence>
                    ))}
                </div>
            )}
        
        </div>
    );
};

export default CollectionHighlights;
