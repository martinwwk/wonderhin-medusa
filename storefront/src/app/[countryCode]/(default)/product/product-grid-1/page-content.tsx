'use client';
import React from "react";
import {Element} from 'react-scroll';
import {useParams} from "next/navigation";

import DescriptionAccordion from "@/components/product/productDetails/description-accordion";
import RelatedProductSlider from "@/components/product/feeds/related-product-feed";
import {useProductQuery} from "@/hooks/use-product-query";
import ProductView from "@/components/product/productDetails/product-view";
import ProductPDPLoader from "@/components/shared/loaders/product-pdp-loader";
import ProductImageGrid from "@/components/product/productDetails/product-image-grid";
import ProductReview from "@/components/product/productDetails/product-review";
import {Variation} from "@/types/template";
import {variationsRadio} from "@/components/product/productView/data-variations/variations-radius";
import useProductVariations from "@/hooks/use-product-variations";
import Alert from "@/components/shared/alert";

export default function PageContent() {
    const pathname = useParams();
    const {slug} = pathname;
    const {data, isLoading, isError, error} = useProductQuery(slug as string);

    // Initialize attributes dynamically based on product variations
    const { initialAttributes} = useProductVariations(data);
    const [attributes, setAttributes] = React.useState<{ [key: string]: string }>(initialAttributes);

    // Render loader if still loading
    if (isLoading) return  <ProductPDPLoader />;
    if (isError)    return <Alert message={error.message}/>;
    
    return (
        <Element name="category" className="products-category">
            <div className="flex flex-col xl:flex-row gap-7 2xl:gap-10 mb-8 lg:mb-20 ">
                <ProductImageGrid  variant={"default"} data={data} className={"w-full  xl:w-[55%] "}/>
                <div className="xl:sticky xl:z-10  lg:block h-full shrink-0 top-20 w-full  xl:w-[40%] ">
                    <ProductView
                        data={data}
                        attributes={attributes}
                        setAttributes={setAttributes}
                        useVariations={variationsRadio.variations as Variation[]}/>
                    <DescriptionAccordion/>
                </div>
            </div>
            
            <ProductReview className={"mb-8 lg:mb-20"} useHeading={true}/>
            <RelatedProductSlider/>
        </Element>
    );
}
