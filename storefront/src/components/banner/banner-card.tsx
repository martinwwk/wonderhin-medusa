'use client';

import Link from '@/components/shared/link';
import Image from "@/components/shared/image";
import useWindowSize from '@/utils/use-window-size';
import cn from 'classnames';
import {BannerType} from "@/components/banner/banner-grid";
import {collectionPlaceholder} from "@/assets/placeholders";
import Text from "@/components/shared/text";
import Heading from "@/components/shared/heading";
import React from "react";
import {useUI} from "@/hooks/use-UI";

interface BannerProps {
    banner: BannerType;
    variant?: 'default' | 'home2Grid2' | 'home3Hero' | 'home3Grid' | 'home4Highlight';
    className?: string;
    morden?: boolean;
    rounded?: string;
}


const BannerCard: React.FC<BannerProps> = ({
                                               banner,
                                               className,
                                               variant = 'default',
                                               morden,
                                               rounded = 'rounded-xl'
                                           }) => {
    const {width} = useWindowSize();
    const {getImage}= useUI();
    const {heading, subheading, description, slug, image, btnText, videoUrl} = banner;
    const selectedImage = getImage(width!, image!);
    const classRounded = rounded;

    return (
        <div
            className={cn("flex flex-col justify-center items-center overflow-hidden  group shadow-card relative", className)}
        >
            { morden && (
                <div className={cn("absolute z-1 inset-0 bg-linear-0 from-black/40 ",classRounded)}></div>
            )}

            {videoUrl && videoUrl !== '' ?
                <video className={cn("w-full h-full object-cover",classRounded)} src={videoUrl} autoPlay loop muted/>
                : <Link href={slug} className={"flex cursor-default"}>
                    <Image
                        src={selectedImage.url ?? collectionPlaceholder}
                        alt={heading || ('card-thumbnail')}
                        width={selectedImage?.width}
                        height={selectedImage?.height}
                        rootClassName={cn("h-full overflow-hidden",classRounded)}
                        className="h-full duration-500 ease-out group-hover:scale-106"
                    />
                </Link>
            }

            <div className={cn("absolute  z-2 text-brand-light text-center ", {
                "p-5 lg:p-10 bottom-0 lg:py-13": variant === "home3Hero",
                "p-5 lg:p-10 left-0 bottom-0 lg:py-13 xs:text-start": variant === "home3Grid",
            })}>
                {subheading && (
                    <Text className={"xs:text-13px font-semibold mb-2 xs:cursor-default"}>{subheading}</Text>
                )}

                {heading && (
                    <Heading variant="titleLarge" className={cn(
                        [description ? 'mb-3 xs:cursor-default' : 'mb-7 xs:cursor-default'],
                        {"xl:text-3xl": variant === "home3Hero"}
                    )}>
                        {heading}
                    </Heading>
                )}

                {description && (
                    <Text variant={"body"} className={"mb-7"}>{description}</Text>
                )}

                {btnText && (
                    <Link variant={"button-white"} href={slug} className={cn("xs:inline-block", {
                            "min-w-[200px]": variant === "home3Hero",
                        }
                    )}>{btnText}</Link>
                )}
            </div>

        </div>
    );
};

export default BannerCard;
