'use client';

import cn from 'classnames';
import Link from '@/components/shared/link';
import useWindowSize from '@/utils/use-window-size';
import React, {useMemo} from "react";
import {AnimatePresence, motion} from "motion/react";
import {HeroItem} from "@/types/template";
import {Variants} from "framer-motion";
import {useUI} from "@/hooks/use-UI";

interface BannerProps {
  banner: HeroItem;
  className?: string;
  heroContentCard?: boolean;
  variant?: 'hero' | 'hero-2' | 'hero-3' | 'hero-4' | 'hero-5';
  index: number;
  currentSlide: number;
  heroMode?:'light' | 'dark';
  rounded?: string;
}


// Animation variants for fade-up-lg effect with staggered delays
const textVariants: Variants = {
    hidden: { opacity: 0, y: 100 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
            delay: index * 0.2, // Staggered delay: 0s for title, 0.2s for description, 0.4s for button
        },
    }),
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

export default function HeroSliderCard({
                                           banner,
                                           className,
                                           variant ,
                                           index,
                                           currentSlide,
                                           heroContentCard = true,
                                           heroMode,
                                           rounded
                                       }: BannerProps) {
    const {width} = useWindowSize();
    const {getImage}= useUI();
    const {title, description, image,btnText,btnUrl,videoUrl} = banner;
    const selectedImage = getImage(width!, image);

    const btnLink= useMemo(() => {
        switch (heroMode) {
            case 'light':
                return "button-white";

            default:
                return "button-black";
        }
    }, [heroMode]);

    const styleImage = useMemo(() => ({
        backgroundImage: `url('${selectedImage.url}')`,
        backgroundPosition: 'center center'
    }), [selectedImage]);

    return heroContentCard ? (
        <div
            className={cn(
                'w-full relative bg-no-repeat bg-cover bg-center flex items-center',
                {'min-h-[320px] md:min-h-[460px] lg:min-h-[650px] 2xl:min-h-[840px]': variant === 'hero' || variant === 'hero-5'},
                {'min-h-[320px] md:min-h-[460px] lg:min-h-[650px] 2xl:min-h-[765px]': variant === 'hero-2' || variant === 'hero-4' },
                {'justify-center':  variant === 'hero-5'},
                rounded,
                className
            )}
            style={videoUrl && videoUrl !== '' ? {} : styleImage}
        >
            <>
                {videoUrl && videoUrl !=='' &&
                    <video className="w-full h-full object-cover" src={videoUrl} autoPlay loop muted/>
                }
                
                <div
                    className={cn(
                        'absolute inset-0 mb-14 m-10 md:m-15  flex  items-end',
                        {
                            'xs:items-center xs:w-auto  xs:inset-auto text-center ': variant === 'hero-5' ,
                        }
                    )}
                >
                    <AnimatePresence mode="wait">
                        {currentSlide === index && (
                        <motion.div
                            key={index}
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={0} // Parent div has no delay
                        >
                            <motion.p
                                variants={textVariants}
                                className={cn(
                                    ' leading-7 font-medium  text-15px',{
                                        'text-brand-dark'  : heroMode === 'dark',
                                        'text-brand-light' : heroMode === 'light',
                                    }
                                )}
                                custom={0} // Title: 0s delay
                            >
                                {description}
                            </motion.p>
    
                            <motion.h2
                                variants={textVariants}
                                className={cn('text-4xl font-semibold tracking-tight leading-12 lg:leading-20', {
                                    'text-brand-dark'  : heroMode === 'dark',
                                    'text-brand-light' : heroMode === 'light',

                                    'xl:text-5xl 2xl:text-[70px]  mb-4  ': variant == 'hero' ,
                                    'xl:text-5xl 2xl:text-[60px]  mb-4  ': variant === 'hero-2' ||  variant === 'hero-4',
                                    'xl:text-5xl 2xl:text-[70px]  mb-8  ':  variant === 'hero-5',
                                })}
                                custom={1} // Description: 0.2s delay
                            >
                                {title}
                            </motion.h2>
    
                            {btnText && (
                                <motion.div
                                    variants={textVariants}
                                    custom={2} // Button: 0.4s delay
                                >
                                <Link
                                    variant={btnLink}
                                    href={btnUrl}
                                    className={cn("xs:inline-block md:min-w-[220px] md:py-3.5")}
                                >
                                    {btnText}
                                </Link>
                                </motion.div>
                            )}
    
                        </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </>
        </div>
    ) : (
        <Link href={btnUrl}>
            <div
                className={cn(
                    'w-full  bg-no-repeat bg-cover flex items-center',
                    {
                        'min-h-[850px]  ': variant === 'hero',
                    },
                    className
                )}
                style={{
                    backgroundImage: `url('${selectedImage.url}')`,
                    backgroundPosition:
                        variant === 'hero-3' ? 'left bottom -10px' : 'center center',
                }}
            ></div>
        </Link>
    );
}
