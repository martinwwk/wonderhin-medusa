'use client';
import React, {FC, useRef} from "react";
import {SwiperSlide, Autoplay, Navigation, Swiper} from '@/components/shared/carousel/slider';
import {Swiper as SwiperType} from "swiper";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import cn from 'classnames';
import Link from "@/components/shared/link";
import {usePanel} from "@/hooks/use-panel";

const data = [
    {
        id: 1,
        title: 'Sign up for 10% off your first order.',
        btnText: 'Sign Up',
        btnUrl:'/account/'
    },
    {
        id: 2,
        title: 'Coats—every friday 75% Off.',
        btnText: 'Shop Sale',
        btnUrl:'/category/blazers'
    },
    {
        id: 3,
        title: 'Summer sale discount off 50%.',
        btnText: 'Sign Sale',
        btnUrl:'/category/activewear'
    }
];

interface IProps {
    className?: string;
};

const TopbarItem: FC<IProps> = ({className = 'relative '}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const { selectedDirection } = usePanel();
    const dir = selectedDirection; // 'ltr' or 'rtl'
    return <div className={cn("ps-12", className)}>
        <Swiper
            dir={dir}
            className={`${dir === 'rtl' ? 'swiper-rtl' : ''}`}
            onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            autoplay={{delay: 5000}} // Configure autoplay delay
        >
            {data.map((item) => (
                <SwiperSlide key={`topbar-key-${item.id}`}>
                    <div className={`px-1 lg:px-3.5`}>
                        {item.title}
                        <Link href={item.btnUrl} className={"ps-1 font-semibold"}>{item.btnText}</Link>
                    </div>

                </SwiperSlide>
            ))}
        </Swiper>

        {/* Custom Arrows */}
        <div className="hidden absolute md:block c-carousel-controls start-0   top-1/2 -translate-y-1/2 ">
            <div className=" flex rtl:flex-row-reverse items-center justify-center gap-1 text-light">
                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className={"w-5 h-5 flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100"}
                >
                    <IoIosArrowBack/>
                </button>

                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className={"w-5 h-5 flex items-center justify-center cursor-pointer  opacity-50  hover:opacity-100"}
                >
                    <IoIosArrowForward/>
                </button>
            </div>

        </div>
    </div>
};

export default TopbarItem;