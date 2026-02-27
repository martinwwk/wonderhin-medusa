import cn from "classnames";
import Link from "@/components/shared/link";
import Image from "@/components/shared/image";
import {productPlaceholder} from "@/assets/placeholders";
import {StoreType} from "@/types/template";
import Heading from "@/components/shared/heading";
import {useMemo} from "react";

interface storesProps {
    data: StoreType[];
    className?: string;
}

const OurStores: React.FC<storesProps> = ({
        data,
        className ,
    }) => {

    const  memoizedStores = useMemo(() => {
            return data?.map((item: StoreType) => {
                const { id, name, image, address, phoneNumber, openTime, location } = item ?? {};
                const htmlLocation = openTime ? {dangerouslySetInnerHTML: { __html: openTime },} : {};

                return (
                    <article
                        key={`categories--key-${id}`}
                        className={cn(
                            'rounded-md   space-y-5',
                            className
                        )}
                    >
                        <div className="flex  relative z-2 rounded-lg overflow-hidden">
                            <Image
                                src={image ?? productPlaceholder}
                                alt={name || 'Product Image'}
                                width={500}
                                height={300}
                                className="duration-1000 ease-in-expo hover:scale-109"
                            />
                        </div>
                        <div className={"space-y-3"}>
                            <Heading variant="titleMedium" className="mb-3">{name}</Heading>
                            <div className={"space-y-2 text-sm"}>
                                <p>{address}</p>
                                <p>Phone: {phoneNumber}</p>
                            </div>
                            <div className={"leading-7 text-sm"} {...htmlLocation}>
                            </div>
                            <Link href={location as string} className={"sm:capitalize  inline-block mb-5"}
                                  variant={'button-border'} >
                                Get Directions
                            </Link>
                        </div>

                    </article>
                );
            })
    },[className, data])

    return (
        <div
            className={cn(
                className,
                'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-5 md:gap-5'
            )}
        >
            {memoizedStores}
        </div>
    );
}
export default OurStores;