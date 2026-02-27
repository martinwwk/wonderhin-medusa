'use client';
import React, {CSSProperties} from 'react';
import cn from 'classnames';
import {motion} from "motion/react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";

interface Props {
    variant?: Variant;
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    html?: string;
    useAnimation?: boolean;
    customDelay?: number; // Custom delay index for staggered animation
}

type Variant = 'body' | 'medium' | 'small';



const Text: React.FC<Props> = ({
                                   style,
                                   className,
                                   variant = 'body',
                                   children,
                                   html,
                                   customDelay = 0,
                                   useAnimation = false
                               }) => {
    const {isInView, slideVariants, ref} = useSwiperAnimation();
    const htmlContentProps = html ? {dangerouslySetInnerHTML: {__html: html},} : {};
    const animationProps = useAnimation
        ? (() => {
            return {
                ref,
                variants: slideVariants,
                initial: 'hidden',
                animate: isInView ? 'visible' : 'hidden',
                exit: 'exit',
                custom: customDelay,
            };
        })()
        : {};
    
    return (
        <motion.p
            {...animationProps}
            className={cn(
                {
                    'text-15px lg:leading-6': variant === 'body', // default body text
                    '': variant === 'medium',
                    'text-sm lg:leading-[1.85em]': variant === 'small',
                },
                className
            )}
            style={style}
            {...htmlContentProps}
        >
            {children}
        </motion.p>
    );
};

export default Text;
