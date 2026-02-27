import React from "react";
import cn from "classnames";
import usePrice from "@/lib/util/use-price";
import { Product } from "@/types/template";

interface ProductPricingProps {
    product: Product;
    variant?: string;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ product, variant = "default"}) => {
    const { product_type, sale_price, price, min_price, max_price } = product;
    const { price: displayPrice, basePrice } = usePrice({
        amount: sale_price ? sale_price : price,
        baseAmount: price,
        currencyCode: "USD",
    });
    const { price: minPrice } = usePrice({
        amount: min_price ?? 0,
        currencyCode: "USD",
    });
    const { price: maxPrice } = usePrice({
        amount: max_price ?? 0,
        currencyCode: "USD",
    });

    return (
        <div className={cn("space-s-2", {
            "mt-2 ": variant ,
            "mt-3 ": variant === "list" ,
        })}>
          <span
              className={cn( "text-brand-dark inline-block font-semibold", {
                  "text-15px": variant === "default" ,
                  "text-[18px]": variant === "list" ,
              })}
          >
            {product_type === "variable"
                ? `${minPrice} - ${maxPrice}`
                : displayPrice}
          </span>
            {basePrice && (
                <del className="mx-1 text-15px text-gray-400 text-opacity-70">{basePrice}</del>
            )}
        </div>
    );
};

export default ProductPricing;