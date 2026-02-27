import React, {useMemo} from "react";
import Link from "@/components/shared/link";
import { Product } from "@/types/template";
import { ROUTES } from "@/utils/routes";

import WishlistButton from "@/components/wishlist/wishlist-btn-pdp";
import CompareButton from "@/components/compare/compare-button";
import BtnQuickview from "@/components/product/productListing/productCardsUI/btn-quickview";
import cn from "classnames";
import dynamic from "next/dynamic";
import { useCart } from "@/hooks/use-cart";

const AddToCart =  dynamic(() => import("@/components/product/add-to-cart"),{ssr: false});

interface ProductActionsProps {
    product: Product;
    variant?: string;
    removeWishlist?: (id: string) => void;
    showBtnActions?:boolean;
    showBtnWishlist?: boolean;
    showBtnCompare?: boolean;
    showBtnQuickview?: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
                                                           product,
                                                           removeWishlist,
                                                           variant="mercury",
                                                           showBtnActions,
                                                           showBtnWishlist,
                                                           showBtnCompare,
                                                           showBtnQuickview
                                                       }) => {
    const {  id, product_type, slug, quantity } = product;
    const { useCartHelpers } = useCart();
    const {outOfStock} = useCartHelpers();
    const statusOutOfStock = outOfStock(id);

    const btnVariant = useMemo(() => {
        if (variant === 'list') return 'button-black';
        return 'button-mercury';
    }, [variant]);

    return (
            <div className={cn("flex gap-2",{
                "items-center ": variant =="list",
            }
            )}>
                <div className={cn("product-cart-action ",
                    "transition-all ease-in-out duration-300", {
                        "xs:static": variant =="list",
                        "flex justify-center absolute -bottom-10 left-4 right-4 opacity-0 group-hover:opacity-100 group-hover:bottom-5": variant =="mercury",
                    }
                )}>
                    {statusOutOfStock || quantity < 1 ? null : product_type === "variable" ? (
                        <Link className={"min-w-40 md:min-w-48"} variant={btnVariant} href={`${ROUTES.PRODUCT}/${slug}`}>Choose Options</Link>
                    ) : (
                        <AddToCart className={"min-w-40 md:min-w-48"}  data={product} variant={variant} />
                    )}
                </div>

                {showBtnActions && (
                    <div className={cn("product-item-action ",
                        "transition-all ease-in-out duration-300",
                        "group-hover:visible group-hover:opacity-100 group-hover:end-3", {
                            "xs:top-17": removeWishlist,
                            "flex gap-2": variant =="list",
                            "flex flex-col gap-1.5  absolute top-3 end-0 opacity-0 invisible": variant =="mercury",
                        }
                    )}>
                        {!removeWishlist && showBtnWishlist && <WishlistButton product={product} variant={variant}/>}

                        {showBtnCompare && <CompareButton  product={product} variant={variant}/>}

                        {variant != 'list' && showBtnQuickview &&  <BtnQuickview   product={product} />}

                    </div>
                )}


            </div>

    );
};

export default ProductActions;