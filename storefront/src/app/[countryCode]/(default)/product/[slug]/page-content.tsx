'use client';
import React from "react";
import {Element} from 'react-scroll';

import ProductDetailsTab from "@/components/product/productDetails/description-tab";
import RelatedProductSlider from "@/components/product/feeds/related-product-feed";
import ProductGallery from "@/components/product/productDetails/product-gallery";
import ProductView from "@/components/product/productDetails/product-view";

import useProductVariations from "@/hooks/use-product-variations";
import ProductPDPLoader from "@/components/shared/loaders/product-pdp-loader";
import {useIsMounted} from "@/utils/use-is-mounted";
import {useProductQuery} from "@/hooks/use-product-query";
import Alert from "@/components/shared/alert";

interface PageContentProps {
    slug: string;
    regionId: string;
}

export default function PageContent({ slug, regionId }: PageContentProps) {
    const mounted = useIsMounted();
    const {data, isLoading, isError, error} = useProductQuery(slug, regionId);

    // Initialize attributes dynamically based on product variations
    const { initialAttributes} = useProductVariations(data);
    const [attributes, setAttributes] = React.useState<{ [key: string]: string }>(initialAttributes);

    // Render loader if still loading
    if (!mounted || isLoading) return <ProductPDPLoader />;
    if (isError)    return <Alert message={error.message}/>;
    return (
        <Element name="category" className="products-category">
            <div className="grid-cols-12 lg:grid gap-7 2xl:gap-10 mb-8 lg:mb-20">
                <ProductGallery
                    data={data}
                    className={"col-span-6"}
                    attributes={attributes}
                />
                <ProductView
                    data={data}
                    className={"col-span-5"}
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            </div>
            <ProductDetailsTab/>
            <RelatedProductSlider/>

        </Element>
    );
}
