'use client';

import React from "react";
import {AnimatePresence, motion} from "motion/react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import cn from "classnames";
import BigDealCountDown from "@/components/collection/collectionCard/big-deal-countdown";
import BigDealCard from "@/components/collection/collectionCard/big-deal-card";

interface Props {
    className?: string;
}

const outfit = [
    {
        viewMore: "View Products",
        image: '/assets/images/collection/home1/main-images-outfit-1-min.jpg',
        product: [
            {
                "id": "product16",
            },
            {
                "id": "product20",
            },
        ]
    },
    {
        viewMore: "View Products",
        image: '/assets/images/collection/home1/main-images-outfit-3-min.jpg',
        product: [
            {
                "id": "product2",
            },
            {
                "id": "product3",
            },
        
        ]
    }
]
const BigDeals: React.FC<Props> = ({
                                       className = 'mb-15 lg:mb-22',
                                   }) => {
    
    const imageOutfit2 = '/assets/images/collection/home1/main-images-outfit-2-min.jpg';
    const {isInView, slideVariants, ref} = useSwiperAnimation();
    
    return (
        <AnimatePresence mode="wait">
            <motion.div
                ref={ref}
                key={'big-deals'}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                exit="exit"
                className={cn('grid grid-cols-1 md:grid-cols-3  gap-5 lg:gap-7.5', className)}
            >
                <motion.div
                    variants={slideVariants}
                    className={"h-full"}
                    custom={0}
                >
                    <BigDealCard collection={outfit[0]}/>
                </motion.div>
                
                <motion.div
                    variants={slideVariants}
                    className={"h-full"}
                    custom={1}
                >
                    <BigDealCountDown image={imageOutfit2}/>
                </motion.div>
                
                <motion.div
                    variants={slideVariants}
                    className={"h-full"}
                    custom={2}
                >
                    <BigDealCard collection={outfit[1]}/>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BigDeals;
