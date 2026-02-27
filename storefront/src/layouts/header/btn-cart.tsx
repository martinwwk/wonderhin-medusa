
import {useCart} from '@/hooks/use-cart';
import { useUI } from '@/hooks/use-UI';
import cn from 'classnames';
import {colorMap} from "@/data/color-settings";
import {usePanel} from "@/hooks/use-panel";
import { ShoppingBag } from 'lucide-react';
import {useIsMounted} from "@/utils/use-is-mounted";
import React, {useCallback} from "react";
import { useI18n } from "@lib/hooks/use-i18n";

type CartButtonProps = {
    className?: string;
    hideLabel?: boolean;
    variant?: Variant;
};
type Variant =
    | 'Border'
    | 'Normal';

const CartButton: React.FC<CartButtonProps> = ({
                                                   className,
                                                   hideLabel,
                                                   variant='Normal',
                                               }) => {
    const {openDrawer, setDrawerView} = useUI();
    const {totalItems} = useCart();
    const { t } = useI18n();

    const mounted = useIsMounted();

    const handleCartOpen = useCallback(() => {
        setDrawerView('CART_SIDEBAR');
        return openDrawer();
    },[openDrawer, setDrawerView]);

    const { selectedColor } = usePanel();
    
    
    return (
        <button
            className={cn(
                'myCart flex',
                'flex items-center justify-center shrink-0 h-auto focus:outline-none transform',
                className
            )}
            onClick={handleCartOpen}
            aria-label="cart-button"
        >
            <div className="relative flex items-center group">
                <div className='flex items-center relative '>
                    <div className={cn("cart-button",{
                        [`${colorMap[selectedColor].groupHoverBorder} w-11 h-11 flex justify-center items-center rounded-full border-2 border-brand-light/20`] : variant ==='Border',
                    })}>
                    <ShoppingBag size={20} strokeWidth={2}/>
                    </div>
                    <span className="cart-counter-badge  h-[18px] min-w-[18px] rounded-full flex items-center justify-center bg-red-600 text-brand-light absolute -top-1 start-4  text-11px">
                       {mounted ? totalItems : 0} {/* Show 0 until mounted */}
                    </span>
                </div>
                {!hideLabel && (
                    <span className="text-sm font-normal ms-2 myCartLabel">
                      {t('myCart')}
                    </span>
                )}
            
            </div>
        
        </button>
    );
};

export default CartButton;
