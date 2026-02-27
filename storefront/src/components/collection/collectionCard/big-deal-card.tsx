'use client';

import Image from '@/components/shared/image';
import { collectionPlaceholder } from '@/assets/placeholders';
import cn from "classnames";
import React, { useCallback, useState } from "react";

import { ShoppingBag } from "lucide-react";
import Button from "@/components/shared/button";
import { useProductQuery } from "@/lib/data/template-products";

import dynamic from "next/dynamic";
const BigDealProduct = dynamic(() => import('@/components/collection/collectionCard/big-deal-product'), { ssr: false });

interface Props {
    className?: string;
    collection: PropsBigDeals;
}

interface PropsBigDeals {
    viewMore: string;
    image: string;
    product: {
        id: string;
    }[];
}

const BigDealCard: React.FC<Props> = ({
    className = '',
    collection
}) => {
    const { viewMore, image, product } = collection;

    // Extract product IDs from collection.product
    const productIds = product.map(p => p.id);

    // Use useProductQuery to fetch products matching the IDs
    const { data: productList } = useProductQuery({
        id: productIds.join(','), // Join IDs for the query (or handle individually, see below)
    });

    // State to manage the visibility of the product list popup
    const [isOpen, setIsOpen] = useState(false);

    // Handle popup view and close
    const handlePopupView = useCallback(() => {
        setIsOpen(true);
    }, [])

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, [])

    return (
        <div className={cn("relative flex flex-col", className)}>
            <Image
                src={image ?? collectionPlaceholder}
                alt={'text-thumbnail'}
                width={450}
                height={650}
                rootClassName={"flex items-center justify-center overflow-hidden rounded-lg"}
            />
            <div className="absolute  bottom-0 start-0 m-5 lg:m-7.5 ">
                <Button variant="white" className={"space-x-2 gap-2"}
                    onClick={handlePopupView}
                >
                    <ShoppingBag size={16} strokeWidth={2} />
                    {viewMore}
                </Button>
            </div>

            <BigDealProduct
                isOpen={isOpen}
                onClose={handleClose}
                productList={productList}
            />
        </div>
    );
};

export default BigDealCard;
