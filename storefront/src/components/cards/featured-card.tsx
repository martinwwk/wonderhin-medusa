import Heading from '@/components/shared/heading';
import cn from 'classnames';
import Text from '@/components/shared/text';

import React, {useMemo} from 'react';
import {AnimatePresence, motion} from "motion/react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import {ServiceData} from "@/components/common/service-data";


interface Props {
    className?: string;
    item: ServiceData;
    variant?: string;
}

const FeaturedCard: React.FC<Props> = ({item, className='', variant}) => {
    const {id, icon: Icon, title, description} = item;
    const {isInView, slideVariants, ref} = useSwiperAnimation();
    const imgSize = useMemo(() => {
        switch (variant) {
            case 'home3':
                return {width:24, height:24};
            default:
                return {width:28, height:28};

        }
    }, [variant]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                ref={ref}
                key={`featuredCard-${id}`}
                variants={slideVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                exit="exit"
                custom={id} // Pass index for staggered animation
                className={cn({
                        'flex flex-col gap-2.5 lg:px-5 items-center justify-center text-center': variant === 'default',
                        'flex justify-center gap-5 items-center': variant === 'home3',
                    },
                    className,
                )}
            >
                <div className={cn("flex-shrink-0  text-brand-dark",{
                    'flex  flex-auto items-center justify-center max-w-15 h-15 border border-border-two rounded-full ': variant === 'home3',
                })}>
                    <Icon width={imgSize.width} height={imgSize.height}/>
                </div>
                
                {variant == 'home4' || variant == 'home8' ? (
                    <div className="ps-4">
                        <Heading variant="base" className="sm:text-sm ">
                            {title}
                        </Heading>
                        <Text className={'sm:text-sm lg:leading-[24px]'}>
                            {description}
                        </Text>
                    </div>
                
                ) : (
                    <div className={cn("flex flex-col",{
                        'gap-2': variant === 'default',
                        'gap-1': variant === 'home3',
                    })}>
                        <Heading
                            customDelay={0} // Title: 0s delay
                            variant="base"
                            className="sm:text-base"
                        >
                            {title}
                        </Heading>
                        <Text
                            customDelay={1} // Subheading: 0.2s delay
                            variant="body"
                        >
                            {description}
                        </Text>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default FeaturedCard;
