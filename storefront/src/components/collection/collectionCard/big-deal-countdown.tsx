'use client';

import Image from '@/components/shared/image';
import {collectionPlaceholder} from '@/assets/placeholders';
import cn from "classnames";
import React from "react";
import CountdownTimer from "@/components/shared/countdownTimer";
import {ROUTES} from "@/utils/routes";
import Link from "@/components/shared/link";

interface Props {
    image: string;
    className?: string;
}

const BigDealCountDown: React.FC<Props> = ({
                                               image,
                                               className =''
                                                 }) => {
    const date = Date.now() + 4000000 * 60;
    return (
        <div  className={cn("relative h-full rounded-lg overflow-hidden ",className)}>
            <Image
                src={image ?? collectionPlaceholder}
                alt={'text-thumbnail'}
                width={450}
                height={650}
                rootClassName={"xs:absolute top-0 xs:flex items-center justify-center  overflow-hidden"}
            />
            <div className={" h-full  flex items-end justify-center text-center "}>
                <div className={" p-5 lg:p-7.5 relative z-2 text-brand-light"}>
                    <p className={"mb-5 text-xs font-semibold"}>DON&#39;T MISS OUT...</p>
                    <h3 className={`text-2xl lg:text-4xl leading-10 mb-2.5  font-semibold `}>
                        Today&#39;s Big Deals
                    </h3>
                    <p className={"mb-3 lg:mb-7 text-sm "}>Sale up to 75% all items. Hurry Up!</p>
                    <CountdownTimer date={date ?? new Date()} />

                    <div className={"w-full flex justify-center   mt-4"}>
                        <Link
                            variant={"button-white"}
                            href={`${ROUTES.CATEGORY}/top-deals`}
                            className={"min-w-48"}
                        >
                            Shop Sale
                        </Link>
                    </div>
                </div>


            </div>

        </div>
    );
};

export default BigDealCountDown;
