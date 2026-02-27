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
import {useTextSplit} from "@/utils/use-text-split";
import CountdownTimer from "@/components/shared/countdownTimer";
import {useUI} from "@/hooks/use-UI";

interface BannerProps {
    banner: BannerType;
    variant?: 'default' | 'home2Grid2' | 'home3Hero' | 'home3Grid' | 'home4Highlight';
    className?: string;
    countdown?:boolean;
}


const HighlightTextCard: React.FC<BannerProps> = ({
                                               banner,
                                               className,
                                               variant = 'default',
                                                countdown
                                           }) => {
    const {width} = useWindowSize();
    const {getImage}= useUI();

    const {heading, subheading, description, slug, image, btnText, videoUrl} = banner;
    const selectedImage = getImage(width!, image!);
    const date = Date.now() + 4000000 * 60;
    return (
        <div
            className={cn("flex justify-center items-center overflow-hidden  group shadow-card relative", className)}
        >
            <div className={cn("basis-1/2 flex flex-col items-center p-5  lg:py-13 text-center")}>
                {subheading && (
                    <Text className={"xs:text-[12px] text-brand-dark font-semibold mb-2 xs:cursor-default"}>{subheading}</Text>
                )}

                {heading && (
                    <Heading variant="titleLarge" className={cn(
                        {"xl:text-[40px] xl:leading-14 text-brand-dark mb-3 max-w-md": variant === "home4Highlight"}
                    )}>
                        {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                        {useTextSplit({ text: heading || ''})}
                    </Heading>
                )}

                {description && (
                    <Text variant={"body"} className={"mb-10"}>{description}</Text>
                )}

                {countdown && (
                    <CountdownTimer variant={"line"} date={date ?? new Date()} className={"text-brand-dark"} />
                )}

                {btnText && (
                    <Link variant={"button-black"} href={slug} className={cn("xs:inline-block", {
                            "min-w-[215px]": variant === "home3Hero",
                        }
                    )}>{btnText}</Link>
                )}
            </div>

            <div className={"basis-1/2 flex justify-center"}>
                { videoUrl && videoUrl !== '' ?
                        <video className="w-full h-full object-cover rounded-2xl" src={videoUrl} autoPlay loop muted/>

                        : <Image
                                src={selectedImage.url ?? collectionPlaceholder}
                                alt={heading || ('card-thumbnail')}
                                width={selectedImage.width}
                                height={selectedImage.height}
                                className="duration-500 ease-out"
                        />
                }
            </div>


        </div>
    );
};

export default HighlightTextCard;
