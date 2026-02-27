import React, {useMemo} from "react";
import cn from "classnames";
import { Product } from "@/types/template";

import ProductImage from "@/components/product/productListing/productCardsUI/product-image";
import ProductDetails from "@/components/product/productListing/productCardsUI/product-details";
import ProductPricing from "@/components/product/productListing/productCardsUI/product-pricing";
import BtnRemoveWishlist from "@/components/product/productListing/productCardsUI/btn-remove-wishlist";
import { useCart } from "@/hooks/use-cart";
import ProductActions from "@/components/product/productListing/productCardsUI/product-actions";


interface ProductProps {
    product: Product;
    className?: string;
    variant?: string;
    removeWishlist?: (id: string) => void;
    useFadeImg?: boolean;
}

const ProductCard: React.FC<ProductProps> = ({
                                                 product,
                                                 className = '',
                                                 variant = "default",
                                                 removeWishlist,
                                                 useFadeImg=true
                                             }) => {
    const { id, quantity } = product;
    const { useCartHelpers } = useCart();
    const {outOfStock} = useCartHelpers();
    const statusOutOfStock = outOfStock(id) || quantity < 1;

    const showBtn = useMemo(() => {
        switch (variant) {
            case 'underwear':
            case 'tiny':
                return {
                    showBtnActions:true,
                    showBtnWishlist:true,
                    showBtnCompare:false,
                    showBtnQuickview:false
                };

            default:
                return {
                    showBtnActions:true,
                    showBtnWishlist:true,
                    showBtnCompare:true,
                    showBtnQuickview:true
                };

        }
    }, [variant]);

    return (
        <article
            className={cn(
                "flex flex-col gap-2 md:gap-2.5 product-card relative group",
                className,
                {
                    "block": variant === "default",
                }
            )}
        >
            <BtnRemoveWishlist product={product} removeWishlist={removeWishlist} />
            <div className={cn(
                "relative rounded-lg overflow-hidden",
                {"card-image-hover_zoom": useFadeImg })
            }>
                <ProductImage product={product} variant={variant} outOfStock={statusOutOfStock} useFadeImg={useFadeImg} />
                {variant !== 'NoHover' && variant !== 'searchResults' ? (
                    <ProductActions
                        product={product}
                        removeWishlist={removeWishlist}
                        showBtnActions={showBtn.showBtnActions}
                        showBtnWishlist={showBtn.showBtnWishlist}
                        showBtnCompare={showBtn.showBtnCompare}
                        showBtnQuickview={showBtn.showBtnQuickview}

                    />
                ) : null}

            </div>

            <div className={cn("flex flex-col", {
                    "items-center text-center": variant != "caleste",
                })}>
                <ProductDetails product={product} variant={variant}/>
                <ProductPricing product={product} variant={variant}/>
            </div>
        </article>
    );
};

export default ProductCard;