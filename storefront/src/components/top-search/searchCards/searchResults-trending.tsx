// SearchResults.tsx
import React from "react";
import { Tag } from "@/types/template";
import Heading from "@/components/shared/heading";
import { usePopularProductsQuery } from "@/lib/data/template-products";
import ProductsCarousel from "@/components/product/feeds/products-carousel";
import Link from "@/components/shared/link";
import { ROUTES } from "@/utils/routes";


interface Props {
    uniqueKey?: string;
    onClear: () => void;
}

const SearchResultsTrending: React.FC<Props> = ({ uniqueKey = 'search', onClear }) => {
    const { data: popularProducts, isLoading, error } = usePopularProductsQuery({
        limit: 5,
    });

    const trending = [
        {
            "id": 1,
            "name": "t-shirt",
            "slug": "t-shirt",
        },
        {
            "id": 2,
            "name": "cotton",
            "slug": "cotton",
        },
        {
            "id": 3,
            "name": "crop top",
            "slug": "crop",
        }
    ]
    return (
        <>
            <div className={"trending-search"}>
                <Heading variant={"titleMedium"} className={"mb-3.5"}>Trending Search</Heading>
                <div className={"flex flex-wrap gap-3"}>
                    {trending?.map((tag: Tag, idx: number) => (
                        <Link
                            onClick={onClear}
                            key={idx}
                            href={{
                                pathname: ROUTES.SEARCH,
                                query: { q: tag.slug },
                            }}
                            variant={"button-border"}
                            className="xs:py-2 xs:font-normal xs:border-gray-200">
                            {tag.name}
                        </Link>
                    ))}
                </div>
            </div>
            <div className={"popular-search"}>
                <Heading variant={"titleMedium"} className={"mb-3.5"}>Popular Products</Heading>
                <ProductsCarousel
                    products={popularProducts}
                    loading={isLoading}
                    error={error}
                    uniqueKey={`${uniqueKey}-product`}
                    variant={"searchResults"}
                />
            </div>
        </>
    );
};

export default SearchResultsTrending;
