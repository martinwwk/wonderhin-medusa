'use client';
import React, { FC } from 'react';
import cn from 'classnames';
import { GrNext, GrPrevious } from "react-icons/gr";
import Pagination from "@/components/shared/pagination";
import { ROUTES } from "@/utils/routes";
import { productPlaceholder } from "@/assets/placeholders";
import { Category } from "@/types/template";
import { usePagination } from "@/hooks/use-pagination";
import CategoryImage from "@/components/category/categoryCardUI/category-image";
import CategoryHeading from "@/components/category/categoryCardUI/category-heading";
import { SwiperSlide } from "@/components/shared/carousel/slider";
import CategoryCardLoader from "@/components/shared/loaders/category-card-loader";
import { useLocale } from "@/lib/hooks/use-i18n";
import { translateCategoryName } from "@/lib/util/translate-category";

interface blogGridProps {
    categories?: Category[];
    className?: string;
    countPerPage?: number;
    variant?: 'base' | 'drop-shadow';
    isLoading?: boolean;
}

export const CategoryListing: FC<blogGridProps> = ({ categories, className, countPerPage = 8, variant = "base", isLoading }) => {
    const locale = useLocale();

    const { currentPage, filterData: categoriesData, updatePage } = usePagination({
        data: categories,
        countPerPage: countPerPage,
    });

    return (
        <>
            <div
                className={cn(
                    className,
                    'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-7.5'
                )}
            >
                {isLoading
                    ? Array.from({ length: countPerPage }).map((_, idx) => {
                        return (
                            <SwiperSlide key={`category--key-${idx}`}>
                                <CategoryCardLoader uniqueKey={`category-card-${idx}`} />
                            </SwiperSlide>
                        );
                    })
                    : categoriesData?.map((category: Category) => {
                        const { id, name, image, slug } = category ?? {};
                        const translatedName = translateCategoryName(name, locale);
                        return (
                            <article
                                key={`categories--key-${id}`}
                                className={cn(
                                    'relative ', {
                                    'collection-item__media': variant === 'drop-shadow',
                                    'flex justify-center': variant === 'base'
                                },
                                    className
                                )}
                            >
                                <CategoryImage src={image?.original ?? productPlaceholder} alt={translatedName} href={`${ROUTES.CATEGORY}/${slug}`} />
                                <CategoryHeading href={`${ROUTES.CATEGORY}/${slug}`} name={translatedName} variant={variant} />
                            </article>
                        );
                    })
                }


            </div>
            <Pagination
                current={currentPage}
                onChange={updatePage}
                pageSize={countPerPage}
                total={categories?.length}
                prevIcon={<GrPrevious size={14} className={`m-auto my-1.5 rtl:rotate-180`} />}
                nextIcon={<GrNext size={14} className={`m-auto my-1.5 rtl:rotate-180`} />}
                className="blog-pagination rounded xs:mt-2"
            />
        </>
    );
};

