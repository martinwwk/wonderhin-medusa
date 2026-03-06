import React, {useMemo} from "react";
import cn from "classnames";
import ImageBase from 'next/image';
import { Product } from "@/types/template";
import {productPlaceholder} from "@/assets/placeholders";
import usePrice from "@/lib/util/use-price";
import {ROUTES} from "@/utils/routes";
import Link from "@/components/shared/link";

interface ProductImageProps {
    product: Product;
    outOfStock: boolean;
    useFadeImg?: boolean;
    variant?: string;
    isFirst?: boolean; // Add prop to indicate if this is the first image (for LCP)
}

const ProductImage: React.FC<ProductImageProps> = ({ product, outOfStock,variant="default",useFadeImg, isFirst = false }) => {
    const { image, name, sale_price, price,gallery,slug,videoUrl } = product;
    const { discount } = usePrice({
        amount: sale_price ? sale_price : price,
        baseAmount: price,
        currencyCode: "USD",
    });

    
    const aspectRatio = useMemo(() => {
        switch (variant) {
            case 'list':
                return 'aspect-[324/400]';
            case 'caleste':
            case 'underwear':
                return 'aspect-[330/330]';
            default:
                return 'aspect-[340/450]';
        }
    }, [variant]);

    return (
        <>
            <Link href={`${ROUTES.PRODUCT}/${slug}`}  className={cn("relative block w-full overflow-hidden", aspectRatio)}>
                {videoUrl && videoUrl !=='' ?
                    <video className="absolute inset-0 w-full h-full object-cover" src={videoUrl} autoPlay loop muted />
                    : <ImageBase
                        src={image?.thumbnail ?? productPlaceholder}
                        className="first-image absolute inset-0 w-full h-full object-cover"
                        alt={name || "Product Image"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 340px"
                        loading={isFirst ? 'eager' : 'lazy'} // Eager for LCP, lazy for others
                        priority={isFirst} // Priority only for LCP images
                    />
                }

                {useFadeImg && gallery && gallery[0] && !videoUrl && (
                    <ImageBase
                        src={gallery[0].thumbnail ?? productPlaceholder}
                        className="secondary-image absolute inset-0 w-full h-full object-cover"
                        alt={name || "Product Image"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 340px"
                    />

                )}
            </Link>
            {(discount || outOfStock) && (
                <div className=" absolute top-3 z-10">
                    {discount && (
                        <span className="text-10px font-semibold text-brand-light uppercase inline-block bg-red-600 rounded-full px-3 py-1.5 ms-3">
                    On Sale
                    </span>
                    )}

                    {outOfStock && (
                        <span className="text-10px font-semibold text-brand-light uppercase inline-block bg-brand-dark dark:bg-white dark:text-brand-dark rounded-full px-3 py-1.5  ms-3">
                    Out Stock
                  </span>
                    )}
                </div>
            )}

        </>
    );
};

export default ProductImage;