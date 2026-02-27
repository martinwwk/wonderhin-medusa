import React from "react";
import Link from "@/components/shared/link";
import { Product } from "@/types/template";
import StarIcon from "@/components/icons/star-icon";
import { ROUTES } from "@/utils/routes";
import cn from "classnames";

interface ProductDetailsProps {
    product: Product;
    variant?: string;
    useReview?: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, useReview = true,variant="default" }) => {
    const { name, slug,rating } = product;
    return (
        <>
            <Link
                href={`${ROUTES.PRODUCT}/${slug}`}
                className={cn("  leading-5  line-clamp-2 mt-1 mb-1.5",
                    {
                        "text-brand-dark text-15px font-semibold": variant,
                        "text-fill-purple text-sm min-h-[40px]": variant === "outBorder" || variant === "cardList" ,
                        "text-brand-dark text-base md:text-lg font-semibold": variant === "list" || variant === "bestdeal"  ,
                        "text-fill-purple text-sm dark:text-black min-h-[40px]": variant === "furni"
                    })}
            >
                {name}
            </Link>
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

        </>
    );
};

export default ProductDetails;