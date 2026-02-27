import React from "react";
import { Product } from "@/types/template";
import CompareImage from "@/components/compare/compareCardUI/compare-image";
import CompareDetails from "@/components/compare/compareCardUI/compare-details";
import CompareAttributes from "@/components/compare/compareCardUI/compare-attributes";
import CompareActions from "@/components/compare/compareCardUI/compare-actions";
import ProductPricing from "@/components/product/productListing/productCardsUI/product-pricing";

interface Props {
    product: Product;
    removeCompare: (id: number) => void;
}

const CompareCard: React.FC<Props> = ({ product, removeCompare }) => {
    return (
        <div className="overflow-hidden border border-border-two rounded-md">
            <div className="px-2.5 md:px-5  text-center ">
                <CompareImage product={product} removeCompare={removeCompare} />
                <CompareActions product={product} />
                <CompareDetails product={product} />
                <ProductPricing product={product}  />
            </div>

            <CompareAttributes product={product} />
        </div>
    );
};

export default CompareCard;