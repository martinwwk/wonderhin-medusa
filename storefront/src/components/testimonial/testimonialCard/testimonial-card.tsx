import Image from '@/components/shared/image';
import Text from '@/components/shared/text';
import { collectionPlaceholder } from '@/assets/placeholders';
import React from "react";
import StarIcon from "@/components/icons/star-icon";
import { Check } from "lucide-react";
import Heading from "@/components/shared/heading";
import CompareCardDrawer from "@/components/compare/compare-card-drawer";
import { useProductQuery } from "@/lib/data/template-products";
import { PropsCustomer } from "@/components/testimonial/data";
import cn from "classnames";
import Alert from '@/components/shared/alert';
import Loading from '@/components/shared/loading';

interface Props {
    imgWidth?: number | string;
    imgHeight?: number | string;
    variant?: string;
    useImage?: boolean;
    collection: PropsCustomer;
}

const TestimonialCard: React.FC<Props> = ({
    collection,
    variant,
    useImage = true,
    imgWidth = 240,
    imgHeight = 300,
}) => {
    const { image, author_name, verified, rating, description, productId, video } = collection;
    const { data: product, isLoading, isError, error } = useProductQuery({
        id: productId,
    });

    return (
        <div className={cn("bg-white rounded-xl overflow-hidden ",
            { "border border-black/10": !useImage },
            [useImage ? 'grid grid-cols-[100px_1fr] lg:grid-cols-[140px_1fr] xl:grid-cols-[240px_1fr] border border-black/10' : ''],

        )}>

            {useImage && (
                <div className=" relative  overflow-hidden">
                    {
                        video && video !== '' ?
                            <video className="w-full h-full object-cover rounded-x-xl" src={video} autoPlay loop muted
                                width={imgWidth}
                                height={imgHeight}
                            />
                            : <Image
                                src={image ?? collectionPlaceholder}
                                alt={author_name || ('card-thumbnail')}
                                width={imgWidth}
                                height={imgHeight}
                                rootClassName={"h-full"}
                                className="h-full duration-500 ease-out hover:scale-106"
                            />
                    }
                </div>
            )}

            <div className="p-3 xl:p-6.5">
                <div className="mb-3 block">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, idx) => (
                            <StarIcon
                                key={idx}
                                color={idx++ < rating ? "#F3B81F" : "#DFE6ED"}
                                className="w-3 h-3 mx-px"
                            />
                        ))}
                    </div>
                </div>
                <div className={"flex flex-col lg:flex-row gap-2"}>
                    <Heading variant={"title"}>
                        {author_name}
                    </Heading>
                    {verified && (
                        <div className={"flex items-center text-gray-600 text-13px"}>
                            <Check size={18} strokeWidth={1} />
                            <i>Verified Buyer</i>
                        </div>
                    )}
                </div>

                <Text variant="body" className={"py-4"}>{description}</Text>
                <div className={"border-t border-border-base pt-5 md:pt-6.5"}>
                    {isError && <Alert message={(error as Error)?.message || 'Something went wrong'} />}
                    {isLoading ? <Loading />
                        :
                        product?.map((product) => (
                            <CompareCardDrawer
                                key={product.id}
                                product={product}
                                variant={"circle"}
                                useReview={false}
                            />
                        ))
                    }

                </div>
            </div>

        </div>
    );
};

export default TestimonialCard;
