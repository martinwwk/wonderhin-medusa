// SearchResults.tsx
import React from "react";
import {Product, Tag} from "@/types/template";
import Heading from "@/components/shared/heading";
import ProductsCarousel from "@/components/product/feeds/products-carousel";
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";
import {Frown} from "lucide-react";
import Text from "@/components/shared/text";


interface Props {
    searchResults?: Product[];
    queryText: string;
    uniqueKey?: string;
    onClear: () => void;
}

const SearchResultsSuggestions: React.FC<Props> = ({searchResults,queryText, uniqueKey = 'search-result',onClear}) => {
    
    const trending = [
        {
            "id": 1,
            "name": "t-shirt",
            "slug": "t-shirt",
        },
        {
            "id": 2,
            "name": "neck",
            "slug": "neck",
        },
        {
            "id": 3,
            "name": "crop top",
            "slug": "crop",
        }
    ]
    return (
        <>
            {!searchResults || searchResults.length === 0 ? (
                <div className="flex flex-col items-center gap-3.5 py-16  text-center">
                    <Frown/>
                    <Text>{`Nothing matches your search “${queryText}”`}</Text>
                </div>
            ) : (
                <>
                    <div className={"trending-search"}>
                        <Heading variant={"titleMedium"} className={"mb-3.5 xs:text-body"}>
                            {`Search for “${queryText}”`}
                        </Heading>
                        <Heading variant={"titleMedium"} className={"mb-3"}>Suggestions</Heading>
                        <div className={"flex gap-3"}>
                            {trending?.map((tag: Tag, idx: number) => (
                                <Link
                                    key={idx}
                                    onClick={onClear}
                                    href={{
                                        pathname: ROUTES.SEARCH,
                                        query: { q: tag.slug },
                                    }}
                                >
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <ProductsCarousel
                        products={searchResults}
                        uniqueKey={`${uniqueKey}-product`}
                        variant={"searchResults"}
                    />
                    <div className={"view-all flex justify-center mt-5 w-full"}>
                        <Link
                            onClick={onClear}
                            className={"min-w-[220px]"}
                            variant={"button-black"}
                            href={{
                                pathname: ROUTES.SEARCH,
                                query: { q: queryText },
                            }}
                        >
                            View all Results
                        </Link>
                    </div>
                </>
            )}
        </>
    );
};

export default SearchResultsSuggestions;
