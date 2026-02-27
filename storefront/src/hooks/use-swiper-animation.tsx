'use client';
import {Variants} from 'framer-motion';
import {useInView} from "motion/react";
import React, {useRef} from "react";

interface SwiperAnimationReturn {
    slideVariants: Variants;
    isInView: boolean; // Explicitly type as boolean
    ref: React.RefObject<HTMLDivElement | null>; // Allow null in the type
}

export const useSwiperAnimation = (): SwiperAnimationReturn => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 }); // Monitor visibility
    
    // Animation variants for fade-up-lg effect
    const slideVariants : Variants= {
        hidden: { opacity: 0 },
        visible: (index: number) => ({
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: 'easeOut',
                delay: index * 0.1, // Staggered delay for visible slides
            },
        }),
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: 'easeIn',
            },
        },
    };

    return {
        slideVariants,
        isInView,
        ref
    };
};