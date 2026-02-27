'use client';
import React, {useMemo} from "react";
import Marquee from "react-fast-marquee";
import {collectionPlaceholder} from "@/assets/placeholders";
import Image from "@/components/shared/image";
import cn from "classnames";
import {AnimatePresence, motion} from "motion/react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import {colorMap} from "@/data/color-settings";
import {usePanel} from "@/hooks/use-panel";

const DiamondIcon = React.lazy(() => import('@/components/icons/diamond-icon'));

type Variant =
    | 'Large'
    | 'Medium'
    | 'Normal'
    | 'Small'
    | 'Primary';

interface MarqueeType {
    title?: string;
    image?: string;
    useIcon: boolean;
}

interface Props {
    className?: string;
    data?: MarqueeType[];
    variant?: Variant;
}


const CollectionMarquee: React.FC<Props> = ({
                                                className = 'mb-15 lg:mb-22',
                                                data,
                                                variant = 'Large'
                                            }) => {
    const {selectedColor} = usePanel();
    const {isInView, slideVariants, ref} = useSwiperAnimation();
    const imgSize = useMemo(() => {
        switch (variant) {
            case 'Small':
                return {width: 12, height: 12};
            case 'Normal':
                return {width: 21, height: 20};
            default:
                return {width: 70, height: 70};

        }
    }, [variant]);
    return (
        <div className={cn("py-4",
            {"md:py-6 border-t border-b border-t-black/10 border-b-black/10 ": variant == "Large"},
            {"md:py-5 min-h-[60px]": variant == "Small"},
            {[`md:py-5 ${colorMap[selectedColor].bg}`]: variant == "Primary"},
            className
        )} ref={ref}>
            <Marquee speed={80} pauseOnHover={true} className={"direction-ltr"}>
                <div className=" flex items-center gap-15  w-full overflow-hidden">
                    {data?.map((item, id) => (
                        <AnimatePresence mode="wait" key={`collection-marquee-${id}`}>
                            <motion.div
                                key={`collection-marquee-${id}`}
                                variants={slideVariants}
                                initial="hidden"
                                animate={isInView ? 'visible' : 'hidden'}
                                custom={id} // Pass index for staggered animation
                                className="flex items-center gap-5 lg:gap-15 "
                            >
                                <p className={cn(" font-semibold whitespace-nowrap",
                                    {"text-xl lg:text-2xl text-brand-dark ": variant == "Large"},
                                    {"text-13px uppercase text-brand-dark": variant  == "Small"},
                                    {"text-15px  text-brand-dark": variant  == "Normal"},
                                    {"text-13px uppercase text-brand-light": variant == "Primary"}
                                )}>
                                    {item.title}
                                </p>

                                {item.useIcon ? (
                                    <DiamondIcon className={cn(
                                        {"text-brand-light": variant == "Primary"}
                                    )}
                                    />
                                ) : (
                                    <Image
                                        src={item.image ?? collectionPlaceholder}
                                        alt={item.title || ('card-thumbnail')}
                                        width={imgSize.width}
                                        height={imgSize.height}
                                        rootClassName={"rounded-full overflow-hidden"}
                                    />
                                )}


                            </motion.div>
                        </AnimatePresence>
                    ))}
                </div>
            </Marquee>
        </div>
    );
};

export default CollectionMarquee;
