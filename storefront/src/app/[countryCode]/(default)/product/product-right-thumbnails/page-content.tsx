'use client';
import React from "react";
import {Element} from 'react-scroll';
import {useParams} from "next/navigation";

import ProductDetailsTab from "@/components/product/productDetails/description-tab";
import RelatedProductSlider from "@/components/product/feeds/related-product-feed";
import {useProductQuery} from "@/hooks/use-product-query";
import ProductGallery from "@/components/product/productDetails/product-gallery";
import ProductView from "@/components/product/productDetails/product-view";

import {variationsSwatchImage} from "@/components/product/productView/data-variations/variations-swatch-image";
import {Variation} from "@/types/template";
import useProductVariations from "@/hooks/use-product-variations";
import ProductPDPLoader from "@/components/shared/loaders/product-pdp-loader";
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
        <Element name="category" className=" products-category">
            <div className="grid-cols-12 lg:grid grid-rows-reverse gap-7 2xl:gap-10 mb-8 lg:mb-20 ">
                <ProductGallery
                    className={"col-span-6 order-last"}
                    variant={"right"}
                    data={data}
                    attributes={attributes}
                />
                <ProductView
                    data={data}
                    className={"col-span-5"}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    useVariations={variationsSwatchImage.variations as Variation[]}
                />
                
            </div>
            <ProductDetailsTab/>
            <RelatedProductSlider/>
        
        </Element>
    
    );
}
