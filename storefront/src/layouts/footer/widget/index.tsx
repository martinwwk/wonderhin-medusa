'use client';

import WidgetLink from '@/layouts/footer/widget/widget-link';
import WidgetAbout from '@/layouts/footer/widget/widget-about-us';
import Container from '@/components/shared/container';
import {footerSettings} from '@/data/footer-settings';
import React, {useMemo} from 'react';
import WidgetSubscription from "@/layouts/footer/widget/widget-subscription";
import {AnimatePresence, motion} from "motion/react";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import cn from "classnames";

interface WidgetsProps {
    variant?: "default" | "dark";
    container?:string;
    showWidgetServices?: boolean;
    showWidgetSubscription?: boolean;
    widgets: {
        id: number;
        widgetTitle: string;
        lists?: {
            id: number;
            path: string;
            title: string;
        }[]; // Fix: lists is an optional array
    }[];
}

const Widgets: React.FC<WidgetsProps> = ({
                                             widgets,
                                             showWidgetSubscription,
                                             variant = 'default',
                                             container
                                         }) => {
    const {social} = footerSettings;
    const {isInView, slideVariants, ref} = useSwiperAnimation();

    const containerVariant= useMemo(() => {
        switch (container) {
            case 'small':
                return "Small";
            default:
                return "Normal";
        }
    }, [container]);
    return (
        <Container variant={containerVariant}>
            <AnimatePresence mode="wait">
                <motion.div
                    ref={ref}
                    key={'big-deals'}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    exit="exit"
                    className={cn('grid grid-cols-2 md:grid-cols-6 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 pb-14 pt-5 md:pt-15')}
                >
                    <motion.div
                        variants={slideVariants}
                        className="col-span-full sm:col-span-1 md:col-span-4"
                        custom={0}
                    >
                        <WidgetAbout
                            social={social}
                            variant={variant}
                        />
                    </motion.div>
                    {showWidgetSubscription ? (
                        <>
                            {widgets?.slice(0, 2)?.map((widget) => (
                                <motion.div
                                    key={`footer-widget--key${widget.id}`}
                                    variants={slideVariants}
                                    className="col-span-1 md:col-span-2"
                                    custom={1}
                                >
                                    <WidgetLink
                                        data={widget}
                                        variant={variant}
                                    />
                                </motion.div>
                            ))}
                            <motion.div
                                variants={slideVariants}
                                custom={2}
                                className={"col-span-full sm:col-span-1 md:col-start-4 xl:col-start-auto md:col-span-4"}
                            >
                                <WidgetSubscription variant={variant}/>
                            </motion.div>
                        </>
                    ) : (
                        widgets?.slice(0, 4)?.map((widget) => (
                            <WidgetLink
                                key={`footer-widget--key${widget.id}`}
                                data={widget}
                                className="col-span-1 md:col-span-2"
                                variant={variant}
                            />
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </Container>

    );
};

export default Widgets;
