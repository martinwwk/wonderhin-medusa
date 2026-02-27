"use client";
import React, { CSSProperties, RefObject } from 'react';
import cn from 'classnames';
import { motion, MotionProps, Variants } from "framer-motion";
import { useSwiperAnimation } from "@/hooks/use-swiper-animation";

interface Props {
    variant?: Variant;
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    html?: string;
    customDelay?: number;
    useAnimation?: boolean;
}

type Variant =
    | 'mediumHeading'
    | 'heading'
    | 'base'
    | 'title'
    | 'titleMedium'
    | 'titleLarge'
    | 'pageHeading'
    | 'subHeading'
    | 'checkoutHeading';

// Define a type for the HTML heading elements with MotionProps
type HeadingComponent = React.ComponentType<
    MotionProps & React.HTMLAttributes<HTMLHeadingElement> & { ref?: RefObject<HTMLHeadingElement> }
>;

// Define the expected return type of useSwiperAnimation
interface SwiperAnimation {
    isInView: boolean;
    slideVariants: Variants;
    ref: RefObject<HTMLHeadingElement>;
}

const Heading: React.FC<Props> = ({
                                      style,
                                      className,
                                      variant = 'base',
                                      children,
                                      html,
                                      customDelay = 0,
                                      useAnimation = false
                                  }) => {
    const componentsMap: {
        [P in Variant]: HeadingComponent;
    } = {
        base: motion.h3,
        heading: motion.h2,
        mediumHeading: motion.h3,
        title: motion.h2,
        titleMedium: motion.h3,
        titleLarge: motion.h2,
        pageHeading: motion.h1,
        subHeading: motion.h2,
        checkoutHeading: motion.h3,
    };

    const Component: HeadingComponent = componentsMap[variant];

    const htmlContentProps = html ? { dangerouslySetInnerHTML: { __html: html } } : {};
    const { isInView, slideVariants, ref } = useSwiperAnimation() as SwiperAnimation;
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
        <Component
            {...animationProps}
            className={cn(
                'font-semibold',
                {
                    'text-sm text-brand-dark': variant === 'base',
                    'text-base text-brand-dark': variant === 'title',
                    'font-bold text-brand-dark text-lg': variant === 'titleMedium',
                    'text-3xl lg:text-4xl lg:leading-10 tracking-tighter': variant === 'titleLarge',
                    'text-brand-dark text-[17px] lg:leading-7': variant === 'mediumHeading',
                    'text-lg lg:text-xl xl:text-[22px] xl:leading-8 text-brand-dark font-bold': variant === 'heading',
                    'text-lg lg:text-xl xl:leading-8 text-brand-dark': variant === 'checkoutHeading',
                },
                className
            )}
            style={style}
            {...htmlContentProps}
        >
            {children}
        </Component>
    );
};

export default Heading;
