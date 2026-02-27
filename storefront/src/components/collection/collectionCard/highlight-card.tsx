'use client';

import Heading from '@/components/shared/heading';
import Text from "@/components/shared/text";
import {MultiType} from "@/components/collection/collection-highlights";
import cn from "classnames";
import {collectionPlaceholder} from "@/assets/placeholders";
import Image from "@/components/shared/image";
import React, {useMemo} from "react";
import Link from "@/components/shared/link";


interface Props {
    variant?: 'default' | 'home5';
    collection: MultiType;
    className?: string;

}

const HighlightCard: React.FC<Props> = ({
                                            collection,
                                            variant = 'default',
                                            className,
                                        }) => {

    const {heading, subheading, description, slug, image, btnText, videoUrl} = collection;

    const imgSize = useMemo(() => {
        switch (variant) {
            case 'home5':
                return {width: 370, height: 500};

            default :
                return {width: 266, height: 345};
        }
    }, [variant]);

    return (
        <div
            className={cn("flex flex-col justify-center overflow-hidden  group shadow-card relative", className)}
        >
            {videoUrl && videoUrl !== '' ?
                <video className="w-full h-full object-cover rounded-2xl" src={videoUrl} autoPlay loop muted/>
                : <Link href={slug}>
                    <Image
                        src={image ?? collectionPlaceholder}
                        alt={heading || ('card-thumbnail')}
                        width={imgSize.width}
                        height={imgSize.height}
                        rootClassName={"h-full rounded-xl overflow-hidden"}
                        className="h-full duration-500 ease-out group-hover:scale-106"
                    />
                </Link>
            }

            <div className={cn("absolute inset-auto z-1  w-full text-brand-light", {
                "bottom-0 p-5 lg:p-8 text-center": variant === "default" || variant === "home5",
            })}>
                {heading && (
                    <Link href={slug}>
                        <Heading variant="titleLarge" className={cn(
                            [description ? 'mb-3' : 'mb-0'],
                            {"xl:text-2xl": variant === "default"}
                        )}>
                            {heading}
                        </Heading>
                    </Link>
                )}

                {subheading &&(
                    <Text className={"mb-2 cursor-default"}>{subheading}</Text>
                )}

                {description && (
                    <Text variant={"body"} className={"mb-7"}>{description}</Text>
                )}

                {btnText && (
                    <Link variant={"button-white"} href={slug} className={"xs:inline-block min-w-[180px]"}>{btnText}</Link>
                )}
            </div>

        </div>
    );
};

export default HighlightCard;
