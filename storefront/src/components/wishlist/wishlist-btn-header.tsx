'use client';
import cn from 'classnames';
import { Heart } from 'lucide-react';
import { useRouter, useParams } from "next/navigation";
import { useWishlist } from '@/hooks/use-wishlist';
import { ROUTES } from '@/utils/routes';
import { useIsMounted } from "@/utils/use-is-mounted";
import { useCallback } from "react";
import { useI18n } from "@lib/hooks/use-i18n";

type CartButtonProps = {
    className?: string;
    iconClassName?: string;
    hideLabel?: boolean;
    variant?: Variant;
};
type Variant =
    | 'Border'
    | 'Normal';

const WishlistButtonHeader: React.FC<CartButtonProps> = ({
    className,
    hideLabel,
    variant = 'Normal',
}) => {
    const { wishlistList } = useWishlist(); // this is just the array of products
    const router = useRouter();
    const { t } = useI18n();
    const { countryCode } = useParams() as { countryCode: string };
    const mounted = useIsMounted();

    const handleNavigation = useCallback((route: string) => {
        // Navigate to the route
        router.push(`/${countryCode}${route}`);
    }, [router, countryCode])


    return (
        <button
            className={cn(
                'hidden lg:flex items-center justify-center shrink-0 h-auto focus:outline-none transform',
                className
            )}
            onClick={() => handleNavigation(ROUTES.SAVELISTS)}
        >
            <div className="relative flex items-center group">
                <div className='flex items-center relative '>
                    <div className={cn("cart-button", {
                        [` w-11 h-11 flex justify-center items-center rounded-full border-2 border-brand-light/20`]: variant === 'Border',
                    })}>
                        <Heart size={20} strokeWidth={2} />
                    </div>
                    <span className="cart-counter-badge  h-[18px] min-w-[18px] rounded-full flex items-center justify-center bg-red-600 text-brand-light absolute -top-1 start-4  text-11px">
                        {mounted ? wishlistList.length : 0} {/* Show 0 until mounted */}
                    </span>
                </div>
                {!hideLabel && (
                    <span className="text-sm font-normal ms-2 myCartLabel">
                        {t('myWishlist')}
                    </span>
                )}

            </div>

        </button>
    );
};

export default WishlistButtonHeader;
