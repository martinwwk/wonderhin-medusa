'use client';

import React from "react";
import {MultiType} from "@/components/collection/collection-highlights";
import Text from "@/components/shared/text";
import Heading from "@/components/shared/heading";
import Link from "@/components/shared/link";
import cn from "classnames";
import Image from "@/components/shared/image";
import {collectionPlaceholder} from "@/assets/placeholders";
import {useTextSplit} from "@/utils/use-text-split";
import CountdownTimer from "@/components/shared/countdownTimer";

interface Props {
    className?: string;
    collections: MultiType;
    variant?: 'default' | 'home5' | 'home6'| 'home7';
    imgWidth?: number | string;
    imgHeight?: number | string;
    countdown?:boolean;
}

const BackgroundVideo: React.FC<Props> = ({
                                              collections,
                                              className,
                                              imgWidth = 1837,
                                              imgHeight = 595,
                                              variant = 'default',
                                              countdown
                                          }) => {
    const {heading, subheading, slug, videoUrl, image,description, icon, btnText} = collections;
    const date = Date.now() + 4000000 * 60;
    return (
        <div className={cn("relative flex justify-center items-center", className)}>
            {
                videoUrl && videoUrl !== '' ?
                    <video className={cn("w-full h-full object-cover ",{
                        "rounded-x-2xl max-h-[400px] lg:max-h-[700px]": variant === 'default',
                        "rounded-xl min-h-[400px] lg:max-h-[500px]": variant === 'home5',
                        "rounded-md min-h-[600px] lg:max-h-[865px]": variant === 'home6',
                        "rounded-md min-h-[600px] lg:max-h-[600px]": variant === 'home7'

                    })}
                           src={videoUrl} autoPlay loop muted/>
                    : <Image
                        src={image ?? collectionPlaceholder}
                        alt={heading || ('card-thumbnail')}
                        width={imgWidth}
                        height={imgHeight}
                        rootClassName={"h-full"}
                        className="rounded-2xl"
                    />
            }

            <div className="absolute inset-auto z-1 p-5  text-brand-light text-center max-w-xl">
                {variant === 'home5' ? (
                    <>
                        <Heading variant="titleLarge" className={cn(" mb-2 xl:text-5xl xl:leading-14")}>
                            {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                            {useTextSplit({ text: heading || ''})}
                        </Heading>
                        <Text className={"xs:text-15px  mb-7 "}>{subheading}</Text>
                        {description && (
                            <Text variant={"body"} className={"mb-7"}>{description}</Text>
                        )}
                    </>
                ): (
                    <>
                        {icon && (
                            <Image
                                src={icon}
                                alt={heading || ('card-thumbnail')}
                                width={31}
                                height={50}
                            />
                        )}

                        <Text className={"xs:text-12px font-bold mb-2 uppercase"}>{subheading}</Text>
                        <Heading variant="titleLarge" className={cn("mb-10", {
                                "xl:text-5xl xl:leading-14": variant === 'default',
                                'lg:mb-10': !description
                            }
                        )}>
                            {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                            {useTextSplit({ text: heading || ''})}
                        </Heading>
                        {description && (
                            <Text variant={"body"} className={"mb-10"}>{description}</Text>
                        )}
                    </>
                )}

                {countdown && (
                    <CountdownTimer date={date ?? new Date()} variant={"line"} />
                )}


                {btnText && (
                    <Link variant={"button-white"} href={slug} className={"xs:inline-block "}>{btnText}</Link>
                )}
            </div>
        </div>
    )
}

export default BackgroundVideo;