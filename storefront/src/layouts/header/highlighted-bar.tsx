'use client';
import React, {useCallback, useRef, useState} from "react";
import {useSessionStorage} from 'react-use';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation} from 'swiper/modules';
import {Swiper as SwiperType} from "swiper"; // Import Swiper type for TypeScript
import 'swiper/css/autoplay';
import {IoIosArrowBack, IoIosArrowForward, IoIosPause, IoIosPlay} from "react-icons/io";
import Link from "@/components/shared/link";
import HighlightedBar from "@/components/shared/highlighted-bar";
import {useIsMounted} from "@/utils/use-is-mounted";

interface Props {
    className?: string;
}

const RenderedHighLightedBar: React.FC<Props> = ({className}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [isPlaying, setIsPlaying] = useState(true); // Track autoplay status
    const mounted = useIsMounted();
    const handlePause = () => {
        swiperRef.current?.autoplay?.stop();
        setIsPlaying(false);
    };

    const handlePlay= useCallback(() => {
        swiperRef.current?.autoplay?.start();
        setIsPlaying(true);
    },[swiperRef])

    const [highlightedBar, setHighlightedBar] = useSessionStorage(
        'highlightedBar',
        'false'
    );
    const HighLightedBarItems = [
        {id: 1, title: "Updates to Digital Service Terms of Use and Privacy Policy ", href: "/"},
        {id: 2, title: "Welcome to Join us for 5% off & free delivery ", href: "/"},
        {id: 3, title: "Claim your online FREE Delivery or Shipping today", href: "/"},
    ];

    return (
        <>
            {highlightedBar !== 'true' && (
                <HighlightedBar className={className} onClose={() => setHighlightedBar('true')}>
                    <Swiper
                        onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
                        modules={[Navigation, Autoplay]}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{delay: 5000}} // Configure autoplay delay
                        navigation={false} // Disable default navigation arrows
                    >
                        {HighLightedBarItems.map((item, idx: number) => (
                            <SwiperSlide key={`highlightedBar--key-${idx}`}>
                                <div className="text-center  text-brand-light text-13px">
                                    {item.title}
                                    <Link className="notification-banner__link underline ml-2 "
                                          href={item.href}>Learn More</Link>
                                </div>
                            </SwiperSlide>
                        ))
                        }
                    </Swiper>

                    {/* Custom Arrows */}
                    <div
                        className="hidden lg:block c-carousel-controls ltr:right-0 rtl:left-0 absolute top-1/2 -translate-y-1/2 me-12  ">
                        <div
                            className="bg-black/10 flex rtl:flex-row-reverse items-center justify-center gap-1 text-brand-light  rounded-full">
                            <button
                                onClick={() => swiperRef.current?.slidePrev()}
                                className={"w-5 h-5 flex items-center justify-center cursor-pointer"}
                            >
                                <IoIosArrowBack/>
                            </button>
                            <button
                                onClick={isPlaying ? handlePause : handlePlay}
                                className={"w-5 h-5 flex items-center justify-center cursor-pointer"}
                            >
                                {isPlaying ? <IoIosPause/> : <IoIosPlay/>}
                            </button>
                            <button
                                onClick={() => swiperRef.current?.slideNext()}
                                className={"w-5 h-5 flex items-center justify-center cursor-pointer"}
                            >
                                <IoIosArrowForward/>
                            </button>
                        </div>

                    </div>
                </HighlightedBar>
            )}
        </>
    );
}
export default RenderedHighLightedBar;
