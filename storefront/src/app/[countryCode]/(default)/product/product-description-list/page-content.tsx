'use client';
import React from "react";
import {Element} from 'react-scroll';
import {useParams} from "next/navigation";

import DescriptionList from "@/components/product/productDetails/description-list";
import RelatedProductSlider from "@/components/product/feeds/related-product-feed";
import {useProductQuery} from "@/hooks/use-product-query";
import ProductGallery from "@/components/product/productDetails/product-gallery";
import ProductView from "@/components/product/productDetails/product-view";
import ProductPDPLoader from "@/components/shared/loaders/product-pdp-loader";
import {variationsDropdown} from "@/components/product/productView/data-variations/variations-dropdown";
import {Variation} from "@/types/template";
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
        <Element name="category" className=" products-category">
            <div className="w-full">
                <div className="grid-cols-12 lg:grid gap-7 2xl:gap-10 mb-8 lg:mb-10 ">
                    <ProductGallery
                        data={data}
                        className={"col-span-6 "}
                        enableVideo={true}
                        attributes={attributes}
                    />
                    <ProductView
                        data={data}
                        className={"col-span-5 "}
                        attributes={attributes}
                        setAttributes={setAttributes}
                        useVariations={variationsDropdown.variations as Variation[]}/>
                </div>
                <DescriptionList/>
                <RelatedProductSlider/>
            </div>
        
        </Element>
    
    );
}
