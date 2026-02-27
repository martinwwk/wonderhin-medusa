'use client';

import React, {FC} from 'react';
import cn from 'classnames';

import {ROUTES} from "@/utils/routes";
import {productPlaceholder} from "@/assets/placeholders";

import CategoryImage from "@/components/category/categoryCardUI/category-image";
import CategoryHeading from "@/components/category/categoryCardUI/category-heading";
import {SwiperSlide} from "@/components/shared/carousel/slider";
import Carousel from "@/components/shared/carousel/carousel";
import CategoryCardLoader from "@/components/shared/loaders/category-card-loader";
import {useCategories} from "@/hooks/use-categories";
import Alert from "@/components/shared/alert";
import {useLocale} from "@/lib/hooks/use-i18n";
import {translateCategoryName} from "@/lib/util/translate-category";

interface iProps {
    className?: string;
    variant?: 'base' | 'drop-shadow' | 'sub' ;
    uniqueKey?: string;
}

export const CategorySub: FC<iProps> = ({ className,variant="sub",uniqueKey="sub-category"}) => {
    const CATEGORY_LIMITS = 6;
    const {data : categories, isLoading, isError, error} = useCategories();
    const locale = useLocale();

    const breakpoints = {
        '1536': {
            slidesPerView: 6,
            spaceBetween: 30
        },
        '1280': {
            slidesPerView: 5,
            spaceBetween: 30
        },
        '1024': {
            slidesPerView: 4,
            spaceBetween: 20
        },
        '640': {
            slidesPerView: 3,
            spaceBetween: 20
        },
        '360': {
            slidesPerView: 2,
            spaceBetween: 10
        },
        '0': {
            slidesPerView: 1,
        },
    };

    if (isError)    return <Alert message={error.message} className={"mb-10"}/>;

    return (
            <div
                className={cn("mb-10 md:mb-14",className,)}
                >
                <Carousel
                    breakpoints={breakpoints}
                    prevActivateId={`prev${uniqueKey}`}
                    nextActivateId={`next${uniqueKey}`}
                >
                    {isLoading
                        ? Array.from({ length: CATEGORY_LIMITS }).map((_, idx) => {
                            return (
                                <SwiperSlide key={`category--key-${idx}`}>
                                    <div className={"w-53 h-full "}>
                                        <CategoryCardLoader uniqueKey={`category-card-${idx}`}/>
                                    </div>
                                </SwiperSlide>
                            );
                        })
                        : categories?.slice(0, CATEGORY_LIMITS).map((category) => {
                            const {id,name, image, slug} = category ?? {};
                            const translatedName = translateCategoryName(name, locale);
                            return (
                                <SwiperSlide key={`category--key-${category.id}`}>
                                    <article
                                        key={`categories--key-${id}`}
                                        className={cn(
                                            'relative ',
                                            className
                                        )}
                                    >
                                        <CategoryImage src={image?.original ?? productPlaceholder} alt={translatedName} href={`${ROUTES.CATEGORY}/${slug}`}/>
                                        <CategoryHeading href={`${ROUTES.CATEGORY}/${slug}`} name={translatedName} variant={variant}/>
                                    </article>
                                </SwiperSlide>
                            )
                    })}
                </Carousel>


            </div>


    );
};

