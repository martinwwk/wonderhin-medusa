"use client"

import {useCart} from '@/hooks/use-cart';
import {constructCartItem} from '@/utils/construct-cart-item';
import {ImSpinner2} from "react-icons/im";
import cn from "classnames";
import { usePanel } from "@/hooks/use-panel";
import {colorMap} from "@/data/color-settings";
import {Product, VariationOption} from "@/types/template";
import { useI18n } from "@lib/hooks/use-i18n";

interface Props {
	data: Product;
	variation?: VariationOption;
	disabled?: boolean;
	className?: string;
	variant?: string;
}

const AddToCart = ({
	                   data,
	                   variation,
	                   disabled,
					   className,
	                   variant = 'mercury',
                   }: Props) => {
	const {selectedColor} = usePanel();
	const { t } = useI18n();
	
	const { useCartActions, useCartHelpers } = useCart();
	const { isInStock, isInCart } = useCartHelpers(); // Get helpers
	const { addToCart, addToCartLoader } = useCartActions(data, variation,);
	const item = constructCartItem(data!, variation!);
	const outOfStock = isInCart(item?.id) && !isInStock(item.id);


    return (
        <button
            className={cn(
                "w-full px-4 py-3.5 leading-5 flex  relative text-[15px] font-semibold  rounded-full text-sm items-center justify-center transition-all ",
                className,
                {
                    'cursor-not-allowed hover:cursor-not-allowed opacity-50': outOfStock,
                    'sm:text-white/30': addToCartLoader,
                    [`xs:rounded-none w-full  ${colorMap[selectedColor].bg} ${colorMap[selectedColor].hoverBg}`]: variant === 'furni',
                    [`text-white bg-brand-dark   ${colorMap[selectedColor].hoverBg}`]: variant === 'dark' || variant === 'list',
                    [`text-brand-dark bg-white/90 hover:bg-brand-dark/90 hover:text-white backdrop-blur`]: variant === 'mercury',
                }
            )}
            aria-label="Count Button"
            onClick={addToCart}
            disabled={disabled || outOfStock}
        >
            {outOfStock ? t('outOfStock') : t('addToCartLabel')}

            {addToCartLoader && (
                <ImSpinner2 className="w-5 h-5 animate-spin  absolute  text-white "/>
            )}
        </button>
    )
};

export default AddToCart;
