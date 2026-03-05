// SearchResults-trending.tsx
import React from "react";
import Heading from "@/components/shared/heading";
import ProductsCarousel from "@/components/product/feeds/products-carousel";
import Link from "@/components/shared/link";
import { ROUTES } from "@/utils/routes";
import { useCategories } from "@/hooks/use-categories";
import { useProductsQuery } from "@/hooks/use-all-products";
import { useRegion } from "@/hooks/use-region";
import { useLocale } from "@/lib/hooks/use-i18n";
import { translateCategoryName } from "@/lib/util/translate-category";
import { useI18n } from "@lib/hooks/use-i18n";


interface Props {
    uniqueKey?: string;
    onClear: () => void;
}

const SearchResultsTrending: React.FC<Props> = ({ uniqueKey = 'search', onClear }) => {
    const { data: region } = useRegion();
    const regionId = region?.id;
    const locale = useLocale();
    const { t } = useI18n();

    // Fetch top-level categories for the pill buttons
    const { data: categories, isLoading: catLoading } = useCategories();

    // Fetch popular products (newest) for the carousel
    const { data: popularProducts, isLoading, error } = useProductsQuery({
        limit: 5,
        sort_by: "new-arrival",
        regionId,
    });

    return (
        <>
            <div className="trending-search">
                <Heading variant="titleMedium" className="mb-3.5">{t('trendingSearch') ?? 'Trending Search'}</Heading>
                <div className="flex flex-wrap gap-3">
                    {!catLoading && categories?.map((cat) => (
                        <Link
                            onClick={onClear}
                            key={cat.id}
                            href={`${ROUTES.SEARCH}?q=${encodeURIComponent(cat.name)}`}
                            variant="button-border"
                            className="xs:py-2 xs:font-normal xs:border-gray-200">
                            {translateCategoryName(cat.name, locale)}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="popular-search">
                <Heading variant="titleMedium" className="mb-3.5">{t('popularProducts') ?? 'Popular Products'}</Heading>
                <ProductsCarousel
                    products={popularProducts}
                    loading={isLoading}
                    error={error}
                    uniqueKey={`${uniqueKey}-product`}
                    variant="searchResults"
                />
            </div>
        </>
    );
};

export default SearchResultsTrending;

