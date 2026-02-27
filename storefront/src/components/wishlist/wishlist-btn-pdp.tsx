import { useWishlist } from '@/hooks/use-wishlist';
import {Heart, Trash2} from "lucide-react";

import {Tooltip} from "@/components/shared/tooltip";
import {Product} from "@/types/template";
import {useMemo} from "react";
import Button from "@/components/shared/button";

interface Props {
    product : Product;
    variant?: string;
};

const WishlistButtonPDP: React.FC<Props> = ({product,  variant}) => {
    const { wishlistList, addToWishlist, removeFromWishlist } = useWishlist();

    const isWishlist = (productId: number|string) => wishlistList.some((product) => product.id === productId);
    const btnWishlist = isWishlist(product?.id);
    const wishlistStatus = btnWishlist === true ? 'Remove Wishlist' : 'Added to Wishlist';

    const btnVariant = useMemo(() => {
        if (variant === 'mercury') return 'white-w45';
        return 'compare-pdp';
    }, [variant]);

    const position = useMemo(() => {
        if (variant === 'mercury') return 'left';
        return 'top';
    }, [variant]);

    return (
        <>
            <Tooltip content={wishlistStatus} className={"min-w-36 "} position={position}>
            {btnWishlist ? (
                <Button
                    variant={btnVariant}
                    className={"xs:bg-brand-dark xs:text-white"}
                    onClick={() => removeFromWishlist(product?.id as string)}>
                    <Trash2 size={18} strokeWidth={1} />
                </Button>
            ) : (
                <Button
                    variant={btnVariant}
                    onClick={() => addToWishlist(product)}>
                    <Heart size={18} strokeWidth={1} />
                </Button>
            )}
            </Tooltip>
        </>
    );
}
export default WishlistButtonPDP;
