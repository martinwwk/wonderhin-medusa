import cn from 'classnames';
import {Product} from '@/types/template';

import React from "react";
import ProductPricing from "@/components/product/productListing/productCardsUI/product-pricing";
import ProductActions from "@/components/product/productListing/productCardsUI/product-actions";
import ProductImage from "@/components/product/productListing/productCardsUI/product-image";
import ProductDetails from "@/components/product/productListing/productCardsUI/product-details";
import { useCart } from "@/hooks/use-cart";


interface ProductProps {
    product: Product;
    className?: string;
    variant?: string;
    useFadeImg?: boolean;
}

const ProductCardList: React.FC<ProductProps> = ({product, className,variant = "list",useFadeImg=true}) => {
    const { id,description, quantity} = product ?? {};
    const { useCartHelpers } = useCart();
    const {outOfStock} = useCartHelpers();
    const statusOutOfStock = outOfStock(id) || quantity < 1;
    return (
        <article
            className={cn(
                'flex  gap-4 lg:gap-8 bg-white rounded ',
                className
            )}
        >
            <div className={cn("w-[30%] xl:w-[300px] flex-none relative rounded-lg overflow-hidden",{
                "card-image-hover_zoom": useFadeImg })}
            >
                <ProductImage product={product} outOfStock={statusOutOfStock} variant={variant} useFadeImg={true} />
            </div>
            
            <div className="w-[70%] xl:w-full flex flex-col justify-center">
                <ProductDetails product={product} variant={variant}/>
                <ProductPricing product={product} variant={variant} />
                
                <p className="hidden md:block text-15px line-clamp-3 leading-7 opacity-80 mt-3">
                    {description}
                </p>
                
                <div className="hidden md:inline-block    mt-3 md:mt-6">
                    <ProductActions product={product} variant={variant} />
                </div>
            </div>
           
        </article>
    );
};

export default ProductCardList;
