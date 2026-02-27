import React from "react";
import {Product, VariationOption, VariationsType} from "@/types/template";
import Button from "@/components/shared/button";
import CartIcon from "@/components/icons/cart-icon";
import WishlistButton from "@/components/wishlist/wishlist-btn-pdp";
import CompareButton from "@/components/compare/compare-button";
import PaypalIconLabel from "@/components/icons/payment/paypal-text";

interface ProductActionsProps {
    data: Product;
    selectedVariation?: VariationOption;
    addToCart: () => void;
    addToCartLoader: boolean;
    isSelected: VariationsType;
    targetButtonRef: React.RefObject<HTMLButtonElement | null>;
    isInCart: (id: string) => boolean;
    isInStock: (id: string) => boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
                                                           data,
                                                           addToCart,
                                                           addToCartLoader,
                                                           selectedVariation,
                                                           isSelected,
                                                           isInCart,
                                                           isInStock,
                                                           targetButtonRef,
                                                       }) => {
    const itemId = (selectedVariation ? selectedVariation.id : data.id).toString();
    const outOfStock = isInCart(itemId) && !isInStock(itemId);
    
    return (
        <div className=" space-y-2.5 md:space-y-3.5">
            <div className="flex flex-col md:flex-row gap-2.5 lg:gap-4 mt-4 md:mt-8" data-product-attribute>
                <Button
                    ref={targetButtonRef}
                    variant="formButton"
                    onClick={addToCart}
                    className="flex-auto px-1.5"
                    loading={addToCartLoader}
                    disabled={!isSelected || outOfStock}
                >
                    <CartIcon width={18} className="text-white ltr:mr-3 rtl:ml-3" />
                    {outOfStock ? "Out Of Stock": " Add To Cart"}
                </Button>
                <div className="grid grid-cols-2 gap-2.5 lg:gap-4">
                    <WishlistButton product={data} />
                    <CompareButton product={data} />
                </div>
            </div>
            <Button variant="paypal" className="gap-2">
                Pay with <PaypalIconLabel />
            </Button>
        </div>
    );
};

export default ProductActions;