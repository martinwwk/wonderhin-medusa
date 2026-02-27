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
    variant?: 'default' |'home2Grid2' |  'home3Grid1' | 'home3Grid2' | 'home3Highlight';
    collection: MultiType;
    className?: string;

}

const MultiCard: React.FC<Props> = ({
                                        collection,
                                        variant = 'default',
                                        className,
                                    }) => {

    const {heading, subheading, description, slug, image, btnText, videoUrl} = collection;

    const imgSize = useMemo(() => {
        switch (variant) {
            case 'home3Highlight':
                return {width: 337, height: 450};
            case 'home3Grid2':
                return {width: 695, height: 350};
            case 'home3Grid1':
                return {width: 456, height: 600};
            case 'home2Grid2':
                return {width: 903, height: 592};
            default:
                return {width: 450, height: 300};
        }
    }, [variant]);

    return (
        <div
            className={cn("flex flex-col justify-center overflow-hidden  group shadow-card relative", className)}
        >
            {videoUrl && videoUrl !== '' ?
                <video className="w-full h-full object-cover rounded-2xl" src={videoUrl} autoPlay loop muted/>
                : <Image
                    src={image ?? collectionPlaceholder}
                    alt={heading || ('card-thumbnail')}
                    width={imgSize.width}
                    height={imgSize.height}
                    rootClassName={"h-full rounded-xl overflow-hidden"}
                    className="h-full duration-500 ease-out group-hover:scale-106"
                />
            }

            <div className={cn("absolute inset-auto z-1 p-5 lg:p-10 w-full text-brand-light text-center", {
                "bottom-0 lg:py-10": variant === "home3Grid1",
                "left-0 xs:w-auto xs:text-start": variant === "home3Grid2" ,
            })}>
                <Text className={"xs:text-13px font-semibold mb-2"}>{subheading}</Text>
                <Heading variant="titleLarge" className={cn(
                    [description ? 'mb-3' : 'mb-7'],
                    {"xl:text-3xl": variant === "home3Grid1"}
                )}>
                    {heading}
                </Heading>

                {description && (
                    <Text variant={"body"} className={"mb-7"}>{description}</Text>
                )}

                {btnText && (
                    <Link variant={"button-white"} href={slug} className={"xs:inline-block "}>{btnText}</Link>
                )}

            </div>
            <Link href={slug} className={"absolute inset-0 z-2"}></Link>
        </div>
    );
};

export default MultiCard;
