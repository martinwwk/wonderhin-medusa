import React, {useCallback} from "react";
import Image from "@/components/shared/image";
import CloseIcon from "@/components/icons/close-icon";
import {Product} from "@/types/template";
import {productPlaceholder} from "@/assets/placeholders";

import ProductPricing from "@/components/product/productListing/productCardsUI/product-pricing";
import ProductDetails from "@/components/product/productListing/productCardsUI/product-details";
import cn from "classnames";
import StarIcon from "@/components/icons/star-icon";

interface Props {
    product: Product;
    removeCompare?: (id: number) => void;
    variant?: string;
    useReview?: boolean;
}

const CompareCardDrawer: React.FC<Props> = ({product, variant = "default", useReview = true, removeCompare}) => {
    const {id, name, image, rating} = product;

    const handleRemove = useCallback(() => {
        removeCompare?.(id as number);
    }, [removeCompare, id]);

    return (
        <div className={cn(
            "group flex items-center  gap-4 relative border-b pb-2 lg:pb-4 border-border-two/50 last:border-0 last:pb-0",
            {"bg-gray-100 rounded-lg p-2 ": variant === 'default',}
        )}>
            {removeCompare && (
                <div
                    onClick={handleRemove}
                    className="absolute   p-2 rounded-full m-2 top-0 end-0 z-10 cursor-pointer hover:bg-brand-dark hover:text-white "
                >
                    <CloseIcon className="w-3 h-3"/>
                </div>
            )}

            <div className={cn(
                "rounded-md w-18 flex  justify-center items-center overflow-hidden",
                {"xs:rounded-full xs:w-16 xs:block max-h-16": variant === 'circle',}
            )}>
                <Image src={image?.thumbnail ?? productPlaceholder} width={72} height={96}
                       alt={name || 'Product Image'}/>
            </div>
            <div className="flex-1 xl:pe-8">
                <ProductDetails product={product} useReview={false}/>
                {useReview && (
                    <div className="flex text-gray-500 space-x-1">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, idx) => (
                                <StarIcon
                                    key={idx}
                                    color={idx++ < rating ? "#F3B81F" : "#DFE6ED"}
                                    className="w-3 h-3 mx-px"
                                />
                            ))}
                        </div>
                        <span className="text-[13px] leading-4">(2)</span>
                    </div>
                )}
                <ProductPricing product={product}/>
            </div>


        </div>
    );
}

export default CompareCardDrawer;
