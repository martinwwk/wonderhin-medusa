'use client';

import React from "react";
import CloseButton from "@/components/shared/close-button";
import { useModal } from '@/hooks/use-modal';
import Image from "@/components/shared/image";
import { collectionPlaceholder } from "@/assets/placeholders";
import { Product, Tag } from "@/types/template";
import Text from '@/components/shared/text';
import { useProductQuery } from "@/lib/data/template-products";
import ProductCard from "@/components/product/productListing/productCards/product-card";
import { PropsInstagram } from "@/components/instagram/data";
import Alert from "@/components/shared/alert";
import Loading from "@/components/shared/loading";

interface Props {
    imgWidth?: number | string;
    imgHeight?: number | string;
}
// Define the type for a single product item based on context
interface ProductItem {
    id: string;
}

const InstagramPopup: React.FC<Props> = ({
    imgWidth = 600,
    imgHeight = 600,
}) => {
    const { data, closeModal } = useModal();
    if (!data) return null;
    const { image, video, title, tags, product } = data as PropsInstagram;

    // Extract product IDs from collection.product
    const productIds = product.map((p: ProductItem) => p.id);

    // Use useProductQuery to fetch products matching the IDs
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: productList, isLoading, isError, error } = useProductQuery({
        id: productIds.join(','), // Ensure id is a string
    });

    return (
        <div className="md:w-[600px] lg:w-[940px] overflow-hidden bg-white rounded-lg">
            <CloseButton onClick={closeModal} />
            <div className="flex flex-wrap w-full">
                <div className={`lg:w-[55%] flex max-h-[360px] lg:max-h-[560px]`}>
                    {video !== '' ?
                        <video className="w-full h-full object-cover" src={video} autoPlay loop muted
                            width={imgWidth as number}
                            height={imgHeight as number}
                        />
                        : <Image
                            src={image ?? collectionPlaceholder}
                            alt={title || 'card-thumbnail'}
                            width={imgWidth as number}
                            height={imgHeight as number}
                        />
                    }
                </div>
                <div className="flex-1 ">
                    <div className="p-5 lg:p-7.5 lg:pb-5 ">
                        {isError && <Alert message={(error as Error)?.message || 'Something went wrong'} />}
                        <div className={"grid grid-cols-2 gap-4 mb-5"}>
                            {isLoading ? <Loading />
                                : productList?.map((product: Product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        variant={"NoHover"}
                                    />
                                ))
                            }

                        </div>

                        <Text className={"mb-3"}>{title}</Text>
                        <Text className={"mb-0"}>
                            {tags?.map((tag: Tag, idx: number) => (
                                <span key={idx} className="inline-block  mr-2">#{tag.name}</span>
                            ))}
                        </Text>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default InstagramPopup;
